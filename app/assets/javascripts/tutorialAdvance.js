var menuColorFlash = true;
var colorIndex = 0;
var menuColors = ["#007138","#ffffff"];

function resetBack() {
    d3.select(".backArrow")
        .attr("fill", function() {
            if (backEnable) return "white";
            else return "#838383";
        })
        .on("click", function() {
            if (backEnable) {
                if (diseaseIsSpreading) return;


                guideRailsPosition--;
                guideRailsReverse();

                if (guideRailsPosition == 9) {
                    loadSyringe();
                    backEnable = false;
                    resetBack();
                }

            }
            else return;

    })
}

function resetNext() {
    d3.select(".nextArrow")
        .attr("fill", function() {
            if (nextEnable) return "white";
            else return "#838383";
        })
        .text("Next >")
        .on("click", function() {
            if (nextEnable) {
                if (diseaseIsSpreading) return;


                guideRailsPosition++;
                guideRails();
            }
            else return;
    })
}

function disableBack() {
    d3.select(".backArrow")
        .attr("fill", "#838383")
        .text("< Back")
        .on("click", function() {

        })

}

function disableNext() {
    d3.select(".nextArrow")
        .attr("fill", "#838383")
        .text("Next >")
        .on("click", function() {

        })

}


function net2epiTransition() {

    if (guideRailsPosition == 3) {

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Next, we'll look at how diseases move through a network")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("in lesson 2: epidemics.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
        d3.selectAll(".node").style("cursor", 'pointer');

        d3.select(".nextArrow")
            .text("Finish >")
            .on("click", function() {
                guideRailsPosition++;
                guideRails();
                slideOutStepwiseNav();
            })


    }

    resetBack();
}

function epi2VaxTransition() {
    slideOutStepwiseNav();

    d3.select(".guide")
        .attr("x", guideXCoord)
        .attr("y", guideYCoord)
        .attr("opacity", 0)
        .text("Coming up, in lesson 3: vaccines, we'll cover how to prevent")

    d3.select(".guide2")
        .attr("x", guideXCoord)
        .attr("y", guideYCoord + guide2YCoordChange)
        .attr("opacity", 0)
        .text("epidemics by containing outbreaks before they spread.")

    centerElement(guide, "guide");
    centerElement(guide2, "guide2");

    d3.select(".guide")
        .transition()
        .duration(500)
        .attr("opacity", 1);

    d3.select(".guide2")
        .transition()
        .duration(500)
        .attr("opacity", 1);




}

function vax2QuarantineTransition() {

        hideSyringe();
        loadSyringe();

        d3.select(".lessonText")
            .text("Lesson 4: Quarantine")


        d3.select("#quarantineSxn").attr("class","menuItemBold")
        d3.select("#vaccineSxn").attr("class","menuItemNormal")


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Vaccines take time to 'kick in' so they're ineffective")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("if an infection has already begun to spread.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);








}


