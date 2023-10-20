//
//  DetailsViewModel.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation
import Alamofire

class DetailsViewModel: ObservableObject {
    @Published var json: String = "Loading..."
    
    func getData(url: String) {
        guard let url = URL(string: url) else {
            json = "Invalid details url"
            return
        }
        AF.request(url, headers: [.authorization("Bearer \(APIKey)")])
            .validate()
            .responseData { response in
                switch response.result {
                case .success(let data):
                    guard let object = try? JSONSerialization.jsonObject(with: data, options: []),
                          let json = try? JSONSerialization.data(withJSONObject: object, options: [.prettyPrinted]) else {
                        self.json = "Invalid JSON Reponse."
                        return
                    }
                    self.json = String(data: json, encoding: .utf8) ?? ""
                case .failure(let failure):
                    self.json = failure.localizedDescription
                }
            }
    }
}
