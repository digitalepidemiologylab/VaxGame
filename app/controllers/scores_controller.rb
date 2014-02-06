class ScoresController < ApplicationController
  def index

  end

  def new
    @score = Score.new

    #gon.currentScenario = @score.scenario
    #gon.currentDifficulty = @score.difficulty
    #gon.currentMode = @score.realtime
    #
    #gon.relevantScores = Score.where(scenario: currentScenario).where(difficulty: currentDifficulty).where(realtime: currentMode)

  end

  def create
    @score = Score.new(params[:score])
    @score.save

    gon.relevantScores = Score.where(scenario: @score.scenario)
                              .where(difficulty: @score.difficulty)
                              .where(realtime: @score.realtime)



  end

end