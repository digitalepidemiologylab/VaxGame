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
//    d3.select(".gameMenuBox").append("div")
//        .attr("class", "gameMenuBoxItem")
//        .attr("id", "highScoreNav")
//        .text("High Scores")
//        .on("click", function() {
//
//            //direct to high score page
//
//        })

    d3.select(".gameMenuBox").append("div")
        .attr("class", "gameMenuBoxItem")
        .attr("id", "helpNav")
        .text("FAQ")
        .on("click", function() {
            window.location.href = 'http://vax.herokuapp.com/faq'
        })
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "white")
        })

    d3.select(".gameMenuBox").append("div")
        .attr("class", "gameMenuBoxItem")
        .attr("id", "newGameNav")
        .text("New Game")
        .on("click", function() {
            window.location.href = 'http://vax.herokuapp.com/game'
        })
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "white")
        })
}

function initMainFooter() {
    d3.select("body").append("div")
        .attr("class", "gameVaxLogoDiv")
        .text("VAX!")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = 'http://vax.herokuapp.com/'
        })

    d3.select("body").append("div")
        .attr("class", "about")
        .text("Salathé Group @ Penn State")
        .on("click", function() {
            window.location.href = 'http://salathegroup.com/'
        })


}