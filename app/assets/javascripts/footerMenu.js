function initFooter() {
    // make logo & menuBox
    d3.select("body").append("div")
        .attr("class", "gameVaxLogoDiv")
        .text("VAX!")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = 'http://vax.herokuapp.com/'
        })


    d3.select("body").append("div")
        .attr("class", "gameMenuBox")

// create divs within the menu box, note that because it's float right, we're adding right to left
    d3.select(".gameMenuBox").append("div")
        .attr("class", "gameMenuBoxItem")
        .attr("id", "highScoreNav")
        .text("High Scores")
        .on("click", function() {

            //direct to high score page

        })

    d3.select(".gameMenuBox").append("div")
        .attr("class", "gameMenuBoxItem")
        .attr("id", "helpNav")
        .text("Help")
        .on("click", function() {
            //direct to FAQ w/ link to Tutorial
        })

    d3.select(".gameMenuBox").append("div")
        .attr("class", "gameMenuBoxItem")
        .attr("id", "newGameNav")
        .text("New Game")
        .on("click", function() {
            window.location.href = 'http://vax.herokuapp.com/game'
        })
}