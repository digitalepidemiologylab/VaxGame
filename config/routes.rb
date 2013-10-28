VaxGame::Application.routes.draw do
  root to: 'static_pages#home'

  match '/home', to: 'static_pages#home'
  match '/help', to: 'static_pages#faq'
  match '/faq', to: 'static_pages#faq'
  match '/about', to: 'static_pages#faq'
  match '/contact', to: 'static_pages#faq'
  match '/scores', to: 'static_pages#scores'
  match '/herdImmunity', to: 'static_pages#herdImmunity'

  match '/game', to: 'static_pages#game'

  #match '/test', to: 'static_pages#test'
  match '/tour', to: 'static_pages#tour'

end
