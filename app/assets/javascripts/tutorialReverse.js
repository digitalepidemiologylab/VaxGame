function guideRailsReverse() {
    var back = true;
    if (guideRailsPosition == 0) {

        d3.select(".guide")
            .attr("x",guideXCoord)
            .attr("y",guideYCoord)
            .attr("font-size", 28)
            .attr("opacity", 0)
            .text("Suppose this is you")

        d3.select(".guide2").text("")

        centerElement(guide, "guide");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1)

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)

        d3.selectAll(".node").style("cursor", 'pointer');

        d3.select(".lessonText")
            .text("LESSON 1: NETWORKS")
            .attr("opacity", 1)

        d3.select("#networkSxn").attr("class","menuItemBold")


        trivialGraph.nodes = [];
        trivialGraph.links = [];
        trivialGraph.nodes.push(tailoredNodes[0]);
        stepWiseUpdate();
    }

    if (guideRailsPosition == 1) {
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
        removeDuplicates(trivialGraph);
        stepWiseUpdate();
    }

    if (guideRailsPosition == 2) {
        trivialGraph.nodes = [];
        trivialGraph.links = [];

        trivialGraph.nodes.push(tailoredNodes[0]);
        trivialGraph.nodes.push(tailoredNodes[1]);
        trivialGraph.nodes.push(tailoredNodes[4]);
        trivialGraph.nodes.push(tailoredNodes[5]);
        trivialGraph.nodes.push(tailoredNodes[12]);

        for (var ii = 0; ii < trivialGraph.nodes.length; ii++) {
            for (var iii = 0; iii < trivialGraph.nodes.length; iii++) {
                if (edgeExists(trivialGraph.nodes[ii], trivialGraph.nodes[iii], tailoredGraph)) {
                    var linkString = {source:trivialGraph.nodes[ii],target:trivialGraph.nodes[iii],remove:false};
                    if (testDuplicate(trivialGraph.links, linkString)) continue;
                    trivialGraph.links.push(linkString);
                }
            }
        }

        removeDuplicates(trivialGraph);
        stepWiseUpdate();
    }

    if (guideRailsPosition == 3 || guideRailsPosition == 4 || guideRailsPosition == 5) {
        d3.select(".redX").remove();

        if (guideRailsPosition == 3 || guideRailsPosition == 4) {
            d3.select(".backArrow").text("< Restart Outbreak")
        }

        //return to pre-outbreak from post-outbreak

        d3.select(".timestepText").text("")
        d3.select(".timestepTicker").text("")

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

        removeDuplicates(graph);
        tutorialUpdate();

    }

    if (guideRailsPosition == 6) {
        graph.links = [];
        graph.nodes.push(tailoredNodes[2]);
        graph.nodes[5].status = "V";

        // add only the links that are connected to the highest degree node
        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[2].id || link.target.id == tailoredNodes[2].id) {
                graph.links.push(link);
            }
        }
        removeDuplicates(graph);
        tutorialUpdate();
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

    if (guideRailsPosition == 10 || guideRailsPosition == 11 || guideRailsPosition == 12) {
        guideRailsPosition = 10;
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

        removeDuplicates(graph);
        tutorialUpdate();
        timeToStop = false;
        diseaseIsSpreading = false;
        finalStop = true;
        endGame=false;
    }

    if (guideRailsPosition == 17) {
        d3.select(".nextArrow")
            .attr("opacity", 1)
            .text("next >")
        loadSyringe();
        hideQuarantine();
    }
    guideRails(back);
}