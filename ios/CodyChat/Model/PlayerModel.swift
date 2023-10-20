//
//  PlayerModel.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import Foundation

struct PlayerModel: Codable {
    let currentTrack: CurrentTrack
    let albums: [Album]
    let artists: [Artist]
}


struct CurrentTrack: Codable {
    let id: Int
    let name: String
    let albumId: Int
}

struct Album: Codable {
    let id: Int
    let name: String
    let artistId: Int
}

struct Artist: Codable {
    let id: Int
    let name: String
    let description: String
}

// MARK: - GET Documents
struct DocumentsModel: Codable {
    let data: [DocumentModel]
    let meta: Meta
}

// MARK: - DocumentModel
struct DocumentModel: Codable {
    let id, name, status, contentURL: String
    let folderID: String
    let createdAt: Int
    
    enum CodingKeys: String, CodingKey {
        case id, name, status
        case contentURL = "content_url"
        case folderID = "folder_id"
        case createdAt = "created_at"
    }
}

// MARK: - Meta
struct Meta: Codable {
    let pagination: Pagination
}

// MARK: - Pagination
struct Pagination: Codable {
    let total, count, perPage, currentPage: Int
    let totalPages: Int
    
    enum CodingKeys: String, CodingKey {
        case total, count
        case perPage = "per_page"
        case currentPage = "current_page"
        case totalPages = "total_pages"
    }
}
