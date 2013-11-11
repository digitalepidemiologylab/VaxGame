var redistribute;

var globalMax;
var globalMaxConnected;
var globalMaxConnectedLabel;
var susceptibleNeighbors;
var meanFinalEpidemicSizes = [0,0,0,0,0,0,0,0,0];
var coverages = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90]
var meanMeasuredR0 = [0,0,0,0,0,0,0,0,0];

var hiNodeSize = 13;
var simSet = 0;
var vaxCoverage = 0;

var visualizationTimesteps = 600;

var mainScreen = false;
var flu = false;
var imperfectVaccines = false;

function hiAdvance() {
    if (hiGuide == 1) {
        d3.select("#advanceHI").text("Next >")
        d3.select("#hiGuideText")
            .html("What is herd immunity?")

        d3.select("#headerHI").transition().duration(2000).attr("opacity", 0)
    }

    if (hiGuide == 2) {
        d3.select("#hiGuideText")
            .html("When a <b>large proportion</b> of a population acquires immunity, <br> the few that are still <b>susceptible</b> to a particular infectious disease <br> (the very old, young, and sick) <b>remain protected</b><i>...but why?</i>")

    }

    if (hiGuide == 3) {
        d3.select("#hiGuideText")
            .html("If we vaccinate a <b>large proportion</b> of the population at <b>random</b>, <br> there are likely to be <b>few connected susceptible people</b>. <br>This is the <i>key</i> to understanding herd immunity...")

        window.setTimeout(function() {

            // randomly vaccinate 80%
            for (var i = 0; i < graph.nodes.length; i++) {
                if (Math.random() < 0.80) graph.nodes[i].status = "V";
                else graph.nodes[i].status = "S";
            }

            d3.selectAll(".node")
                .style("fill", function(d) {
                    if (d.status == "V") {return "#76A788";}
                    if (d.status == "S") return "#b7b7b7";})

        }, 1000)
    }

    if (hiGuide == 4) {
        d3.select("#hiGuideText")
            .html("No matter how many times we randomly redistribute<br>  vaccines, susceptible clusters remain small. <br> <i>Sometimes they're even by themselves!</i>")

        window.setTimeout(function() {
            redistribute = window.setInterval(function() {

                d3.selectAll(".link")
                    .style("stroke-width", "2px")

                d3.select(".maxNumber").remove();

                window.setTimeout(function() {
                    for (var i = 0; i < graph.nodes.length; i++) graph.nodes[i].status = "S";
                    d3.selectAll(".node").style("fill", "#b7b7b7");
                }, 300)


                window.setTimeout(function() {
                    for (var i = 0; i < graph.nodes.length; i++) {
                        if (Math.random() < 0.80) graph.nodes[i].status = "V";
                        else graph.nodes[i].status = "S";
                    }

                    // color accordingly
                    d3.selectAll(".node")
                        .style("fill", function(d) {
                            if (d.status == "V") return "#76A788";
                            if (d.status == "S") return "#b7b7b7";
                        })


                    globalMax = findMaxConnectedByType("S", "S")


                    d3.selectAll(".node")
                        .transition()
                        .duration(500)
                        .attr("r", function(d) {
                            if (d.id == globalMax.id) {
                                globalMaxConnectedLabel = d3.select("#hiSVG").append("text")
                                    .attr("class", "maxNumber")
                                    .attr("x", d.x - 4)
                                    .attr("y", d.y + 6)
                                    .style("font-family", "Nunito")
                                    .style("font-weight", "500")
                                    .style("font-size", "12px")
                                    .text(globalMaxConnected);
                                return 18;
                            }
                            else return 12;
                        })
                        .style("fill", function(d) {
                            if (d.id == globalMax.id) return "#fab45a";
                            else {
                                if (d.status == "V") return "#76A788";
                                if (d.status == "S") return "#b7b7b7";
                            }
                        })

                    d3.selectAll(".link")
                        .style("stroke-width", function(l) {

                            if (l.source == globalMax) {
                                if (l.target.status == "S") return "5px";
                                else return "0px";
                            }

                            if (l.target == globalMax) {
                                if (l.source.status == "S") return "5px";
                                else return "0px";
                            }

                            if (l.source.status == "S" && l.target.status == "S") return "5px";
                            else return "0px";

                            if (l.source.status == "V" || l.target.status == "V") return "0px";


                        })

                }, 750)






            }, 2500)
        } , 300)

    }

    if (hiGuide == 5) {

        d3.select(".maxNumber").remove();
        redistribute = window.clearInterval(redistribute);
        d3.select("#playNetSVG").remove();

        d3.select("#hiSVG").append("text")
            .attr("class", "measlesText")
            .attr("x", 320)
            .attr("y", 350)
            .style("font-size", "60px")
            .style("font-family", "Nunito")
            .style("font-weight", 700)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Measles")

        d3.select("#hiSVG").append("text")
            .attr("class", "measlesText")
            .attr("x", 380)
            .attr("y", 400)
            .style("font-size", "24px")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("R₀ = 13-18")


        d3.select("#hiGuideText")
            .html("We'll demonstrate the benefits of herd immunity by <b>simulating</b> a measles <b>outbreak</b>, <br> a <b>highly infectious virus</b> that causes childhood disease.")

    }

    if (hiGuide == 6) {
        d3.selectAll(".measlesText")
            .transition()
            .duration(500)
            .attr("opacity", 0)

        window.setTimeout(function() {d3.selectAll(".measlesText").remove()}, 600)


        d3.select("#hiGuideText")
            .html("First some background, the average number of cases <br> that the <i>first infected person</i> will produce is called <br> the <b>basic reproductive number</b>, or <b>R₀</b> ('<i>R naught</i>').")

       drawPlayNet();

       graph.nodes[0].status = "I";
       d3.selectAll(".node").style("fill", function(d) {if (d.status == "I") return "#ef5555"})

    }

    if (hiGuide == 7) {
        timestep = 1;
        var neighbors = findNeighbors(graph.nodes[0]);
        for (var i = 0; i < neighbors.length; i++) {
            for (var ii = 0; ii < graph.nodes.length; ii++) {
                if (neighbors[i] == graph.nodes[ii]) {
                    graph.nodes[ii].status = "I";
                    graph.nodes[ii].exposureTimestep = timestep;
                    graph.nodes[ii].infectedBy = graph.nodes[0];
                    newInfections.push(graph.nodes[ii]);
                }
            }
        }
        d3.select("#hiGuideText")
            .html("<b> Patient Zero </b> infected all " + neighbors.length + " of their neighbors. <br> In this case the basic reproductive number, <b>R₀</b>, equals " + neighbors.length + ".")

        window.setTimeout(animateGamePathogens_thenUpdateHI, 500);
    }

    if (hiGuide == 8) {
        d3.select("#hiGuideText")
            .html("R₀ is powerfully affected by how easily it <i>spreads</i>, <br> how quickly people <i>recover</i>, and the <i>structure</i> of the contact network.")
    }


    if (hiGuide == 9) {

        transmissionRate = 0.90;
        recoveryRate = 0.20;

        d3.select("#hiSVG").append("circle")
            .attr("cx",925)
            .attr("cy",400)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#b7b7b7")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070")

        d3.select("#hiSVG").append("text")
            .attr("x", 960)
            .attr("y", 410)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Susceptible")


        d3.select("#hiSVG").append("circle")
            .attr("cx",925)
            .attr("cy",475)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#ef5555")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070")

        d3.select("#hiSVG").append("text")
            .attr("x", 960)
            .attr("y", 485)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Infected")

        d3.select("#hiSVG").append("circle")
            .attr("cx",925)
            .attr("cy",550)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#9400D3")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070")


        d3.select("#hiSVG").append("text")
            .attr("x", 960)
            .attr("y", 560)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Recovered")

        d3.select("#hiSVG").append("circle")
            .attr("cx",925)
            .attr("cy",625)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#76A788")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070")

        d3.select("#hiSVG").append("text")
            .attr("x", 960)
            .attr("y", 635)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Vaccinated")


        d3.select("#hiGuideText")
            .html("Let's see how far a measles outbreak will spread with 10% vaccination coverage...")

        d3.select("#advanceHI").style("color", "#707070")


        for (var i = 0; i < graph.nodes.length; i++) {
            if (Math.random() < 0.10) graph.nodes[i].status = "V";
            else graph.nodes[i].status = "S";

            graph.nodes[i].infectedBy = null;
            graph.nodes[i].exposureTimestep = null;
        }


        do {
            var indexPatientID = Math.floor(Math.random() * graph.nodes.length);
        }
        while (graph.nodes[indexPatientID].status == "V");

        timestep = 0;
        graph.nodes[indexPatientID].status = "I";
        graph.nodes[indexPatientID].infectedBy = null;
        graph.nodes[indexPatientID].exposureTimestep = timestep;
        diseaseIsSpreading = true;
        timeToStop = false;

        timestep++;

        d3.selectAll(".node")
            .style("fill", function(d) {
                if (d.status == "V") return "#76A788";
                if (d.status == "S") return "#b7b7b7";
                if (d.status == "I") return "#ef5555";
            })

        recoveryRate = 0.05;
        transmissionRate = 0.25;

        hiTimesteps();



    }

    if (hiGuide == 10) {

        d3.select("#hiGuideText")
            .html("In most cases, everyone who wasn't vaccinated will be infected. <br> " +
                "But let's play with the dials and run a <i>few thousand simulations...</i> <br>" + "<b>For Science!</b>")
    }

    if (hiGuide == 11) {
        d3.selectAll(".legendText")
            .transition()
            .duration(500)
            .attr("opacity", 0)
        d3.selectAll(".legendCircle")
            .transition()
            .duration(500)
            .attr("opacity", 0)

        recoveryRate = 0.2;
        transmissionRate = 0.90;

        mainScreen = true;
        hiNodeSize = 13;
        drawRepeatNet();
        plotBar(meanFinalEpidemicSizes)
        simSet = 0;
        runVisualizationSims();

    }

    if (hiGuide == 12) {
        d3.select("#hiGuideText")
            .html("For measles, the vaccination coverage required <br> to achieve herd immunity is about 90%!")
    }

    if (hiGuide == 13) {
        d3.select("#hiGuideText")
            .html("Let's try that again, but with a more common disease like influenza...")

    }

    if (hiGuide == 14) {
        maxYaxis = 40;

        d3.select("#playNetSVG").remove();
        d3.selectAll("#barChart").remove();

        d3.select("#hiSVG").append("text")
            .attr("class", "fluText")
            .attr("x", 320)
            .attr("y", 350)
            .style("font-size", "60px")
            .style("font-family", "Nunito")
            .style("font-weight", 700)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Influenza")


        d3.select("#hiSVG").append("text")
            .attr("class", "fluText")
            .attr("x", 383)
            .attr("y", 400)
            .style("font-size", "30px")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("R₀ = 1.5-3")

    }

    if (hiGuide == 15) {

        flu = true;
        d3.selectAll(".fluText").remove();
        transmissionRate = 0.25;
        recoveryRate = 0.35;

        meanFinalEpidemicSizes = [0,0,0,0,0,0,0,0,0]

        mainScreen = true;
        hiNodeSize = 13;
        drawRepeatNet();
        plotBar(meanFinalEpidemicSizes)
        simSet = 0;
        runVisualizationSims();


    }

    if (hiGuide == 16) {
        d3.select("#hiGuideText")
            .html("For influenza, the herd immunity threshold is just over 50%. <br> But our simulation seems to suggest its a lot lower...")
    }

    if (hiGuide == 17) {
        d3.select("#hiGuideText")
            .html("Flu vaccines are not always effective, so higher vaccination coverages are necessary.")
    }

    if (hiGuide == 18) {
        d3.select("#hiGuideText")
            .html("So let's try that again but allow vaccines to fail for various reasons... <br><br>" +
                " <div align=center> People who have already been exposed</div>  <div align=center> Weak immune responses</div> <div align=center> Defective doses</div> ");
    }

    if (hiGuide == 19) {
        maxYaxis = 35;

        d3.select("#playNetSVG").remove();
        d3.selectAll("#barChart").remove();

        flu = true;
        imperfectVaccines = true;
        d3.selectAll(".fluText").remove();
        transmissionRate = 0.25;
        recoveryRate = 0.35;

        meanFinalEpidemicSizes = [0,0,0,0,0,0,0,0,0]

        mainScreen = true;
        hiNodeSize = 13;
        drawRepeatNet();
        plotBar(meanFinalEpidemicSizes)
        simSet = 0;
        runVisualizationSims();


    }





    d3.select("#hiGuideText").transition().duration(500).style("color", textHex);

}

