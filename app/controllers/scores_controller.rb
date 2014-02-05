class ScoresController < ApplicationController
  def new
    @score = Score.new
  end

  def create
    @score = Score.new()
    @score.save
  end

  def destroy
  end




end
