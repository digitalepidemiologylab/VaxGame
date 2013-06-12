class Score < ActiveRecord::Base
  attr_accessible :net_id, :refusers, :sim_size, :stars, :vax

  belongs_to :user

  serialize :refusers     # note that serializations cannot be done in parallel, each requires its own line
  serialize :vax

  validates :user_id,    presence: true
  validates :net_id,     presence: true
  validates :sim_size,   presence: true
  validates :stars,      presence: true, length: { maximum: 1 }
  validates :vax,        presence: true

  default_scope order: 'scores.created_at DESC'

end




