//
//  API.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation
import Alamofire

enum API {
    case documents
    case document(Int)
}

extension API {
    var url: String {
        var path = ""
        switch self {
        case .documents: path = "documents"
        case .document(let id): path = "documents/\(id)"
        }
        
        return BASE_URL + path
    }
}
