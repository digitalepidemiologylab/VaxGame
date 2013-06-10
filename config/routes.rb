VaxGame::Application.routes.draw do

  resources :users
  resources :sessions, only: [:new, :create, :destroy]


  root to: 'static_pages#home'

  match '/signup',  :to => 'users#new'

  match '/home', to: 'static_pages#home'
  match '/help', to: 'static_pages#help'
  match '/about', to: 'static_pages#about'
  match '/contact', to: 'static_pages#contact'
  match '/game', to: 'static_pages#game'
  match '/play', to: 'static_pages#game'
  match '/outbreak', to: 'static_pages#outbreak'


end
