//
//  AES70ExplorerApp.swift
//  AES70Explorer
//
//  Created by Arne Goedeke on 05.05.21.
//

import SwiftUI
import Swifter
import Foundation


class WebServer: NSObject, NetServiceBrowserDelegate, NetServiceDelegate {
    let httpServer: HttpServer = HttpServer();
    let deviceBrowser = DeviceBrowser();
    
    override init() {
        super.init()

        httpServer["/_api/destinations"] = { request in
            return .ok(.data(Data(self.deviceBrowser.getDevicesJSON().utf8), contentType: "application/json"))
        }

        httpServer["/_control/:path"] = { request in
            let deviceName = request.params.first

            if deviceName == nil {
                return .badRequest(.text("Missing device name"))
            }

            let device = self.deviceBrowser.devices[deviceName!.value]

            if device == nil {
                return .notFound    
            }

            return websocketTunnel(device: device!)(request)
        }

        if let resourcePath = Bundle.main.resourcePath {
            //httpServer["/resources/(.+)"] =
            httpServer["/:path"] = shareFilesFromDirectory(resourcePath + "/htdocs/")
        }

        do {
            try httpServer.start(8080, forceIPv4: true)
        } catch {
            print("Failed to start HTTP Server.")
            exit(1)
        }
    }

    func port() throws -> Int {
        return try self.httpServer.port();
    }
}

@main
struct AES70ExplorerApp: App {
    private var server = WebServer();
    
    private func port() -> Int {
        var port = 0
        do {
            port = try server.port()
        } catch {
            print("HTTP Server not running.")
            exit(1)
        }
        return port
    }
    
    var body: some Scene {
        WindowGroup {
            return ContentView(port: port())
        }
    }
}
