VaxGame::Application.routes.draw do
  root to: 'static_pages#home'

  resources :users
  resources :sessions, only: [:new, :create, :destroy]
  resources :scores

  match '/home', to: 'static_pages#home'
  match '/help', to: 'static_pages#tutorial'
  match '/about', to: 'static_pages#about'
  match '/contact', to: 'static_pages#contact'

  match '/signup',  to: 'users#new'
  match '/signin',  to: 'sessions#new'
  match '/signout', to: 'sessions#destroy', via: :delete

  match '/test', to: 'static_pages#test'
  match '/tutorial', to: 'static_pages#tutorial'

  match '/game',       to: 'scores#game'


end
