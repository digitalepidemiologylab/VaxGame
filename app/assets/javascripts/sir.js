
var timestep = 0;
var transmissionRate = .25;
var recoveryRate = .03;
var maxRecoveryTime = 4;
var indexCase = null;
var treatmentEfficacy = 0.25;               // likelihood that treatment will result in immediate cure
var hospitalQuarantineEfficacy = 0.50;      // proportion of edges, per individual, that are severed upon treatment
var martialLaw_edgeRemovalFrequency = 0.25; // proportion of edges, in entire graph, that are severed upon martial law
var rateOfVoluntarySegregation = 0.10;
var rateOfRefusalAdoption = 0.10;
var series = [{group:"S", time:timestep, value:50}, {group:"I", time:timestep, value:0}, {group:"R", time:timestep, value:0}];


function makePublicAnnouncement() {
    for (var i = 0; i < graph.nodes.length; i++) {
        var individual = graph.nodes[i];
        if (Math.random() < 0.10) voluntarilySegregateIndividual(individual);
        if (Math.random() > (1.0 - rateOfRefusalAdoption)) makeRefuser(individual);
    }
}

function voluntarilySegregateIndividual(individual) {
    individual.status = "VOL";
}

function makeRefuser(individual) {
    individual.status = "REF";

}

function declareMartialLaw() {
    var links = graph.links;

    for (var i = 0; i < links.length; i++) {
        if (Math.random() < martialLaw_edgeRemovalFrequency) {
            var linkToRemove = findLink(links[i].source, links[i].target);

            try {
                linkToRemove.remove = true;
            }
            catch(e) {
               //catch and just suppress errors
            }
        }
    }

    graph.links = links;
}


function treatInfected(individual) {
    if (Math.random() < treatmentEfficacy) {
        forceRecovery(individual);
    }
    partialQuarantine(individual);
}

function partialQuarantine(individual) {
    var individualLinks = individual.edges;

    for (var i = 0; i < individualLinks.length; i++) {
        if (Math.random() < hospitalQuarantineEfficacy) {
            var linkToRemove = findLink(individualLinks[i].source, individualLinks[i].target);

            try{
                linkToRemove.remove = true;

            }
            catch(e) {
                //catch and just suppress errors
            }
        }
    }

}

function selectIndexCase() {
    var numberOfPeople = graph.nodes.length;

    do{
        var randomIndex = Math.floor(Math.random() * numberOfPeople);
        var indexCase = graph.nodes[randomIndex];
    }
    while (indexCase.status == "V");

    this.indexCase = indexCase;
    infectIndividual(this.indexCase);
    console.log(this.indexCase);
}

function infectIndividual(individual) {
    if (individual.status == "S" || individual.status == "REF") {
        individual.status = "I";
        individual.exposureTimestep = this.timestep;
    }
}

function exposeIndividual(individual) {
    if (individual.status == "S" || individual.status == "REF") {
        individual.status = "E";
    }
}

function updateExposures() {
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == "E") {
            graph.nodes[i].status = "I";
            graph.nodes[i].exposureTimestep = this.timestep;
        }
    }
}

function infectedToRecovered(individual) {
    if (individual.status != "I") return;
    var timeSinceInfection = this.timestep - individual.exposureTimestep;
    if (Math.random() < recoveryRate || timeSinceInfection > maxRecoveryTime) individual.status = "R";
}

function forceRecovery(individual) {
    if (individual.status != "I") return;
    individual.status = "R";
}

function stateChanges() {
    for (var index = 0; index < graph.nodes.length; index++) {
        var individual = graph.nodes[index];
        infectedToRecovered(individual);
    }
}

function infection() {
    for (var index = 0; index < graph.nodes.length; index++) {
        if (graph.nodes[index].status != "S") continue;
        var susceptible = graph.nodes[index];
        var neighbors = findNeighbors(susceptible);
        var numberOfInfectedNeighbors = 0;
        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
            var neighbor = neighbors[neighborIndex];
            if (neighbor.status == "I") {
                numberOfInfectedNeighbors++;
            }
        }
        var probabilityOfInfection = 1.0 - Math.pow(1.0 - transmissionRate,numberOfInfectedNeighbors);
        if (Math.random() < probabilityOfInfection) exposeIndividual(susceptible);
    }
}

function runTimesteps() {
    getStatuses();
    updateExposures();
    infection();
    stateChanges();
    this.timestep++;
    if (this.timestep%2 == 0) {
        vaccineSupply++;
    }
}

function getStatuses() {
    var S = 0;
    var I = 0;
    var R = 0;

    for (var index = 0; index < graph.nodes.length; index++) {
        var individual = graph.nodes[index];

        if (individual.status == "S") S++;
        if (individual.status == "I") I++;
        if (individual.status == "R") R++;
    }

    var sData = {group:"S", time:timestep, value:S};
    var iData = {group:"I", time:timestep, value:I};
    var rData = {group:"R", time:timestep, value:R};

    series[0].push(sData);
    series[1].push(iData);
    series[2].push(rData);



}


