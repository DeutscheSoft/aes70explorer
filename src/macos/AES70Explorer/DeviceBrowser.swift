//
//  DeviceBrowser.swift
//  AES70Explorer
//
//  Created by Arne Goedeke on 06.05.21.
//

import Foundation

func extractIPv4Address(addresses: [Data]) -> String? {
    var result: String?

    for addr in addresses {
        let data = addr as NSData
        var storage = sockaddr_storage()
        data.getBytes(&storage, length: MemoryLayout<sockaddr_storage>.size)

        if Int32(storage.ss_family) == AF_INET {
            let addr4 = withUnsafePointer(to: &storage) {
                $0.withMemoryRebound(to: sockaddr_in.self, capacity: 1) {
                    $0.pointee
                }
            }

            if let ip = String(cString: inet_ntoa(addr4.sin_addr), encoding: .ascii) {
                result = ip
                break
            }
        }
    }

    return result
}

struct AES70Device: Codable, Hashable {
    var name: String
    var host: String
    var port: Int
    var proto = "tcp"
    var source = "dnssd"

    init(service: NetService) {
        name = service.name + "." + service.hostName!
        host = extractIPv4Address(addresses: service.addresses!)!
        port = service.port
    }

    enum CodingKeys: String, CodingKey {
        case name
        case host
        case port
        case proto = "protocol"
        case source
    }

    static func == (lhs: AES70Device, rhs: AES70Device) -> Bool {
        return lhs.name == rhs.name
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(name)
    }
}


class DeviceBrowser: NSObject, NetServiceBrowserDelegate, NetServiceDelegate {
    let serviceBrowser = NetServiceBrowser();
    var devices: Set<AES70Device> = []
    var resolving: Set<NetService> = []
    var encodedDevices: String? = nil;

    func getDevices() -> Array<AES70Device> {
        return Array(devices)
    }

    func getDevicesJSON() -> String {
        if nil == encodedDevices {
            let jsonEncoder = JSONEncoder()
            let data = try! jsonEncoder.encode(getDevices())
            encodedDevices = String(data: data, encoding: .utf8)!
        }

        return encodedDevices!
    }

    override init() {
        super.init()
        serviceBrowser.delegate = self
        serviceBrowser.searchForServices(ofType: "_oca._tcp", inDomain: "local.")
    }

    func netService(_ sender: NetService, didNotResolve errorDict: [String : NSNumber]) {
        print("Service did not resolve: \(sender.name)")
    }

    func netServiceDidResolveAddress(_ sender: NetService) {
        print("service resolved: \(sender.hostName!)")
        let device = AES70Device(service: sender)
        if !devices.contains(device) {
            devices.insert(device)
            encodedDevices = nil
        }
        resolving.remove(sender)
        let jsonEncoder = JSONEncoder()
        let data = try! jsonEncoder.encode(getDevices())
        let str = String(data: data, encoding: .utf8)!
        print("json of device: \(str)")
    }

    func netServiceDidStop(_ sender: NetService) {
        print("resolve did end \(sender.name)")
        resolving.remove(sender)
    }

    func netServiceBrowser(_ browser: NetServiceBrowser, didFind service: NetService, moreComing: Bool) {
        print("service found: \(service.name)")
        //self.currentService = service
        service.delegate = self
        service.resolve(withTimeout: 5)
        resolving.insert(service)
    }

    func netServiceBrowser(_ browser: NetServiceBrowser, didRemove service: NetService, moreComing: Bool) {
        print("service removed: \(service.name)")
        //self.currentService = service
        //service.delegate = self.serviceAgent
        //service.resolve(withTimeout: 5)
        if nil != service.hostName {
            let device = AES70Device(service: service)
            if devices.contains(device) {
                devices.remove(device)
                encodedDevices = nil
            }
        }
    }
}
