//
//  PlayerViewModel.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation
import SwiftUI

class PlayerViewModel: ObservableObject {
    private let repository = PlayerRepository()
    @Published var data: PlayerModel?
    @Published var error: Bool = false
    @Published var message: String = "" {
        didSet {
            DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
                self.error = false
                self.message = ""
            }
        }
    }
    @Published var documents: [DocumentModel] = []
    
    func getDocument() {
        repository.getDocuments { result in
            self.documents = result.data
        } error: { string in
            self.error = true
            self.message = string
        }
    }
}
