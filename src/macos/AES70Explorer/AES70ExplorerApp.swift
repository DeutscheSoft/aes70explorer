//
//  AES70ExplorerApp.swift
//  AES70Explorer
//
//  Created by Arne Goedeke on 05.05.21.
//

import SwiftUI
import Swifter
import Foundation

func createHTTPServer() -> HttpServer {
    let httpServer = HttpServer()
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
    return httpServer
}

@main
struct AES70ExplorerApp: App {
    private var server = createHTTPServer();
    
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
