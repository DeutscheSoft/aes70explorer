//
//  WebSocketTunnel.swift
//  AES70Explorer
//
//  Created by Arne Goedeke on 06.05.21.
//

import Foundation
import Swifter
import Network
import os

func websocketTunnel(device: AES70Device) -> ((HttpRequest) -> HttpResponse) {
    let host = NWEndpoint.Host(device.host)
    let port = NWEndpoint.Port("\(device.port)")!
    let connection = NWConnection(host: host, port: port, using: .tcp)
    let tunnel = WebSocketTunnel(connection: connection)
    logger.info("Opening WebSocket tunnel to \(device.host):\(device.port)")
    return websocket(
        binary: { (session, data) in tunnel.wsBinary(data: data) },
        connected: { session in tunnel.wsConnected(websocket: session) },
        disconnected: { session in tunnel.wsDisconnected() }
    )
}

let logger = Logger(subsystem: Bundle.main.bundleIdentifier!, category: "network")

class WebSocketTunnel {
    var websocket: WebSocketSession?
    let connection: NWConnection
    var closed: Bool = false
    var wsOutBuffer: [[UInt8]]? = []

    init(connection: NWConnection) {
        self.connection = connection
        self.connection.start(queue: .main)
        self.tcpReader()
    }

    private func didChange(state: NWConnection.State) {
        switch state {
        case .setup:
            break
        case .waiting(let error):
            logger.trace("WebSockeTunnel is waiting \(error.debugDescription)")
        case .preparing:
            break
        case .ready:
            break
        case .failed(let error):
            logger.warning("WebSockeTunnel failed \(error.debugDescription)")
            self.stop()
        case .cancelled:
            logger.trace("WebSockeTunnel cancelled")
            self.stop()
        @unknown default:
            break
        }
    }

    func tcpReader() {
        self.connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { data, _, isDone, error in
            if let data = data, !data.isEmpty {
                if nil != self.wsOutBuffer {
                    self.wsOutBuffer!.append([UInt8](data))
                } else {
                    self.websocket!.writeBinary([UInt8](data))
                }
                logger.info("Received \(data.count) bytes from TCP connection")
                //NSLog("did receive, data: %@", data as NSData)
            }
            if let error = error {
                logger.warning("Reading from TCP connection produced an error \(error.debugDescription)")
                self.stop()
                return
            }
            if isDone {
                logger.info("TCP connection is done.")
                self.stop()
                return
            }
            self.tcpReader()
        }
    }

    func wsConnected(websocket: WebSocketSession) {
        if self.closed {
            websocket.writeCloseFrame()
        } else {
            self.websocket = websocket
            for chunk in self.wsOutBuffer! {
                websocket.writeBinary(chunk)
            }
        }
        self.wsOutBuffer = nil
    }

    func wsDisconnected() {
        logger.info("WebSocket was closed.")
        self.stop()
    }

    func wsBinary(data: [UInt8]) {
        if self.closed {
            return
        }
        logger.info("Received \(data.count) bytes from WebSocket connection")
        self.connection.send(content: Data(data), completion: NWConnection.SendCompletion.contentProcessed { error in
            if (error != nil) {
                self.stop()
            }
        })
    }

    private func stop() {
        if !self.closed {
            self.closed = true

            self.connection.cancel()
            if nil != self.websocket {
                self.websocket!.writeCloseFrame()
            }
        }
    }
}
