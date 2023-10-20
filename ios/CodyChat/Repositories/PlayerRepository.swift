//
//  PlayerRepository.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation

protocol PlayerRepositoryProtocol {
    func getDocuments(result: @escaping(DocumentsModel) -> Void, error: @escaping(String) -> Void)
}

class PlayerRepository: PlayerRepositoryProtocol {
    let service: PlayerServiceProtocol
    
    init(service: PlayerServiceProtocol = PlayerService()) {
        self.service = service
    }
    
    func getDocuments(result: @escaping (DocumentsModel) -> Void, error: @escaping (String) -> Void) {
        service.getDocuments(result: result, error: error)
    }
}
