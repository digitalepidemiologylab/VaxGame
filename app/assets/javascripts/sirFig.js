d3.select("body").append("div1");


var series = [
    [{group: 0 ,time: 1, value: 20}, {group:0, time: 2, value: 18}, {group:0, time: 3, value: 15}, {group:0, time: 4, value: 10}, {group:0, time: 5, value: 7}, {group:0, time: 6, value: 4}, {group:0, time: 7, value: 0}, {group:0, time: 8, value: 0}],
    [{group: 1, time: 1, value: 0}, {group:1, time: 2, value: 2}, {group:1, time: 3, value: 5}, {group:1, time: 4, value: 10}, {group:1, time: 5, value: 13}, {group:1, time: 6, value: 16}, {group:1, time: 7, value: 20}, {group:1, time: 8, value: 15}],
    [{group: 2, time: 1, value: 0}, {group:2, time: 2, value: 0}, {group:2, time: 3, value: 0}, {group:2, time: 4, value: 0}, {group:2, time: 5, value: 0}, {group:2, time: 6, value: 0}, {group:2, time: 7, value: 0}, {group:2, time: 8, value: 5}],
    [{group: 3, time: 1, value: 0}, {group:3, time: 2, value: 5}, {group:3, time: 3, value: 5}, {group:3, time: 4, value: 5}, {group:3, time: 5, value: 5}, {group:3, time: 6, value: 6}, {group:3, time: 7, value: 6}, {group:3, time: 8, value: 6}]
];


var n = series[0].length;

var colorLines = d3.scale.category10();

// canvas margins
var marginFig = {top: 10, right: 10, bottom: 20, left: 40},
    widthFig = 400 - marginFig.left - marginFig.right,
    heightFig = 200 - marginFig.top - marginFig.bottom;

// x scale
var xFig = d3.scale.linear()
    .domain([1, n])
    .range([0, widthFig]);

// y scale
var yFig = d3.scale.linear()
    .domain([-1, 20])
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
svgFig.selectAll(".lineFig")
    .data(series)
    .enter().append("path")
    .attr("class", "lineFig")
    .attr("d", lineFig)
    .style("stroke", function(d) {return colorLines(d[0].group)});


//x-axis
svgFig.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightFig + ")")
    .call(d3.svg.axis().scale(xFig).orient("bottom"));

//y-axis
svgFig.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(yFig).orient("left"));

function update() {
    // translate current timestep to data

    // redraw figure accordingly

    // should be called by "runTimesteps()"
}


