var rerun = false;

function selectIndexCase() {
    var numberOfPeople = graph.nodes.length;
    var breakCounter = 0;
    do{
        var randomIndex = Math.floor(Math.random() * numberOfPeople);
        var indexCase = graph.nodes[randomIndex];
        breakCounter++;
    }
    while (indexCase.status == "V" && breakCounter < 500);

    if (breakCounter == 500) indexCase.status = "S";

    this.indexCase = null;
    this.indexCase = indexCase;
    infectIndividual(this.indexCase);
}

function infectIndividual(individual) {
    if (individual.status == "S" || individual.status == "REF") {
        individual.status = "I";
        individual.exposureTimestep = this.timestep;
    }
}

function exposeIndividual(individual, exposer) {
    exposureEdges = [];
    if (individual.status == "S" || individual.status == "REF") {
        individual.status = "E";
        individual.infectedBy = exposer;
    }

    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.id == exposer.id && graph.links[i].target.id == individual.id) exposureEdges.push(graph.links[i]);
        else {
            if (graph.links[i].source.id == individual.id && graph.links[i].target.id == exposer.id) exposureEdges.push(graph.links[i]);
        }
    }
}

function updateExposures() {
    var newInfections = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == "E") {
            graph.nodes[i].status = "I";
            newInfections.push(graph.nodes[i]);
            graph.nodes[i].exposureTimestep = this.timestep;
        }
    }
    return newInfections;
}

function infectedToRecovered(individual) {
    if (individual.status != "I") return;
    var timeSinceInfection = this.timestep - individual.exposureTimestep;

    // 1 - (1 - recoveryPerIndividualPerTimestep)^timeInfected
    if (Math.random() < (1-(Math.pow((1 - recoveryRate), timeSinceInfection))) || (timeSinceInfection > 10)) {

        if (game) return;  // game has no recovery
        individual.status = "R";
    }
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
    if (!rerun) transmissionRate = 0.35;
    else {
        transmissionRate = 1;
    }

    var numberOfInfectionsPerRound = 0;
    for (var index = 0; index < graph.nodes.length; index++) {
        if (graph.nodes[index].status != "S") continue;
        var susceptible = graph.nodes[index];
        var neighbors = findNeighbors(susceptible);
        var infectedNeighborArray = [];
        var numberOfInfectedNeighbors = 0;
        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
            var neighbor = neighbors[neighborIndex];
            if (neighbor.status == "I") {
                infectedNeighborArray.push(neighbors[neighborIndex]);
                numberOfInfectedNeighbors++;
            }
        }
        var probabilityOfInfection = 1.0 - Math.pow(1.0 - transmissionRate,numberOfInfectedNeighbors);
        if (Math.random() < probabilityOfInfection) {
            numberOfInfectionsPerRound++;
            var shuffledInfectedNeighborArray = shuffle(infectedNeighborArray);
            var exposer = shuffledInfectedNeighborArray[0];
            exposeIndividual(susceptible, exposer);
        }
    }

    if (numberOfInfectionsPerRound > 0) {
        rerun = false;
        transmissionRate = 0.35;
    }
    else {
        if (game) detectGameCompletion()
        else detectCompletion();

        if (timeToStop) {
            return;
        }

        rerun = true;
        transmissionRate = 1;
        infection();
    }


}

function infection_noGuaranteedTransmission() {
    var numberOfInfectionsPerRound = 0;
    for (var index = 0; index < graph.nodes.length; index++) {
        if (graph.nodes[index].status != "S") continue;
        var susceptible = graph.nodes[index];
        var neighbors = findNeighbors(susceptible);
        var infectedNeighborArray = [];
        var numberOfInfectedNeighbors = 0;
        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
            var neighbor = neighbors[neighborIndex];
            if (neighbor.status == "I") {
                infectedNeighborArray.push(neighbors[neighborIndex]);
                numberOfInfectedNeighbors++;
            }
        }
        var probabilityOfInfection = 1.0 - Math.pow(1.0 - transmissionRate,numberOfInfectedNeighbors);
        if (Math.random() < probabilityOfInfection) {
            numberOfInfectionsPerRound++;
            var shuffledInfectedNeighborArray = shuffle(infectedNeighborArray);
            var exposer = shuffledInfectedNeighborArray[0];
            exposeIndividual(susceptible, exposer);
        }
    }
}

function getStatuses(infectedClass) {
    var S = 0;
    var I = 0;
    var R = 0;
    var V = 0;

    for (var index = 0; index < graph.nodes.length; index++) {
        var individual = graph.nodes[index];

        if (individual.status == "S") S++;
        if (individual.status == "I") I++;
        if (individual.status == "R") R++;
        if (individual.status == "V") V++;
    }

    if (infectedClass == "S") return S;
    if (infectedClass == "I") return I;
    if (infectedClass == "R") return R;
    if (infectedClass == "V") return V;

}



function detectEndGame() {
    updateCommunities();
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
        diseaseIsSpreading = false;
        timeToStop = true;
        if (vaccinateMode && !quarantineMode && !game) {
            animatePathogens_thenUpdate();
            tutorialUpdate();
        }

    }
}


