//
//  PlayerView.swift
//  CodyChat
//
//  Created by Pawan's MacBook Air on 20/10/23.
//

import SwiftUI

struct PlayerView: View {
    @StateObject var model = PlayerViewModel()
    
    var body: some View {
        NavigationView {
            ZStack {
                VStack {
                    if model.documents.count != 0 {
                        List(model.documents, id: \.id) { doc in
                            NavigationLink(
                                doc.name,
                                destination: DetailsView(url: doc.contentURL)
                                    .navigationTitle(doc.name + " Data")
                            )
                        }
                    } else {
                        Text("No knowledge exist")
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .onAppear {
                    model.getDocument()
                }
                VStack(alignment: .trailing) {
                    Spacer()
                    HStack {
                        Spacer()
                        NavigationLink(destination: 
                                        WebView(url: codyChat)
                            .navigationTitle("Ask Cody")
                        ) {
                            Image("cody")
                                .resizable()
                                .frame(width: 40, height: 40)
                                .padding(10)
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(radius: 5)
                        }
                    }
                    .padding(.trailing, 30)
                }
            }
//            .navigationBarItems(trailing: NavigationLink(destination: AddView()) {
//                Image(systemName: "plus")
//                    .foregroundStyle(Color.blue)
//            })
            .toolbarColorScheme(.dark, for: .automatic)
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("Player")
        }
    }
}

#Preview {
    PlayerView()
}
