$(function() {
    $( "#accordion" ).accordion();
});

$( "#accordion" ).accordion({ heightStyle: "content" });

d3.select("body").append("div")
    .attr("class", "helpVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = 'http://vax.herokuapp.com/'
    })

//d3.select("body").append("div")
//    .attr("class", "helpAbout")
//    .text("Salathé Group @ Penn State")
//    .on("click", function() {
//        window.location.href = 'http://salathegroup.com/'
//    })


d3.select("body").append("div")
    .attr("class", "faqTitle")
    .text("FAQs")
    .style("position", "absolute")
    .style("top", "170px")
    .style("left", "200px")
    .style("font-family", "Nunito")
    .style("font-size", "32px")
    .style("font-weight", "400")
    .style("color" , "#707070")
