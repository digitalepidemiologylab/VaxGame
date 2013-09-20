var customLevelText;
var customNodesText;
var customConnectionsText;
var customVaccinesText;
var customIndependentInfections;
var customConfirm;

var difficultyString;


function initBasicMenu() {
    // new game header at top-left
    d3.select("body").append("div")
        .attr("class", "newGameHeader")
        .text("NEW GAME")

    // difficulty selection div
    d3.select("body").append("div")
        .attr("class", "difficultySelection")

    // header for difficulty selection
    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyHeader")
        .text("DIFFICULTY")

    // difficulty menu items
    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemHighlight")
        .attr("id", "difficultyEasy")
        .text("Easy")
        .on("click", function() {
            difficultyString = "easy";
            initBasicGame(difficultyString);
        })


    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItem")
        .attr("id", "difficultyMedium")
        .text("Medium")
        .on("click", function() {
            difficultyString = "medium";
            initBasicGame(difficultyString);
        })


    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyHard")
        .text("Hard")
        .on("click", function() {
            difficultyString = "hard";
            initBasicGame(difficultyString);
        })


    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyCustom")
        .text("Custom")
        .on("click", function() {
            initCustomMenu();
        })

}


function initCustomMenu() {
    // remove previous menu's text
    d3.select(".difficultySelection").style("visibility", "hidden")



    // make the custom menu div visible
    d3.select("#customMenuDiv").style("visibility", "visible")

    customLevelText = d3.select("#customMenuDiv").append("text")
        .attr("class", "customLevelText")
        .attr("x", 400)
        .attr("y", 100)
        .text("CUSTOM LEVEL")

    customNodesText = d3.select("#customMenuDiv").append("text")
        .attr("class", "customNodeText")
        .attr("x", 400)
        .attr("y", 150)
        .text("Nodes: ") //TODO

    customConnectionsText = d3.select("#customMenuDiv").append("text")
        .attr("class", "customConnectionsText")
        .attr("x", 400)
        .attr("y", 200)
        .text("Connections per Node: ") //TODO

    customVaccinesText = d3.select("#customMenuDiv").append("text")
        .attr("class", "customeVaccinesText")
        .attr("x", 400)
        .attr("y", 250)
        .text("Vaccines: ") //TODO

    customIndependentInfections = d3.select("#customMenuDiv").append("text")
        .attr("class", "customIndependentInfections")
        .attr("x", 400)
        .attr("y", 350)
        .text("Outbreaks: ") //TODO

    customConfirm = d3.select("#customMenuDiv").append("text")
        .attr("class", "customConfirm")
        .attr("x", 400)
        .attr("y", 400)
        .text("OKAY") //TODO




}