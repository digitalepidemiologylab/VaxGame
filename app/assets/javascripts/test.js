calcSpace = 500;

var infectedBar;
var uninfectedBar;

d3.select("#scoreRecapSVG").append("rect")
    .attr("class", "infectedBar")
    .attr("x", 160)
    .attr("y", 50)
    .attr("height", 100)
    .attr("width", 85)
    .attr("opacity", 1)
    .attr("fill", "#ef5555")