function animateGamePathogens_thenUpdateHI() {
    window.setTimeout(createGamePathogensHI  , visualizationTimesteps * 0.1)
    window.setTimeout(moveGamePathogensHI    , visualizationTimesteps * 0.2)
    window.setTimeout(popNewGameInfectionHI  , visualizationTimesteps * 0.3)
    window.setTimeout(removeGamePathogensHI  , visualizationTimesteps * 0.9)

    window.setTimeout(function() {d3.selectAll(".node")
        .style("fill", function(d) {
            if (d.status == "V") return "#76A788";
            if (d.status == "S") return "#b7b7b7";
            if (d.status == "I") return "#ef5555";
            if (d.status == "R") return "#9400D3";

        })
    },550);


}


function popNewGameInfectionHI() {
    d3.selectAll(".node")
        .transition()
        .duration(visualizationTimesteps * 0.75)
        .attr("r", function(d) {
            if (d.status == "I") {
//                console.log(d.exposureTimestep + "\t" + timestep + "\t" + d.id)
                if (timestep - d.exposureTimestep == 1) return hiNodeSize * 1.5;
                else return hiNodeSize;
            }
            else return hiNodeSize;
        })
}

function moveGamePathogensHI() {
    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(visualizationTimesteps)
        .attr("cx", function(d) { return d.receiverX} )
        .attr("cy", function(d) { return d.receiverY} );
}

