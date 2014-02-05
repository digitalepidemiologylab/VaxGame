class Score < ActiveRecord::Base
  attr_accessible :difficulty, :infected, :quarantined, :realtime, :saved, :scenario
  validates_presence_of :scenario, :on => :create
  validates_presence_of :difficulty, :on => :create
  validates_presence_of :infected, :on => :create
  validates_presence_of :quarantined, :on => :create
  validates_presence_of :realtime, :on => :create
  validates_presence_of :saved, :on => :create


end
