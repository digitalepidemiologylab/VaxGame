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
var submitted = false;

// graphics
var scoreSVG;
var width = 975;
var height = 800 - 45 - 50;  // standard height - footer:height - footer:bottomMargin

var comparableGames = {};
var meanScores = [];

readCurrentScenarioScores();
drawScoreCanvas();
drawScoreHeaders();
stackedChart();

window.setTimeout(pushScoresToHiddenFormFields, 100)

// block to gather scores from database after POST
comparableGames = gon.relevantScores;
var infectedSum = 0;
var savedSum = 0;
var quarantinedSum = 0;

var savedDistribution = [];
var infectedDistribution = [];
var quarantinedDistribution = [];

for (var i = 0; i < comparableGames.length; i++) {
    infectedDistribution.push(comparableGames[i].infected)
    savedDistribution.push(comparableGames[i].saved)
    quarantinedDistribution.push(comparableGames[i].quarantined)

    infectedSum += comparableGames[i].infected;
    savedSum += comparableGames[i].saved;
    quarantinedSum += comparableGames[i].quarantined;
}

meanScores[0] = infectedSum / comparableGames.length;
meanScores[1] = savedSum / comparableGames.length;
meanScores[2] = quarantinedSum / comparableGames.length;

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
    submitted = true;
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
        .attr("class", "vaxAvailable")
        .attr("x", 25)
        .attr("y", 105)
        .text("Vaccines: ")

    d3.select(".scoreSVG").append("text")
        .attr("class", "vaxCount")
        .attr("x", 165)
        .attr("y", 105)
        .text(vaxDifficulty[difficultyIndex])


    d3.select(".scoreSVG").append("text")
        .attr("class", "refuserCountText")
        .attr("x", 25)
        .attr("y", 130)
        .text("Refusers: ")

    d3.select(".scoreSVG").append("text")
        .attr("class", "refuserCount")
        .attr("x", 165)
        .attr("y", 130)
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


function plotHistogram(distribution, numberOfTicks) {

    // format a string for the counts of each bin
    var formatCount = d3.format(",.0f");

    var margin = {top: 150, right: 30, bottom: 30, left: 450},
        width = 950 - margin.left - margin.right,
        height = 350 - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, numberOfIndividuals])
        .range([0, width]);

// Generate a histogram using input value of uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(numberOfTicks))
        (distribution)


    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(numberOfTicks)

    var svg = d3.select(".scoreSVG").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .text(function(d) { return formatCount(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    // y-axis line & label
    d3.select(".scoreSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", 450)
        .attr("x2", 920)
        .attr("y1", 470)
        .attr("y2", 470)

    d3.select(".scoreSVG").append("text")
        .attr("x", 375)
        .attr("y", 275)
        .style("font-family", "Nunito")
        .style("font-size", "19px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("Players")

    d3.select(".scoreSVG").append("text")
        .attr("x", 386)
        .attr("y", 295)
        .style("font-family", "Nunito")
        .style("font-size", "19px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("with")

    d3.select(".scoreSVG").append("text")
        .attr("x", 381)
        .attr("y", 315)
        .style("font-family", "Nunito")
        .style("font-size", "19px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("Score")

    // x-axis line & label
    d3.select(".scoreSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", 450)
        .attr("x2", 450)
        .attr("y1", 140)
        .attr("y2", 470)

    d3.select(".scoreSVG").append("text")
        .attr("x", 640)
        .attr("y", 515)
        .style("font-family", "Nunito")
        .style("font-size", "19px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("Number Saved")

    drawNavButtons();
}

function drawNavButtons() {
    d3.select(".scoreSVG").append("text")
        .attr("class", "recapButton")
        .attr("x", 364)
        .attr("y", 675)
        .text("Replay")
        .style("cursor", "pointer")
        .style("font-size", "40px")
        .on("click", retryScenario)
        .on("mouseover", function() {
            d3.select(this).style("fill", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "#707070")
        })

    d3.select(".scoreSVG").append("text")
        .attr("class", "recapButton")
        .attr("x", 300)
        .attr("y", 625)
        .text("New Scenario")
        .style("cursor", "pointer")
        .style("font-size", "40px")
        .on("click", function() {window.location.href = "/scenario"})
        .on("mouseover", function() {
            d3.select(this).style("fill", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "#707070")
        })

    // share buttons
    var twitterText = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2F.vax.herokuapp.com&text=I just stopped an epidemic in its tracks! Can you can save more than " + newSaves + "people on " + difficulty + "? Fight the outbreak at&url=http%3A%2F%2Fvax.herokuapp.com";
    var facebookText = "http://www.facebook.com/sharer.php?s=100&p[title]=Vax! | Gamifying Epidemic Prevention&p[summary]=I just stopped an epidemic in its tracks! Can you save more than " + newSaves + "people on " + difficulty + "?&p[url]=http://vax.herokuapp.com";

    d3.select(".scoreSVG").append("image")
        .attr("x", 830 - 218)
        .attr("y", 65)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/img/facebook_icon.png")
        .attr("class", "shareIcon")
        .attr("id", "facebook")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .attr("opacity", 0)
        .on("click", function() {
            window.location.href = facebookText;
        })

    d3.select(".scoreSVG").append("image")
        .attr("x", 905 - 218)
        .attr("y", 65)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/img/twitter_icon.png")
        .attr("class", "shareIcon")
        .attr("id", "twitter")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = twitterText;
        })

    d3.select(".scoreSVG").append("image")
        .attr("x", 985 - 218)
        .attr("y", 65)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/img/googleplus_icon.png")
        .attr("class", "shareIcon")
        .attr("id", "g+")
        .attr("opacity", 0)
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = "https://plus.google.com/share?url=http://vax.herokuapp.com";
        })

    d3.select(".scoreSVG").append("text")
        .attr("x", 790 - 200)
        .attr("y", 50)
        .style("font-family", "Nunito")
        .style("font-size", "40px")
        .style("font-weight", "500")
        .style("cursor", "pointer")
        .style("fill", "#707070")
        .text("Share ▾")
        .on("click", function() {
            d3.selectAll(".shareIcon")
                .transition()
                .duration(500)
                .attr("opacity", 0.45)
        })
}


function retryScenario() {
    $.cookie.json = true;
    var currentGameCookie = {scenario: scenarioTitle, difficulty: difficulty, speedMode:realTimeMode, refusers: refuserDifficulty[difficultyIndex], vax: vaxDifficulty[difficultyIndex], outbreaks: independentOutbreakDifficulty[difficultyIndex], transmissionRate: transmissionRate, recoveryRate: recoveryRate}
    $.cookie('vaxCurrentGame', JSON.stringify(currentGameCookie), { expires: 365, path: '/' })
    window.location.href = '/scenarioGame'

}
