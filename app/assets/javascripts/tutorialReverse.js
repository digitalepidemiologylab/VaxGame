function guideRailsReverse() {

    var back = true;
    if (guideRailsPosition == 0) {
        trivialGraph = {}
        trivialGraph.nodes = [];
        trivialGraph.links = [];

        d3.selectAll(".node").remove();
        d3.selectAll(".link").remove();


        quarantineMode = false;

        diseaseIsSpreading = false;
        timeToStop = true;

        backEnable = false;
        resetBack();


        d3.select(".guide")
            .attr("x",guideXCoord)
            .attr("y",guideYCoord)
            .attr("font-size", "28px")
            .attr("opacity", 0)
            .text("Suppose this is you")

        d3.select(".guide2").text("")

        centerElement(guide, "guide");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1)


        d3.selectAll(".node").style("cursor", 'pointer');

        d3.select("#networkSxn").attr("class","menuItemBold");
        d3.select("#epidemicSxn").attr("class", "menuItemNormal")
        d3.select("#vaccineSxn").attr("class","menuItemNormal")
        d3.select("#quarantineSxn").attr("class","menuItemNormal")

        trivialGraph.nodes.push(tailoredNodes[0]);
        stepWiseUpdate();




    }

    if (guideRailsPosition == 1) {
        quarantineMode = false;

        trivialGraph.nodes = [];
        trivialGraph.links = [];
        trivialGraph.nodes.push(tailoredNodes[0])
        trivialGraph.nodes.push(tailoredNodes[1])


        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[0].id && link.target.id == tailoredNodes[1].id ||
                link.source.id == tailoredNodes[1].id && link.target.id == tailoredNodes[0].id) {

                trivialGraph.links.push(link);
            }
        }
        removeDuplicateEdges(trivialGraph);
        stepWiseUpdate();
    }

    if (guideRailsPosition == 2) {
        quarantineMode = false;

        trivialGraph.nodes = [];
        trivialGraph.links = [];

        trivialGraph.nodes.push(tailoredNodes[0]);
        trivialGraph.nodes.push(tailoredNodes[1]);
        trivialGraph.nodes.push(tailoredNodes[4]);
        trivialGraph.nodes.push(tailoredNodes[5]);
        trivialGraph.nodes.push(tailoredNodes[12]);

        for (var ii = 0; ii < trivialGraph.nodes.length; ii++) {
            for (var iii = 0; iii < trivialGraph.nodes.length; iii++) {
                if (edgeExists(trivialGraph.nodes[ii], trivialGraph.nodes[iii], graph)) {
                    var linkString = {source:trivialGraph.nodes[ii],target:trivialGraph.nodes[iii],remove:false};
                    if (testDuplicate(trivialGraph.links, linkString)) continue;
                    trivialGraph.links.push(linkString);
                }
            }
        }

        removeDuplicateEdges(trivialGraph);
        stepWiseUpdate();
    }

    if (guideRailsPosition == 3) {
        timestep = 0;
        guideRailsPosition++;
        guideRails();
    }

    if (guideRailsPosition == 4) {

        quarantineMode = false;

        d3.select("#networkSxn").attr("class","menuItemNormal");
        d3.select("#epidemicSxn").attr("class", "menuItemBold")
        d3.select("#vaccineSxn").attr("class","menuItemNormal")
        d3.select("#quarantineSxn").attr("class","menuItemNormal")

        d3.select(".redX").remove();


        graph.nodes = [];
        graph.links = [];
        timestep = 0;
        diseaseIsSpreading = false;
        timeToStop = false;


        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].infectedBy = null;
            tailoredNodes[i].exposureTimestep = null;
            graph.nodes.push(tailoredNodes[i]);

        }

        for (var ii = 0; ii < tailoredLinks.length; ii++) {
            graph.links.push(tailoredLinks[ii]);
        }

        removeDuplicateEdges(graph);
        tutorialUpdate();

        net2epiTransition();

    }


    if (guideRailsPosition == 9) {
        force.stop();

        quarantineMode = false;
        hideQuarantine();
        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S"
            tailoredNodes[i].infectedBy = null;
            tailoredNodes[i].exposureTimestep = null;
        }

        graph.nodes.push(tailoredNodes[2]);
        tutorialUpdate();

        loadSyringe();
        vax = 1;
        vaccineSupply = 1;

        d3.selectAll(".node")
            .transition()
            .duration(500)
            .attr("r", function(d) {
                if (d.status == "S") return 8;
                if (d.status == "V") return 15;
            })
            .style("fill", function(d) {
                if (d.status == "S") return "#b7b7b7";
                if (d.status == "V") return "#d9d678";
            })

        keepFlashing = true;




    }

    if (guideRailsPosition >= 13 && guideRailsPosition <= 17) {
        backEnable = true;
        nextEnable = true;
        resetBack();
        resetNext();

        quarantineMode = false;

        guideRailsPosition = 13;
        vaccineSupply = 3;
        vax = 3;
//        d3.selectAll(".fixedVaxNode").remove();
//        vaccinatedBayStartYCoord = 125;
        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].fixed = false;
            graph.nodes.push(tailoredNodes[i]);
        }

        for (var ii = 0; ii < tailoredLinks.length; ii++)  {
            graph.links.push(tailoredLinks[ii]);
        }

        removeDuplicateEdges(graph);
        tutorialUpdate();
        timeToStop = false;
        diseaseIsSpreading = false;
        finalStop = true;
        endGame = false;


    }



    guideRails(back);
}