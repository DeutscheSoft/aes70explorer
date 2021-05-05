//
//  ContentView.swift
//  AES70Explorer
//
//  Created by Arne Goedeke on 05.05.21.
//
import SwiftUI
import WebKit

struct WebView : NSViewRepresentable {
    let request: URLRequest
    
    func makeNSView(context: Context) -> WKWebView  {
        return WKWebView()
    }
    
    func updateNSView(_ uiView: WKWebView, context: Context) {
        uiView.load(request)
    }
}

struct ContentView : View {
    let port: Int
    
    init(port: Int) {
        self.port = port;
    }
    
    var body: some View {
        WebView(request: URLRequest(url: URL(string: "http://127.0.0.1:\(self.port)/index.html")!))
    }
}
