function plotBar(data) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;



    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues(coverages)



    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d,i) {return i}))
        y.domain([0, d3.max(data, function(d) {return d})])

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")

    var spacer = 15;

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return x.rangeBand() * i + (spacer/2)})
            .attr("width", x.rangeBand() - spacer)
            .attr("y", function(d) { return y(d) })
            .attr("height", function(d) { return height - y(d);});

}

