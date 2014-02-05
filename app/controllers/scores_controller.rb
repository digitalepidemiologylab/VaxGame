class ScoresController < ApplicationController
  def index
    @original = Score.find_by_scenario("Random Networks")
    @work = Score.find_by_scenario("Workplace / School")
    @theater = Score.find_by_scenario("Movie Theater / Lecture Hall")
    @shop = Score.find_by_scenario("Endless Queue")
    @restaurant = Score.find_by_scenario("Restaurant")
    @club = Score.find_by_scenario("Organization")
  end

  def new
    @score = Score.new

    @original = Score.find_by_scenario("Random Networks")
    @work = Score.find_by_scenario("Workplace / School")
    @theater = Score.find_by_scenario("Movie Theater / Lecture Hall")
    @shop = Score.find_by_scenario("Endless Queue")
    @restaurant = Score.find_by_scenario("Restaurant")
    @club = Score.find_by_scenario("Organization")
  end

  def create
    @score = Score.new(params[:score])
    @score.save
  end

end
