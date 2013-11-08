var redistribute;

var globalMax;
var globalMaxConnected;
var globalMaxConnectedLabel;
var susceptibleNeighbors;

function hiAdvance() {
    if (hiGuide == 1) {
        d3.select("#advanceHI").text("Next >")
        d3.select("#hiGuideText")
            .html("What is herd immunity?")
    }


    if (hiGuide == 2) {
        d3.select("#hiGuideText")
            .html("When a large proportion of a population acquires immunity, <br> the few that are still susceptible to a particular infectious disease <br> (the very old, young, and sick) remain protected...but why?")

    }

    if (hiGuide == 3) {
        d3.select("#hiGuideText")
            .html("If we vaccinate a large proportion of the population at random, <br> we shouldn't find very many susceptible people that are connected. <br> <b>This is the key to herd immunity...</b>")

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
            .html("No matter how many times we randomly redistribute vaccines, <br> large clusters of susceptible people are unlikely.")

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
            .attr("x", 300)
            .attr("y", 350)
            .style("font-size", "60px")
            .style("font-family", "Nunito")
            .style("font-weight", 700)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Measles")

        d3.select("#hiSVG").append("text")
            .attr("class", "measlesText")
            .attr("x", 320)
            .attr("y", 375)
            .style("font-size", "24px")
            .style("font-family", "Nunito")
            .style("font-weight", 300)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Transmission: ##%")

        d3.select("#hiSVG").append("text")
            .attr("class", "measlesText")
            .attr("x", 343)
            .attr("y", 400)
            .style("font-size", "24px")
            .style("font-family", "Nunito")
            .style("font-weight", 300)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Recovery: ##%")


        d3.select("#hiGuideText")
            .html("We'll demonstrate herd immunity by simulating a <b>measles</b> outbreak, <br> a highly infectious virus that causes childhood disease.")

    }

    if (hiGuide == 6) {
        d3.selectAll(".measlesText")
            .transition()
            .duration(500)
            .attr("opacity", 0)

        window.setTimeout(function() {d3.selectAll(".measlesText").remove()}, 600)


        d3.select("#hiGuideText")
            .html("First some background, the average number of cases <br> that the first infected person will produce is called <br> the <b>basic reproductive number</b>, or <b>R₀</b> ('R naught').")

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
            .html("R₀ is powerfully affected by how easily it spreads, <br> how quickly people recover, and the structure of the contact network.")
    }


    if (hiGuide == 9) {

        for (var i = 0; i < graph.nodes.length; i++) {
            if (Math.random() < 0.10) graph.nodes[i].status = "V";
            else graph.nodes[i].status = "S";

            graph.nodes[i].infectedBy = null;
            graph.nodes[i].exposureTimestep = null;
        }

        d3.select("#hiGuideText")
            .html("Let's see how far a measles outbreak will spread with 10% vaccination coverage...")

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
            .html("Vaccination saved a few people, but in the name of science, " +
                " <br> let's repeat that 100 times to get a clearer picture.")
    }

    if (hiGuide == 11) {

        d3.select("#hiGuideText")
            .html("As we can see, at 10% vaccination coverage, the outbreak size <br> still remains quite large.")

    }

    if (hiGuide == 12) {
        // run visual sim
        // at completion, grow bar
        // repeat up to 90%

        d3.select("#hiGuideText")
            .html("Now we'll increase the proportion of the population that is <br> that is vaccinated to find the optimal vaccination coverage for measles.")
    }

    if (hiGuide == 13) {
        d3.select("#hiGuideText")
            .html("It looks like once we vaccinate ~90% of the population, <br> measles outbreaks are quite small.")
    }

    d3.select("#hiGuideText").transition().duration(500).style("color", textHex);

}

function animateGamePathogens_thenUpdateHI() {
    window.setTimeout(createGamePathogensHI  , 50)
    window.setTimeout(moveGamePathogensHI    , 100)
    window.setTimeout(popNewGameInfectionHI  , 300)
    window.setTimeout(removeGamePathogensHI  , 800)

    window.setTimeout(function() {d3.selectAll(".node")
        .style("fill", function(d) {
            if (d.status == "V") return "#76A788";
            if (d.status == "S") return "#b7b7b7";
            if (d.status == "I") return "#ef5555";
            if (d.status == "R") return "#9400D3";

        })
    },850);


}


function popNewGameInfectionHI() {
    d3.selectAll(".node")
        .transition()
        .duration(500)
        .attr("r", function(d) {
            if (d.status == "I") {
                console.log(d.exposureTimestep + "\t" + timestep + "\t" + d.id)
                if (timestep - d.exposureTimestep == 1) return 12 * 1.5;
                else return 12;
            }
            else return 12;
        })
}

function moveGamePathogensHI() {
    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(600)
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
        .attr("r", 12)

    d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0)

    d3.selectAll(".pathogen").remove();
}

function hiTimesteps() {
    infection_noGuaranteedTransmission();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectVizSimCompletion();
    if (!timeToStop) {
        animateGamePathogens_thenUpdateHI();
        window.setTimeout(hiTimesteps, 1000)
    }
    else {
        animateGamePathogens_thenUpdateHI();
    }

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
