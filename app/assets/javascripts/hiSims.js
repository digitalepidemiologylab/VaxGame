var recoveryRate = 0.01;
var transmissionRate = 1;
var coefficientOfVariation;
var effectiveR0;
var meanDegree;
var stddev;
var degreeMeasures = [];
var susceptible = 0;
var infected = 0;
var recovered = 0;
var vaccinated = 0;

function initVariables(transmit, recover) {
    recoveryRate = recover;
    transmissionRate = transmit;
    coefficientOfVariation = measureCV();
    effectiveR0 = estimateR0();
}

function measureMeanDegree() {
    // mean degree
    degreeMeasures = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        degreeMeasures.push(findNeighbors(graph.nodes[i]).length);
    }

    var sum = 0;
    for (var i = 0; i < degreeMeasures.length; i++) {
        sum += degreeMeasures[i];
    }

    meanDegree = sum / degreeMeasures.length;
}

function measureStandardDeviation() {
    //variance from the mean degree --> sum of squared deltas --> sum(measure[i] - delta)^2
    var squaredSum_deltaMean = 0;
    for (var i = 0; i < degreeMeasures.length; i++) {
        squaredSum_deltaMean += Math.pow((degreeMeasures[i] - meanDegree), 2);
    }

    // square of the average variance
    stddev = 0;
    stddev = Math.pow((squaredSum_deltaMean / degreeMeasures.length), 0.5)
}

function measureCV() {
    measureMeanDegree();
    measureStandardDeviation();
    return stddev / meanDegree;
}

function estimateR0() {
    return (transmissionRate / recoveryRate) * meanDegree * (1 + (coefficientOfVariation*coefficientOfVariation));
}

function runSims(coverageInterval, steps, maxSims) {
    var count = 0;
    var vaxCoverage;
    for (var vaxCovgCounter = 0; vaxCovgCounter < steps; vaxCovgCounter++) {
        for (var simCount = 0; simCount < maxSims; simCount++) {
            count++;
            resetInitials();
            vaxCoverage = vaxCovgCounter * coverageInterval;
            singleSim(vaxCoverage);
        }
    }
}

function singleSim(vaxCoverage) {
    vaccinateRandomly(vaxCoverage)
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == "V") vaccinated++;
    }

    selectIndexCase();
    diseaseIsSpreading = true;
    outbreakTimesteps();
}

function outbreakTimesteps() {
    infection();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectGameCompletion();
}

function vaccinateRandomly(vaxCoverage) {
    for (var i = 0; i < graph.nodes.length; i++) {
        var node = graph.nodes[i];
        if (Math.random() < vaxCoverage) node.status = "V";
    }
}

function resetInitials() {
    timestep = 0;
    diseaseIsSpreading = false;
    timeToStop = false;

    for (var i = 0; i < graph.nodes.length; i++) {
        var node = graph.nodes[i];
        node.status = "S";
        node.infectedBy = null;
        node.exposureTimestep = null;
    }

}
