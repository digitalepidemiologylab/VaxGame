class Score < ActiveRecord::Base
  attr_accessible :network_id, :refusers, :sim_size, :stars, :vax

  belongs_to :user

  serialize :refusers, :vax

  validates :user_id,    presence: true
  validates :network_id, presence: true
  validates :sim_size,   presence: true
  validates :stars,      presence: true, length: { maximum: 1 }
  validates :vax,        presence: true

  default_scope order: 'scores.created_at DESC'

end




