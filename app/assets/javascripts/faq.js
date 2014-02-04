$(function() {
    $( "#accordion" ).accordion();
});

$( "#accordion" ).accordion({ heightStyle: "auto" });

d3.select("body").append("div")
    .attr("class", "helpVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = 'http://vax.herokuapp.com/';
    });

//d3.select("body").append("div")
//    .attr("class", "helpAbout")
//    .text("Salathé Group @ Penn State")
//    .on("click", function() {
//        window.location.href = 'http://salathegroup.com/'
//    })
