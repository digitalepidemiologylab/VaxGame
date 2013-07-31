d3.select("body").append("div1");

var series = [
               [{group: "I", time: 0, value: 0}],
               [{group: "predicted_I", time: 0, value: 0}]
             ];

var n = series[0].length;

var colorLines = d3.scale.category10();

// canvas margins
var marginFig = {top: 5, right: 10, bottom: 20, left: 35},
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
    .append("g")
    .attr("transform", "translate(" + marginFig.left + "," + marginFig.top + ")");

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
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightFig + ")")
    .call(d3.svg.axis().scale(xFig).orient("bottom"))

//y-axis
svgFig.append("g")
    .attr("class", "y axis")
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


