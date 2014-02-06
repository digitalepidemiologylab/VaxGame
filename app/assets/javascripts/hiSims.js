// network measures and network-based disease measures
var degreeMeasures = [];
var meanDegree;
var stddev;
var coefficientOfVariation;
var effectiveR0;
var threshold = 3;

// sim control
var vaxCoverageInterval = 0.10;
var maxSims = 250;
var steps = (1.0 / vaxCoverageInterval);

var formatPercent = d3.format("%");


// init
// initSimVars(vaxCoverageInterval, maxSims);

function initSimVars(vaxCovg_stepSize, sims) {
    vaxCoverageInterval = vaxCovg_stepSize;
    maxSims = sims;
    steps = (1.0 / vaxCoverageInterval) - 1;

    coefficientOfVariation = measureCV();
    effectiveR0 = estimateR0();

    runSims();
}

function measureMeanDegree() {
    // mean degree
    var sum = 0;
    degreeMeasures = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        degreeMeasures.push(findNeighbors(graph.nodes[i]).length);
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

function measureR0() {
    var count = 0;
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].infectedBy == indexCase) count++;
    }
    return count;
}

function runSims() {
    testSimCounter = 0;
    testSimArray = [];
    meanFinalEpidemicSizes = [];
    meanMeasuredR0 = [];
    var vaxCoverage;
    for (var vaxCovgCounter = 1; vaxCovgCounter < steps; vaxCovgCounter++) {
        var sumFinalEpidemicSize = 0;
        var sumMeasuredR0 = 0;
        vaxCoverage = vaxCovgCounter * vaxCoverageInterval;
        coverages.push(formatPercent(vaxCoverage))
        for (var simCount = 0; simCount < maxSims; simCount++) {
            resetInitials();
            singleSim(vaxCoverage);
            sumFinalEpidemicSize += getStatuses("R");
            sumMeasuredR0 += measureR0();

        }
        meanMeasuredR0.push((sumMeasuredR0 / maxSims));
        meanFinalEpidemicSizes.push((sumFinalEpidemicSize / maxSims));

    }
}

function runSimsGivenCoverage(vaxCoverage) {
    var sumFinalEpidemicSize = 0;
    var sumMeasuredR0 = 0;
    var sumOutbreaksAboveThreshold = 0;

    for (var simCount = 0; simCount < maxSims; simCount++) {
        resetInitials();
        singleSim(vaxCoverage);
        sumMeasuredR0 += measureR0();
        if (getStatuses("R") > threshold) {
            sumOutbreaksAboveThreshold++;
            sumFinalEpidemicSize += getStatuses("R");
        }
    }
    meanMeasuredR0[simSet] = (sumMeasuredR0 / maxSims);
    meanFinalEpidemicSizes[simSet] = (sumFinalEpidemicSize / maxSims)
    outbreakFrequency[simSet] = (sumOutbreaksAboveThreshold / maxSims)
    simSet++;
}

function singleSim(vaxCoverage) {
    diseaseIsSpreading = true;
    vaccinateRandomly(vaxCoverage)
    selectIndexCase();
    outbreakTimesteps();
}

function outbreakTimesteps() {
    if (simSet > 9) {
        return;
    }
    infection_noGuaranteedTransmission();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectSimCompletion();


}

function detectSimCompletion() {
    if (getStatuses("I") == 0 && timestep > 0) {
        timeToStop = true;
        diseaseIsSpreading = false;
    }
    else {
        outbreakTimesteps();
    }
}

function vaccinateRandomly(vaxCoverage) {
    if (vaxCoverage == null) return;
    for (var i = 0; i < graph.nodes.length; i++) {
        var node = graph.nodes[i];
        if (Math.random() < vaxCoverage) {
            node.status = "V";
            if (imperfectVaccines && Math.random() < 0.20) {
                node.status = "S";
            }
        }


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
