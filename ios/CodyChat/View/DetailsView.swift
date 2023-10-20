//
//  DetailsView.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import SwiftUI

struct DetailsView: View {
    @StateObject var model = DetailsViewModel()
    let url: String
    
    var body: some View {
        ScrollView {
            VStack {
                Text(model.json)
                    .font(.subheadline)
                Spacer()
            }
        }
        .padding()
        .onAppear {
            model.getData(url: url)
        }
    }
}

#Preview {
    DetailsView(url: "")
}