function guideRails(back) {
    console.log("rail position = " + guideRailsPosition)

    if (diseaseIsSpreading) return;

    if (guideRailsPosition == 0) backEnable = false;

    if (guideRailsPosition == 1) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();

        d3.select(".menuBox").style("right", "-1000px")



        if (!back) addOneFriend();
        d3.selectAll(".node").style("cursor", 'pointer');


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("And this is you with one friend. The connection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("represents contact between you two.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 2) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();

        if (!back) buildGraph();

        d3.selectAll(".node").style("cursor", 'pointer');


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now here are more friends who are connected to you and")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("to each other. This is your immediate contact group.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 3) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();

        charge = -400;
        if (!back) {
            tutorialUpdate()
        }

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Your friends have friends, that may be strangers to you,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("but together they make up your contact network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
        d3.selectAll(".node").style("cursor", 'pointer');

        d3.select(".menuBox")
            .style("visibility", "visible")

        d3.select(".menuBox")
            .style("right", "0px")

        d3.select("#networkSxn").attr("class","menuItemBold")

        removeDuplicateEdges(graph);

        d3.select(".nextArrow")
            .on("click", function() {
                net2epiTransition();
            });

    }

    if (guideRailsPosition == 4) {

        d3.select(".menuBox").style("right", "-1000px")

        d3.select(".lessonText").attr("opacity", 1)
            .text("Lesson 2: Epidemics")


        removeDuplicateEdges(graph);

        d3.select("#networkSxn").attr("class","menuItemNormal")

        d3.select("#epidemicSxn").attr("class","menuItemBold")


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When someone in your contact network gets sick,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the infection will spread across the network...")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        var indexPatientID = Math.floor(Math.random() * numberOfIndividuals);
        graph.nodes[indexPatientID].status = "I";
        removeDuplicateEdges(graph);
        tutorialUpdate();

        if (back) tutorialTimesteps();

        diseaseIsSpreading=true;
        nextEnable = false;
        backEnable = false;
        disableNext();
        disableBack();
        timeToStop = false;




    }

    if (guideRailsPosition == 5) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();

        var img2 = svg.selectAll("image").data([0]);
        img2.enter()
            .append("image")
            .attr("xlink:href", "/assets/redX.svg")
            .transition()
            .duration(500)
            .attr("x", "280")
            .attr("y", "85")
            .attr("width", "450")
            .attr("height", "450")
            .attr("opacity", 0.6)
            .attr("class", "redX")

        flashRedX();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("If no action is taken, then pretty soon")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the entire network will be infected.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".backArrow")
            .on("click", function() {
                d3.select(".redX").remove();
                guideRailsPosition = 3;
                guideRailsReverse();
            })



    }

    if (guideRailsPosition == 6 ) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();
        d3.select(".redX").remove();

        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes.status = "S";
        }

        svg.selectAll("circle.node").style("fill", "#b7b7b7")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("The chance that someone spreads the infection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("depends on how many neighbors they have.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 7 ) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();

        d3.selectAll("circle.node")
            .transition()
            .duration(500)
            .attr("r", function(d) {
                return (3 * findNeighbors(d).length)
            })

        force
            .nodes(graph.nodes)
            .charge(-1100)
            .links(graph.links)
            .start();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Here the circles have been resized based on the chance")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("that they'll infect at least one of their neighbors.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 8 ) {
        nextEnable = true;
        backEnable = true;
        resetBack();
        resetNext();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Most of the time, focusing treatment on people with")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("a lot of neighbors is a good strategy, but not always....")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow")
            .on("click", epi2VaxTransition)

    }



    if (guideRailsPosition == 9) {

        nextEnable = false;
        backEnable = false;
        resetBack();
        resetNext();


        d3.select(".lessonText").text("Lesson 3: Vaccines")

        vaccineSupply = 1;
        vax = 1;
        numberVaccinated = 0;
        loadSyringe();


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Vaccinate' tool in the upper right")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("then click the flashing node to vaccinate it.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph.nodes = [];
        graph.links = [];

        // reset all node attributes after outbreak simulation
        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].infectedBy = null;
            tailoredNodes[i].exposureTimestep = null;
        }

        // add the highest degree node only, to illustrate single vaccination
        graph.nodes.push(tailoredNodes[2]);

        // add its neighbors
        graph.nodes.push(tailoredNodes[14-13])
        graph.nodes.push(tailoredNodes[16-13])
        graph.nodes.push(tailoredNodes[21-13])
        graph.nodes.push(tailoredNodes[22-13])
        graph.nodes.push(tailoredNodes[23-13])
        graph.nodes.push(tailoredNodes[24-13])
        graph.nodes.push(tailoredNodes[25-13])

        // add only the links that are connected to the highest degree node
        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[2].id || link.target.id == tailoredNodes[2].id) {
                graph.links.push(link);
            }
        }

        removeDuplicateEdges(graph);
        tutorialUpdate();
        flashNode();
    }

    if (guideRailsPosition == 10) {

        nextEnable = true;
        backEnable = false;

        resetNext();
        resetBack();

        keepFlashing = false;

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When we vaccinate a node,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("it is removed because it cannot be infected.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        removeDuplicateEdges(graph);
        tutorialUpdate();
    }

    if (guideRailsPosition == 11) {

        nextEnable = false;
        backEnable = false;


        d3.select(".nextArrow")
            .attr("fill", "#838383")
            .on("click", function() {

            })

        d3.select(".nextArrow")
            .attr("fill", "#838383")
            .on("click", function() {

            })


        keepFlashing=true;
        loadSyringe();
        vaccineSupply = 1;
        numberVaccinated = 0;
        charge = -300;

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Separate this network into two groups")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("by vaccinating any of the flashing nodes.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < weakTieNodes.length; i++) {
            graph.nodes.push(weakTieNodes[i]);
        }

        for (var ii = 0; ii < weakTieLinks.length; ii++) {
            graph.links.push(weakTieLinks[ii]);
        }

        // remove nodes w/o edges
        for (var iv = 0; iv < graph.nodes.length; iv++) {
            var counter = 0;
            var node = graph.nodes[iv];
            for (var iii = 0; iii < graph.links.length; iii++) {
                var link = graph.links[iii];
                if (link.source.id == node.id || link.target.id == node.id) counter++;
            }
            if (counter == 0) graph.nodes.splice(iv, 1);
        }
        removeDuplicateEdges(graph);
        tutorialUpdate();
        flashNodes();
    }

    if (guideRailsPosition == 12) {
        vaccinateMode = false;

        d3.selectAll(".node")
            .attr("r", 8)
            .style("fill", "#b7b7b7")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now if an outbreak were to occur,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("it would not spread to both groups.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.selectAll(".node").style("fill", "#b7b7b7")


    }

    if (guideRailsPosition == 13) {
        d3.select(".menuBox").style("right", "-1000px")


        hideSyringe();
        vaccinateMode = false;
        timeToStop = true;
        d3.select(".vaccineDepressedState").style("visibility", "hidden")

        d3.select("#epidemicSxn").attr("class","menuItemNormal")
        d3.select("#vaccineSxn").attr("class","menuItemBold")

        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < tailoredNodes.length; i++) {
            graph.nodes.push(tailoredNodes[i]);
            graph.nodes[i].status = "S";
            graph.nodes[i].infectedBy = null;
            graph.nodes[i].exposureTimestep = null;
        }

        for (var ii = 0; ii < tailoredLinks.length; ii++) {
            graph.links.push(tailoredLinks[ii]);
        }

        d3.selectAll(".node")
            .on("click", function(d) {
                if (vaccinateMode) {
                    if (vaccineSupply <= 0) {
                        window.alert("Out of Vaccines!")
                        return;
                    }
                    d.status = "V";
//                    d.fixed = true;
                    d3.select(this)
//                        .attr("class", "vaxNode")
                        .style("fill", "#d9d678")
//                    vaccinatedBayStartYCoord += 25;
                    vaccineSupply--;
                    numberVaccinated++;

                    if (vaccineSupply == 2) {
                        guideRailsPosition++;
                        guideRails();
                    }

                    if (vaccineSupply == 0 && intervention) {
                        guideRailsPosition++;
                        guideRails();
                    }
                    removeDuplicateEdges(graph);
                    tutorialUpdate();
                }});

        removeDuplicateEdges(graph);
        tutorialUpdate();

//        d3.select(".timestepText")
//            .transition()
//            .duration(500)
//            .attr("opacity", 0)
//
//        d3.select(".timestepTicker")
//            .transition()
//            .duration(500)
//            .attr("opacity", 0)
//            .text(timestep)


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now let's look at the original network again, but this time")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("we'll use vaccines to break up the network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        vaccinateMode = false;


    }

    if (guideRailsPosition == 14) {

        nextEnable = false;
        backEnable = true;
        resetBack();
        resetNext();

        vaccineSupply = 3;
        vax = 3;

        loadSyringe();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Vaccinate' tool in the upper right and select")

        vaccineSupply = 3;
        diseaseIsSpreading = false;
        postInitialOutbreak = true;

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("nodes to vaccinate. You only get " + vaccineSupply + " vaccines, so choose wisely.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 15) {

        nextEnable = true;
        resetNext();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When you vaccinate a node, they are effectively removed from")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the network because they can no longer spread the infection.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 16) {
        nextEnable = true;
        resetNext();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Vaccinating breaks the network into smaller pieces")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("making it less likely for an infection to spread to every node.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);



    }

    if (guideRailsPosition == 17) {
        nextEnable = false;
        backEnable = false;
        resetNext();
        resetBack();

        d3.select(".menuBox").style("right", "0px")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now, when an infection spreads, it is more likely")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("to be confined to a smaller network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        var numberOfPeople = graph.nodes.length;
        do{
            var randomIndex = Math.floor(Math.random() * numberOfPeople);
            var indexCase = graph.nodes[randomIndex];
        }
        while (indexCase.status == "V");

        indexCase.status = "I";
        diseaseIsSpreading = true;
        timestep = 0;
        timeToStop = false;
        postInitialOutbreak = false;
        finalStop = true;

        tutorialTimesteps();
    }

    if (guideRailsPosition == 18) {

        d3.selectAll(".node").remove();

        finalStop = false;

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("In lesson 4: quarantine, we'll consider actions that")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("can be taken after an infection has begun to spread.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph = {};
        graph.nodes = [];
        graph.links = [];

        graph = generateSmallWorld(35, 0.12, 4)
        removeDuplicateEdges(graph);

        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes[i].status = "S";
        }

        quarantineUpdate();
        vax = 0;
        vaccineSupply = 0;

        d3.select(".nextArrow")
            .text("Finish >")
            .on("click", function() {
                vax2QuarantineTransition();
                slideOutStepwiseNav();
            })
    }



    if (guideRailsPosition == 19) {

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Quarantining is a way to immediately remove nodes that")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("are likely to be infected during an epidemic outbreak.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);


    }

    if (guideRailsPosition == 20) {
        nextEnable = false;
        backEnable = false;
        resetNext();
        resetBack();


        transmissionRate = 0.35;
        rerun = false;

        hideSyringe();
        loadQuarantine();


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Quarantine' tool in the upper right and click nodes to")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("quarantine. A new round of infections begins after every quarantine.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 21) {
        nextEnable = true;
        resetNext();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Great! Now, let's see how many you saved...")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 22) {
        countSaved();
        var totalNodes = graph.nodes.length;

        graph = {};
        graph.nodes = [];
        graph.links = [];
        quarantineUpdate();

//        d3.select(".timestepTicker").attr("opacity", 0)
//        d3.select(".timestepText").attr("opacity", 0)


        var modifier = ".";
        if (((numberSaved/totalNodes)*100) > 50) modifier = "!";

        var string = "Congratulations! You saved " + numberSaved + " people. That's about " + ((numberSaved/totalNodes)*100).toFixed(0) + "%" + modifier;
        var graphExplainString = "This represents how effective you were at containing the outbreak.";

        if (numberSaved == 1) {
            string = "";
            graphExplainString = "You only saved one person... ಠ_ಠ";
        }

        if (numberSaved >= totalNodes - 1) {
            graphExplainString = "Did you cheat? ಠ_ಠ";
            string = "";
        }

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text(graphExplainString)

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text(string)

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select("#quarantineSxn")
            .attr("class","menuItemNormal")



        d3.select("#gameLink")
            .attr("class","menuItemBold")

        initRecap();


        menuColors = ["#007138","#ffffff"];
        window.setInterval(flashFullGame, 300);
    }

}

function flashFullGame() {

    if (menuColorFlash) colorIndex = 0;
    else colorIndex = 1;

    d3.select("#gameLink").style("color", menuColors[colorIndex])

    menuColorFlash = !menuColorFlash;

}