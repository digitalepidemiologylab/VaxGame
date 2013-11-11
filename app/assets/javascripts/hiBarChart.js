var hiBarSVG;
var x;
var y;
var xAxis;
var yAxis;
var spacer;
var maxYaxis = 70;
function plotBar(data) {

    var covgTicks = ["10", "20", "30", "40", "50", "60", "70", "80", "90"]
    var outbreakSizeTicks = [0, maxYaxis/2, maxYaxis]

    d3.select(".xAxis").remove();
    d3.select(".yAxis").remove();
    d3.select(".R0text").remove();

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 750 - margin.left - margin.right,
        height = 375 - margin.top - margin.bottom;

    x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    y = d3.scale.linear()
        .range([height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues(covgTicks)


    yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(outbreakSizeTicks)
        .orient("left")

    hiBarSVG = d3.select("#hiSVG").append("svg")
        .attr("id", "barChart")
        .attr("x", 500)
        .attr("y", 225)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d,i) {return i}))

        y.domain([0, maxYaxis])

    hiBarSVG.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    hiBarSVG.append("g")
            .attr("class", "yAxis")
            .call(yAxis)
            .append("text")
            .style("stroke", "white")
            .style("color", "#BABABA")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")

    spacer = 15;

    hiBarSVG.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return x.rangeBand() * i + (spacer/2) + 3})
            .attr("width", x.rangeBand() - spacer)
            .attr("y", function(d) { return y(d) })
            .attr("height", 0)
            .transition()
            .duration(500)
            .attr("height", function(d) { return height - y(d);})

//
//    for (var i = 0; i < simSet; i++) {
//        d3.select("#hiSVG").append("text")
//            .attr("class", "R0text")
//            .attr("x", 445 + (75*i))
//            .attr("y", function() {return 465 - (meanFinalEpidemicSizes[i]*4)})
//            .text(function() {if (meanMeasuredR0[i] > 0) return "R0 = " + meanMeasuredR0[i]})
//
//    }


}

