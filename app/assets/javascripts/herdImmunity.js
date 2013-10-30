var hiSVG;
var hiGuide = 0;
var hiGuideText;

init_hiSpace();

function init_hiSVG() {
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6


    if (isFirefox || isIE) {
        hiSVG = d3.select("body").append("svg")
            .attr({
                "width": 950,
                "height": 600
            })
            .attr("id", "hiSVG")
            .attr("pointer-events", "all")
            .append('svg:g');

    }
    else {
        hiSVG = d3.select("body").append("svg")
            .attr({
                "width": "100%",
                "height": "70%"  //footer takes ~12.5% of the page
            })
            .attr("viewBox", "0 0 " + width + " " + height )
            .attr("id", "hiSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }

}

function init_hiSpace() {
    init_hiSVG();

    d3.select("body").append("div")
        .attr("id", "hiNav")

    d3.select("#hiSVG").append("text")
        .attr("id", "hiHeader")
        .style("font-size", "60px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "#707070")
        .attr("x", -20)
        .attr("y", 80)
        .text("Herd Immunity")
        .attr("opacity", 1)

    d3.select("#hiNav").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "advanceHI")
        .style("right", "0px")
        .style("font-size", "28px")
        .text("Start >")
        .on("click", function() {
            hiGuide++;
            hiAdvance();

        })

    hiGuideText = d3.select("body").append("div")
        .attr("id", "hiGuideText")
        .html("In this module, we'll look at how Herd Immunity works and </br> how it differs between different pathogens.")

}






