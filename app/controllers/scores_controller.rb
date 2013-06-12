class ScoresController < ApplicationController

  def create
    score = current_user.scores.build(params[:score])
    if score.save
      flash[:success] = 'Score saved!'
      redirect_to root_url
    else
      render 'static_pages/home'
    end
  end

  def destroy
  end
end