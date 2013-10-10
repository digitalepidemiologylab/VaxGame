var difficultyString;
var customNodeChoice;
var customNeighborChoice;
var customVaccineChoice;
var customOutbreakChoice;


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
        .attr("class", "difficultyItem")
        .attr("id", "difficultyEasy")
        .text("Easy")
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "#707070")
        })
        .on("click", function() {
            difficultyString = "easy"
            initBasicGame(difficultyString);
        })



    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyMedium")
        .text("Medium")



    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyHard")
        .text("Hard")



    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyCustom")
        .text("Custom")


}


function initCustomMenu() {

    d3.select(".difficultySelection").style("top", "40px")

    d3.selectAll(".difficultyItem").remove()
    d3.selectAll(".difficultyItemHighlight").remove()
    d3.selectAll(".difficultyItemGrey").remove()
    d3.selectAll(".difficultyCustom").remove()
    d3.selectAll(".difficultyHeader").remove()

    d3.select("#customMenuDiv").style("visibility", "visible")

    d3.select("#customMenuDiv").append("text")
        .attr("class", "okayButton")
        .text("OKAY")
        .on("click", function() {
            initCustomGame();
        })


}

$(function() {
    $( "#nodeSlider").slider({
        range: "min",
        min: 1,
        max: 150,
        value: 75,
        slide: function (event, ui) {
            $("#customNodes").text("Nodes: " + ui.value);
            customNodeChoice = ui.value;
        }
    });
    $( "#nodeSlider" ).slider( "value", 75);
});

$(function() {
    $( "#degreeSlider").slider({
        range: "min",
        min: 1,
        max: 10,
        value: 4,
        slide: function (event, ui) {
            $("#customDegree").text("Neighbors: " + ui.value + "ea.");
            customNeighborChoice = ui.value;

        }
    });
    $( "#degreeSlider").slider( "value", 4)
});

$(function() {
    $( "#vaccineSlider").slider({
        range: "min",
        min: 1,
        max: 300,
        value: 15,
        slide: function (event, ui) {
            $("#customVaccines").text("Vaccines: " + ui.value);
            customVaccineChoice = ui.value;

        }
    });
    $( "#vaccineSlider").slider( "value", 15)
});

$(function() {
    $( "#outbreakSlider").slider({
        range: "min",
        min: 1,
        max: 5,
        value: 2,
        slide: function (event, ui) {
            $("#customOutbreaks").text("Outbreaks: " + ui.value);
            customOutbreakChoice = ui.value;
        }
    });
    $( "#outbreakSlider").slider( "value", 2)
});




