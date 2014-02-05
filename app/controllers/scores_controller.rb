class ScoresController < ApplicationController
  def new
    @score = Score.new
  end

  def create
    @score = Score.new(params[:score])
    @score.save
    #if @score.save
    #  redirect_to :action => :new
    #end
  end

end