function createGamePathogensHI() {
    xyCoords = getPathogen_xyCoords(newInfections);

    var pathogen = hiSVG.selectAll(".pathogen")
        .data(xyCoords)
        .enter()
        .append("circle")
        .attr("class", "pathogen")
        .attr("cx", function(d) { return d.transmitterX })
        .attr("cy", function(d) { return d.transmitterY })
        .attr("r", 4)
        .style("fill", "black")
}

function removeGamePathogensHI() {
    d3.selectAll(".node")
        .transition()
        .duration(200)
        .attr("r", hiNodeSize)

    d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0)

    d3.selectAll(".pathogen").remove();
}

function hiTimesteps() {
    if (simSet>=9) {
        d3.selectAll(".node").style("fill", "#b7b7b7")
        return;
    }


    infection_noGuaranteedTransmission();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectVizSimCompletion();
    if (!timeToStop) {
        animateGamePathogens_thenUpdateHI();
        window.setTimeout(hiTimesteps, visualizationTimesteps)
    }
    else {
        animateGamePathogens_thenUpdateHI();
        if (mainScreen) {
            updateBarChart()
        }



    }
}

function updateBarChart() {
    if (simSet > 9) {
        return;
    }

    vaxCoverage = coverages[simSet];

    runSimsGivenCoverage(vaxCoverage);
    plotBar(meanFinalEpidemicSizes);
    runVisualizationSims();
}

