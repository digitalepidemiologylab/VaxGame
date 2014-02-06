// scenario basics
var currentScenarioScores;
var scenarioTitle;
var difficulty;
var difficultyIndex;
var realTimeMode;

// scenario constants
var networkSize;
var vaxDifficulty;
var transmissionDifficulty;
var recoveryDifficulty;
var independentOutbreakDifficulty;
var refuserDifficulty;

// score outcomes
var vaccinesUsed;
var quarantinesUsed;
var newSaves;
var independentOutbreaks;
var recoveryRate;
var transmissionRate;
var numberOfRefusers;
var infected;

// graphics
var scoreSVG;
var width = 975;
var height = 800 - 45 - 50;  // standard height - footer:height - footer:bottomMargin

readCurrentScenarioScores();
drawScoreCanvas();
drawScoreHeaders();
stackedChart();

window.setTimeout(pushScoresToHiddenFormFields, 100)


function readCurrentScenarioScores() {
    $.cookie.json = true;
    currentScenarioScores = $.cookie('vaxCurrentScenarioScores');
    scenarioTitle = currentScenarioScores.scenario;

    if (scenarioTitle == "Workplace / School") {
        networkSize = [87,87,87];
        vaxDifficulty = [25,18,15];
        transmissionDifficulty = [0.08, 0.10, 0.15];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,3,4];
        refuserDifficulty = [3,7,14];
    }
    if (scenarioTitle == "Movie Theater / Lecture Hall") {
        networkSize = [48,48,48];
        vaxDifficulty = [5,4,3];
        transmissionDifficulty = [0.50, 0.55, 0.55];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,3,3];
        refuserDifficulty = [2,7,9];
    }
    if (scenarioTitle == "Restaurant") {
        networkSize = [74,74,74];
        vaxDifficulty = [4,3,2];
        transmissionDifficulty = [0.55, 0.65, 0.75];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,3,4];
        refuserDifficulty = [3,5,7];
    }
    if (scenarioTitle == "Organization") {
        networkSize = [50,50,50];
        vaxDifficulty = [5,4,3];
        transmissionDifficulty = [0.45, 0.55, 0.65];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [1,2,3];
        refuserDifficulty = [2,5,7];
    }
    if (scenarioTitle == "Endless Queue") {
        networkSize = [145,145,145];
        vaxDifficulty = [20,15,10];
        transmissionDifficulty = [0.45, 0.55, 0.65];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,5,7];
        refuserDifficulty = [5,10,20];
    }

    if (scenarioTitle == "Random Networks") {
        networkSize = [40,60,85];
        vaxDifficulty = [5, 10, 10];
        transmissionDifficulty = [0.35, 0.50, 0.65];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [1, 2, 3];
        refuserDifficulty = [3, 8, 10];
    }


    difficulty = currentScenarioScores.difficulty;
    realTimeMode = currentScenarioScores.speedMode;

    if (difficulty == "easy") difficultyIndex = 0;
    if (difficulty == "medium") difficultyIndex = 1;
    if (difficulty == "hard") difficultyIndex = 2;

    numberOfIndividuals = networkSize[difficultyIndex];
    vaccinesUsed = vaxDifficulty[difficultyIndex];
    independentOutbreaks = independentOutbreakDifficulty[difficultyIndex];
    transmissionRate = transmissionDifficulty[difficultyIndex];
    recoveryRate = recoveryDifficulty[difficultyIndex];
    numberOfRefusers = refuserDifficulty[difficultyIndex];


    quarantinesUsed = currentScenarioScores.quarantined;
    newSaves = currentScenarioScores.saved;
    infected = numberOfIndividuals - quarantinesUsed - newSaves - vaccinesUsed;



}

function pushScoresToHiddenFormFields() {
    d3.select("#score_scenario").property("value", scenarioTitle)
    d3.select("#score_difficulty").property("value", difficulty)
    d3.select("#score_realtime").property("value", realTimeMode)
    d3.select("#score_infected").property("value", infected)
    d3.select("#score_quarantined").property("value", quarantinesUsed)
    d3.select("#score_saved").property("value", newSaves)
}



function resetHighScores() {



}

