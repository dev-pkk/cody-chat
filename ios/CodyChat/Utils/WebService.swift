//
//  WebService.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation
import Alamofire

class WebService {
    class func getEncoding(_ of: HTTPMethod) -> ParameterEncoding {
        switch of {
        case .get:
            return URLEncoding.queryString
        case .post:
            return JSONEncoding.default
        default:
            return URLEncoding.default
        }
    }
    
    class func getHeader(_ of: HTTPMethod) -> HTTPHeaders {
        var headers: HTTPHeaders = [
            .accept("application/json"),
            .authorization("Bearer \(APIKey)")
        ]
        if of == .post {
            headers.add(.contentType("application/json"))
        }
        return headers
    }

    class func request<T: Codable>(api: API, method: HTTPMethod, params parameters: Parameters? = nil, of type: T.Type, response: @escaping(T) -> Void, error: @escaping(String) -> Void) {
        AF.request(api.url, method: method, parameters: parameters, encoding: getEncoding(method), headers: getHeader(method))
            .validate()
            .responseDecodable(of: T.self) { result in
                switch result.result {
                case .success(let success):
                    response(success)
                case .failure(let failure):
                    error(failure.localizedDescription)
                }
            }
    }
}
