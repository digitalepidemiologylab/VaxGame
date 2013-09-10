VaxGame::Application.routes.draw do
  root to: 'static_pages#home'

  match '/home', to: 'static_pages#home'
  match '/help', to: 'static_pages#tutorial'
  match '/about', to: 'static_pages#about'
  match '/contact', to: 'static_pages#contact'

  match '/game', to: 'static_pages#test'

  match '/test', to: 'static_pages#test'
  match '/tutorial', to: 'static_pages#tutorial'

end
