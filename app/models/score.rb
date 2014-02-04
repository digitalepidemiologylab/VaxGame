class Score < ActiveRecord::Base
  attr_accessible :difficulty, :infected, :quarantined, :realtime, :saved, :scenario
end
