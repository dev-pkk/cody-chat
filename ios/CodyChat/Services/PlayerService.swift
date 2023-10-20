//
//  PlayerService.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation

protocol PlayerServiceProtocol {
    func getDocuments(result: @escaping(DocumentsModel) -> Void, error: @escaping(String) -> Void)
}

class PlayerService: PlayerServiceProtocol {
    func getDocuments(result: @escaping (DocumentsModel) -> Void, error: @escaping (String) -> Void) {
        WebService.request(api: .documents, method: .get, of: DocumentsModel.self) { res in
            result(res)
        } error: { err in
            error(err)
        }
    }
}
