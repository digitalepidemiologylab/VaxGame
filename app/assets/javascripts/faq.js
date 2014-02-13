$(function() {
    $( "#accordion" ).accordion();
});

$( "#accordion" ).accordion({ heightStyle: "content" });

d3.select("body").append("div")
    .attr("class", "helpVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = '/';
    });

//d3.select("body").append("div")
//    .attr("class", "helpAbout")
//    .text("Salathé Group @ Penn State")
//    .on("click", function() {
//        window.location.href = 'http://salathegroup.com/'
//    })
