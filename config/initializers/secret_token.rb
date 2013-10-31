# Be sure to restart your server when you modify this file.

# Your secret key for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!
# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.

# local secret token are generated each time, security not of primary concern
# deployment secret token is set manually with heroku config:set SECRET_TOKEN=[not_the_actual_secret_token]

VaxGame::Application.config.secret_token = if Rails.env.development? or Rails.env.test?
  ('x' * 30)
else
 ENV['SECRET_TOKEN']
end