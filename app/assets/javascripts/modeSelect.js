var drawButton = false;
var modeDifficulty;
var graph = {};

$(function() {
    $( "#accordion" ).accordion();
    drawButtons();
});
$( "#accordion" ).accordion({ heightStyle: "auto" });

d3.select("body").append("div")
    .attr("class", "modeVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = 'http://vax.herokuapp.com/'
    })

d3.select("body").append("div")
    .attr("class", "scenarioTitle")
    .text("Scenarios")
    .style("position", "absolute")
    .style("top", "170px")
    .style("left", "200px")
    .style("font-family", "Nunito")
    .style("font-size", "32px")
    .style("font-weight", "400")
    .style("color" , "#707070")


function drawButtons() {
    if (!drawButton) {
        drawButton = true;
        d3.selectAll(".actionBay").append("svg")
            .attr({
                "width": 300,
                "height": 50
            })
            .attr("class", "difficultyButtons")
            .attr("pointer-events", "all")
            .style("position", "relative")
            .style("left", "160px")


        d3.selectAll(".difficultyButtons").append("circle")
            .attr("class", "easyMode")
            .attr("r", 15)
            .attr("fill", "black")
            .attr("cx", 20)
            .attr("cy", 20)
            .on("click", function() {loadStaticNetwork("easy")});

        d3.selectAll(".difficultyButtons").append("text")
            .attr("class", "easyText")
            .attr("x", 40)
            .attr("y", 25)
            .text("Easy")


        d3.selectAll(".difficultyButtons").append("circle")
            .attr("class", "MediumMode")
            .attr("r", 15)
            .attr("fill", "black")
            .attr("cx", 125)
            .attr("cy", 20)
            .on("click", function() {loadStaticNetwork("medium")});


        d3.selectAll(".difficultyButtons").append("text")
            .attr("class", "mediumText")
            .attr("x", 145)
            .attr("y", 25)
            .text("Medium")

        d3.selectAll(".difficultyButtons").append("circle")
            .attr("class", "hardMode")
            .attr("r", 15)
            .attr("fill", "black")
            .attr("cx", 245)
            .attr("cy", 20)
            .on("click", function() {loadStaticNetwork("hard")});


        d3.selectAll(".difficultyButtons").append("text")
            .attr("class", "hardText")
            .attr("x", 265)
            .attr("y", 25)
            .text("Hard")
    }
}

function loadStaticNetwork(difficulty) {
    // when called, it will record the current active header title (scenario title)
    scenarioTitle = $(".ui-accordion-header-active").text();
    setDifficultyConstants(difficulty);

    if (scenarioTitle == "Workplace / School") graph = initWorkNet();
    if (scenarioTitle == "Movie Theater / Lecture Hall") graph = initTheaterNet();
    if (scenarioTitle == "Restaurant") graph = initRestaurantNet();
    if (scenarioTitle == "Organization") graph = initClubNet();
    if (scenarioTitle == "Shopping") graph = initShopNet();


    // remove accordion & title
    // move logo down
    // init footer
    d3.select("#accordion").remove()
    d3.select(".modeVaxLogoDiv").attr("class", "gameVaxLogoDiv").style("left", "0px")
    d3.select(".scenarioTitle").remove()
    initFooter();
    d3.select(".gameMenuBox").on("click", function() {
        window.location.href = 'http://0.0.0.0:3000/mode'
    })



    // draw base SVG

    // draw vax button

    // initialize a footer

    // draw node pinning

    // set game initial conditions



}

function setDifficultyConstants(difficulty) {

}


