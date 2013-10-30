var hiSVG;

init_hiSpace();

function init_hiSVG() {
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6


    if (isFirefox || isIE) {
        hiSVG = d3.select("body").append("svg")
            .attr({
                "width": 950,
                "height": 768 - 45
            })
            .attr("class", "hiSVG")
            .attr("pointer-events", "all")
            .append('svg:g');

    }
    else {
        hiSVG = d3.select("body").append("svg")
            .attr({
                "width": "100%",
                "height": "87.5%"  //footer takes ~12.5% of the page
            })
            .attr("viewBox", "0 0 " + width + " " + height )
            .attr("class", "hiSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }

}

function init_hiSpace() {
    init_hiSVG();

    d3.select("body").append("div")
        .attr("id", "hiNav")

    d3.select(".hiSVG").append("text")
        .style("font-size", "60px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("color", "#707070")
        .attr("x", -20)
        .attr("y", 80)
        .text("Herd Immunity")



}