function detectVizSimCompletion() {
    if (getStatuses("I") == 0 && timestep > 0) {
        timeToStop = true;
        diseaseIsSpreading = false;
    }

}

function findMaxConnectedByType(focalStatus, targetStatus) {
    susceptibleNeighbors = [];
    var maxConnected = 0;
    var maxConnectedNode = null;
    for (var i = 0; i < graph.nodes.length; i++) {
        var connectedToFocalNode = 0;
        var focalNode = graph.nodes[i];
        if (focalNode.status != focalStatus) continue;
        else var neighbors = findNeighbors(focalNode);
        for (var ii = 0; ii < neighbors.length; ii++) {
            var targetNode = neighbors[ii];
            if (targetNode.status != targetStatus) continue;
            else {
                susceptibleNeighbors.push(targetNode);
                connectedToFocalNode++;
            }
        }
        if (connectedToFocalNode > maxConnected) {
            maxConnected = connectedToFocalNode;
            maxConnectedNode = focalNode;
        }
    }
    globalMaxConnected = maxConnected;
    return maxConnectedNode;
//    console.log(maxConnectedNode.id + " has " + maxConnected + " edges of type: " + focalStatus + " <-> " + targetStatus);
}


function runVisualizationSims() {
    if (simSet > 9) {
        return;
    }

    revertNodeStatus();
    patientZero();
    updateNodeColor();
    timestep = 1;
    hiTimesteps();

    if (simSet == 1) {
        if (!flu) {
            d3.select("#hiGuideText")
                .html("At 10% coverage, only those vaccinated benefit.")
        }
        else {
            if (!imperfectVaccines) {
                d3.select("#hiGuideText")
                    .html("Immediately, we see that outbreaks are less than half the size.")
                }
        }
    }

    if (simSet == 2) {
        if (!flu) {
            d3.select("#hiGuideText")
                .html("As we increase vaccination coverage, <br> we see some improvement but widespread outbreaks are common.")
        }

    }

    if (simSet == 4) {
        if (!flu) {
            d3.select("#hiGuideText")
                .html("By now we should notice a substantial drops <br> in both outbreak <b>size</b> and <b>duration.</b>")
        }
    }

    if (simSet == 6) {
        if (flu){
            if (!imperfectVaccines) {
                d3.select("#hiGuideText")
                    .html("Outbreaks fizzle out quickly and epidemics are exceedingly rare.")
            }

        }
    }

    if (simSet == 7) {
        if (!flu) {
            d3.select("#hiGuideText")
                .html("At high rates vaccination coverage, <br> most outbreaks will not have a chance to become an epidemic.")
        }
    }
}

