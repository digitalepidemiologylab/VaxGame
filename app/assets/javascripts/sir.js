
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
var s_series = [];
var i_series = [];
var r_series = [];
var simulation = true;
var diseaseIsSpreading = false;
var sim_series = [];
var endGame = false;

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
    //console.log(this.indexCase);
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
    if (timestep == startDay) {
        diseaseIsSpreading = true;
        selectIndexCase();
        selectIndexCase();
    }

    if (diseaseIsSpreading) {
        bcScores = computeBetweennessCentrality();
        updateExposures();
        infection();
        stateChanges();
        this.timestep++;
        if (this.timestep%2 == 0) {
            vaccineSupply++;
            d3.select(".vaccineSupplyHUD")
                .text("Vaccines: " + vaccineSupply);
        }
        getStatuses();
        updateSIRfig();
    }
    else {
        bcScores = computeBetweennessCentrality();
        this.timestep++;
        getStatuses();
        updateSIRfig();
    }

    updateCommunities(graph);

    if (!simulation && diseaseIsSpreading) {
        detectEndGame(graph);
    }


}

function getStatuses(infectedClass) {
    var S = 0;
    var I = 0;
    var R = 0;

    for (var index = 0; index < graph.nodes.length; index++) {
        var individual = graph.nodes[index];

        if (individual.status == "S") S++;
        if (individual.status == "I") I++;
        if (individual.status == "R") R++;
    }

    s_series.push({group:"S", time:timestep, value:S});
    i_series.push({group:"I", time:timestep, value:I});
    r_series.push({group:"R", time:timestep, value:R});

    if (infectedClass == "S") return S;
    if (infectedClass == "I") return I;
    if (infectedClass == "R") return R;
}


function copyGraphByElement(element) {
    var nodes = [];
    var links = [];

    if (element == "nodes") {
        for (var i = 0; i < graph.nodes.length; i++) {
            nodes[i] = graph.nodes[i];
        }
        return nodes;
    }

    if (element == "links") {
        for (var ii = 0; ii < graph.links.length; ii++) {
            links[ii] = graph.links[ii];
        }
        return links;
    }
}

runSimulation();

function runSimulation() {
    startDay = Math.floor(Math.random() * 5);
    var nodes = copyGraphByElement("nodes");
    var links = copyGraphByElement("links");


    while (timestep < 30) {
        runTimesteps();
    }

    for (var time = 0; time < i_series.length; time++) {
        sim_series[time] = i_series[time];
    }


    s_series = [];
    i_series = [];
    r_series = [];

    simulation = false;
    diseaseIsSpreading = false;

    for (var i = 0; i < nodes.length; i++) {
        graph.nodes[i].status = "S";
        graph.nodes[i].exposureTimestep = null;

    }
    vaccineSupply=0;
    timestep = 0;
    updateGraph();
}



function detectEndGame() {
    var numberOf_AtRisk_communities = 0;

    for (var groupIndex = 1; groupIndex < numberOfCommunities+1; groupIndex++) {
        var numberOfSusceptiblesPerGroup = 0;
        var numberOfInfectedPerGroup = 0;

        for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
            var node = graph.nodes[nodeIndex];
            if (parseFloat(node.group) != groupIndex); //do nothing
            else {
                if (node.status == "S") numberOfSusceptiblesPerGroup++;
                if (node.status == "I") numberOfInfectedPerGroup++;
                if (node.status == "E") numberOfInfectedPerGroup++;
            }
        }
        if (numberOfInfectedPerGroup > 0) {
            if (numberOfSusceptiblesPerGroup > 0) {
                numberOf_AtRisk_communities++;

            }
        }
    }

    if (numberOf_AtRisk_communities == 0 && diseaseIsSpreading) {
        endGame = true;

        if (finalStop) return;


        while (timestep < 31) {

            updateExposures();
            infection();
            stateChanges();
            updateGraph();
            this.timestep++;
            getStatuses();
            updateSIRfig();
        }

    }

}


