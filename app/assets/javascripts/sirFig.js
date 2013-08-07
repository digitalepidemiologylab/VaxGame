d3.select("body").append("div1");

var series = [
               [{group: "I", time: 0, value: 0}],
               [{group: "predicted_I", time: 0, value: 0}]
             ];

var n = series[0].length;

var colorLines = d3.scale.category10();

// canvas margins
var marginFig = {top: 70, right: 10, bottom: 20, left: 90},
    widthFig = 500 - marginFig.left - marginFig.right,
    heightFig = 230 - marginFig.top - marginFig.bottom;

// x scale
var xFig = d3.scale.linear()
    .domain([0, 30])
    .range([0, widthFig]);

// y scale
var yFig = d3.scale.linear()
    .domain([-1, numberOfIndividuals])
    .range([heightFig, 0]);

// the lines
var lineFig = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xFig(d.time); })
    .y(function(d) { return yFig(d.value); });


// the svg canvas
var svgFig = d3.select("div1").append("svg")
    .attr("width", widthFig + marginFig.left + marginFig.right)
    .attr("height", heightFig + marginFig.top + marginFig.bottom)
    .attr("class", "svgFig")
    .append("g")
    .attr("transform", "translate(" + marginFig.left + "," + marginFig.top + ")");


var yLabel = d3.select(".svgFig").append("text")
    .attr("x", 5).attr("y", 115)
    .attr("font-weight", "bold")
    .attr("transform", "rotate(320 55,125)")
    .text("Infected");

var xLabel = d3.select(".svgFig").append("text")
    .attr("x", 276).attr("y", 250)
    .attr("font-weight", "bold")
    .text("Day");


var simLegend = d3.select(".svgFig").append("line")
    .attr("x1", 176).attr("y1", 20)
    .attr("x2", 226).attr("y2", 20)
    .style("stroke", "ff7f0e")
    .style("stroke-width", 5)

var simLabel = d3.select(".svgFig").append("text")
    .attr("x", 150).attr("y", 40)
    .text("No Intervention")

var gameLegend = d3.select(".svgFig").append("line")
    .attr("x1", 350).attr("y1", 20)
    .attr("x2", 400).attr("y2", 20)
    .style("stroke", "#1f77b4")
    .style("stroke-width", 5)

var gameLabel = d3.select(".svgFig").append("text")
    .attr("x", 320).attr("y", 40)
    .text("Current Outbreak")


// append lines to canvas
svgFig.selectAll(".line")
    .data(series)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", lineFig)
    .style("stroke-width", 5)
    .style("stroke", function(d) {return colorLines(d[0].group)});


//x-axis
svgFig.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + heightFig + ")")
    .call(d3.svg.axis().scale(xFig).orient("bottom"))

//y-axis
svgFig.append("g")
    .attr("class", "y-axis")
    .call(d3.svg.axis().scale(yFig).orient("left"));

function updateSIRfig() {

    updateSeries();

    svgFig.selectAll("path")
        .data(series) // set the new data
        .transition()
        .attr("d", lineFig) // apply the new data values

}

function updateSeries() {
    series = [
             [{group: "I", time: 0, value: 0}],
             [{group: "predicted_I", time:0, value:0}]
             ];

    for (var time = 0; time < timestep-1; time++) {
        series[0].push(i_series[time]);
        series[1].push(sim_series[time]);
    }
}


