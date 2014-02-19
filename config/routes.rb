VaxGame::Application.routes.draw do
  resources :scores, only: [:new, :create]

  root to: 'static_pages#home'

  match '/home', to: 'static_pages#home'
  match '/tour', to: 'static_pages#tour'
  match '/help', to: 'static_pages#faq'
  match '/faq', to: 'static_pages#faq'
  match '/about', to: 'static_pages#faq'
  match '/contact', to: 'static_pages#faq'
  match '/herdImmunity', to: 'static_pages#herdImmunity'
  match '/herdimmunity', to: 'static_pages#herdImmunity'
  match '/scenario', to: 'static_pages#scenarioSelect'
  match '/scenarioGame', to: 'static_pages#scenarioGame'
  match '/scores', to: 'scores#new'

  match '/game', to: 'static_pages#game'

end
