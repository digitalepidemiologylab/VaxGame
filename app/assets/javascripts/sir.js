function selectIndexCase() {
    var numberOfPeople = graph.nodes.length;

    do{
        var randomIndex = Math.floor(Math.random() * numberOfPeople);
        var indexCase = graph.nodes[randomIndex];
    }
    while (indexCase.status == "V");

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
            var shuffledInfectedNeighborArray = shuffle(infectedNeighborArray);
            var exposer = shuffledInfectedNeighborArray[0];
            exposeIndividual(susceptible, exposer);
        }
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
    }
    else {
        bcScores = computeBetweennessCentrality();
        this.timestep++;
    }

    updateCommunities();

    if (!simulation && diseaseIsSpreading) {
        detectEndGame();
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

    if (infectedClass == "S") return S;
    if (infectedClass == "I") return I;
    if (infectedClass == "R") return R;
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
}