function drawScoreCanvas() {
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6

    if (isFirefox || isIE) {
        scoreSVG = d3.select("body").append("svg")
            .attr({
                "width": 950,
                "height": 768 - 45
            })
            .attr("class", "scoreSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }
    else {
        scoreSVG = d3.select("body").append("svg")
            .attr({
                "width": "100%",
                "height": "87.5%"  //footer takes ~12.5% of the page
            })
            .attr("viewBox", "0 0 " + width + " " + height )
            .attr("class", "scoreSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }
}

function drawScoreHeaders() {
    d3.select(".scoreSVG").append("text")
        .attr("class", "scenarioTitle")
        .attr("x", 0)
        .attr("y", 50)
        .text(scenarioTitle)

    d3.select(".scoreSVG").append("text")
        .attr("class", "networkSize")
        .attr("x", 25)
        .attr("y", 80)
        .text("Network Size: " + networkSize[difficultyIndex])

    d3.select(".scoreSVG").append("text")
        .attr("class", "refuserCountText")
        .attr("x", 25)
        .attr("y", 105)
        .text("Refusers: ")

    d3.select(".scoreSVG").append("text")
        .attr("class", "refuserCount")
        .attr("x", 160)
        .attr("y", 105)
        .text(numberOfRefusers)



}

function stackedChart() {
    var width = 125;
    var height = 320;

    var stackedSVG = d3.select(".scoreSVG").append("svg")
        .attr("class", "stacked")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 20)
        .attr("y", 150)
        .append("svg:g")
        .attr("transform", "translate(10,320)");

    x = d3.scale.ordinal().rangeRoundBands([0, width-50])
    y = d3.scale.linear().range([0, height])
    z = d3.scale.ordinal().range(["#b7b7b7","#85BC99","#d9d678" , "#ef5555" ])
    // 1 column

    console.log(newSaves +"\t" +  vaccinesUsed +"\t" +  quarantinesUsed +"\t" +  (networkSize[difficultyIndex] - quarantinesUsed - vaccinesUsed - newSaves))

    var matrix = [
        [ 1,  newSaves, vaccinesUsed, quarantinesUsed, (networkSize[difficultyIndex] - quarantinesUsed - vaccinesUsed - newSaves)]

    ];

    var remapped =["uninfected","vaccinated", "quarantined", "infected"].map(function(dat,i){
        return matrix.map(function(d,ii){
            return {x: ii, y: d[i+1] };
        })
    });

    var stacked = d3.layout.stack()(remapped)

    x.domain(stacked[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y; })]);


    // Add a group for each column.
    var valgroup = stackedSVG.selectAll("g.valgroup")
        .data(stacked)
        .enter().append("svg:g")
        .attr("class", "valgroup")
        .style("fill", function(d, i) { return z(i); })
        .attr("id", function(d,i) { if (i == 0) return "uninfected"; if (i == 1) return "infected"; if (i == 2) return "quarantined"; if (i == 3) return "vaccinated"})



    // Add a rect for each date.
    var rect = valgroup.selectAll("rect")
        .data(function(d){return d;})
        .enter().append("svg:rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return -y(d.y0) - y(d.y); })
        .attr("height", function(d) { return y(d.y); })
        .attr("width", x.rangeBand())
        .attr("id", function(d) {console.log(d)})


    d3.select(".scoreSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", -35)
        .attr("x2", 200)
        .attr("y1", 470)
        .attr("y2", 470)

    d3.select(".scoreSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", -35)
        .attr("x2", -35)
        .attr("y1", 140)
        .attr("y2", 470)

    d3.select(".scoreSVG").append("text")
        .attr("x", -83)
        .attr("y", 162)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("100%")

    d3.select(".scoreSVG").append("text")
        .attr("x", -76)
        .attr("y", 310)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("50%")

    d3.select(".scoreSVG").append("text")
        .attr("x", -72)
        .attr("y", 455)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("0%")



    d3.select(".scoreSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 200)
        .attr("fill", "#ef5555")

    d3.select(".scoreSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 230)
        .attr("fill", "#d9d678")


    d3.select(".scoreSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 260)
        .attr("fill", "#85BC99")


    d3.select(".scoreSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 290)
        .attr("fill", "#b7b7b7")



    d3.select(".scoreSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 213)
        .text("Infected")

    d3.select(".scoreSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 243)
        .text("Quarantined")




    d3.select(".scoreSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 273)
        .text("Vaccinated")



    d3.select(".scoreSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 303)
        .text("Saved")

}