function revertNodeStatus() {
    for (var i = 0; i < graph.nodes.length; i++) {
        if (Math.random() < coverages[simSet]) graph.nodes[i].status = "V";
        else graph.nodes[i].status = "S";

        graph.nodes[i].infectedBy = null;
        graph.nodes[i].exposureTimestep = null;
    }

}

function updateNodeColor() {
    d3.selectAll(".node")
        .style("fill", function(d) {
            if (d.status == "V") return "#76A788";
            if (d.status == "S") return "#b7b7b7";
            if (d.status == "I") return "#ef5555";
        })
}

function patientZero() {
    if (simSet > 9) {
        return;
    }
    var breakCounter = 0;
    do {
        var indexPatientID = Math.floor(Math.random() * graph.nodes.length);
        breakCounter++;
        console.log(breakCounter + "\t" + meanFinalEpidemicSizes)
    }
    while (graph.nodes[indexPatientID].status == "V" && breakCounter < 100);

    if (breakCounter > 100) indexPatientID = 0;

    timestep = 0;
    graph.nodes[indexPatientID].status = "I";
    graph.nodes[indexPatientID].infectedBy = null;
    graph.nodes[indexPatientID].exposureTimestep = timestep;
    diseaseIsSpreading = true;
    timeToStop = false;
}
