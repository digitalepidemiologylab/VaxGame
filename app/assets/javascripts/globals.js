// height and width of button-bay, top-right
var widthBay;
var heightBay;

// basic small-world network constants
var numberOfIndividuals;
var rewire;
var meanDegree;
var graph;

// force-directed charge for d3 visualization, must be negative charge for nodes to repulse
var charge;

// jsnetworkx graph object
var G;

// boolean, whether outbreak has been detected
var outbreakDetected;

// boolean, whether vaccine has been researched
var vaccineResearched;

// integer for number of vaccines
var vaccineSupply;

// epidemic announcement boolean.
var epidemicAnnounced;
// rate at which events occurs a result of epidemic announcement & counters for consequences
var rateOfVoluntarySegregation;
var newAdopters;
var rateOfRefusalAdoption;
var newRefusers;

// boolean, martial law declaration and consequences thereof (broken ties)
var martialLawDeclared;
var brokenTies;
var martialLaw_edgeRemovalFrequency; // proportion of edges, in entire graph, that are severed upon martial law


// booleans, medical treatment mode (only one on at a time). doubles, indicate treatment properties.
var vaccinateMode;
var treatMode;
var quarantineMode;
var hospitalQuarantineEfficacy;      // proportion of edges, per individual, that are severed upon treatment
var treatmentEfficacy;               // likelihood that treatment will result in immediate cure


// boolean, visualization toggles (both can be on or off)
var toggleDegree;
var toggleCentrality;


// SIR constants
var timestep;
var transmissionRate;
var recoveryRate;
var maxRecoveryTime;
var indexCase;
var simulation;   //boolean, whether current run is a simulation
var diseaseIsSpreading; // boolean, whether disease is spreading
var endGame;    // boolean, whether games has ended

// arrays that store time-series of SIR state prevalence
var s_series;
var i_series;
var r_series;
var sim_series;

// netrics constants
var twine;
var twineIndex;
var numberOfCommunities;
var largestCommunity;
var communities;
var groupCounter;
var bcScores;


// tutorial
var tutorial = false;

// sirFig

var series;
var n;
var colorLines;
var marginFig;
var widthFig;
var heightFig;
var xFig;
var yFig;
var lineFig;
var svgFig;
var yLabel;
var xLabel;
var simLegend;
var simLabel;
var gameLegend;
var gameLabel;
