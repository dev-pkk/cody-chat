//
//  WebView.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: String
    
    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        guard let url = URL(string: url) else {
            webView.loadHTMLString("Invalid web url.", baseURL: nil)
            return
        }
        let request = URLRequest(url: url)
        webView.load(request)
    }
}

#Preview {
    WebView(url: codyChat)
}
