function initWorkNet() {
    var workGraph = {};
    var workLinks = [
        {
            "source":1,
            "target":22
        },
        {
            "source":2,
            "target":4
        },
        {
            "source":2,
            "target":6
        },
        {
            "source":2,
            "target":29
        },
        {
            "source":3,
            "target":4
        },
        {
            "source":3,
            "target":7
        },
        {
            "source":3,
            "target":21
        },
        {
            "source":5,
            "target":4
        },
        {
            "source":5,
            "target":8
        },
        {
            "source":5,
            "target":11
        },
        {
            "source":5,
            "target":12
        },
        {
            "source":5,
            "target":13
        },
        {
            "source":6,
            "target":4
        },
        {
            "source":6,
            "target":23
        },
        {
            "source":6,
            "target":24
        },
        {
            "source":6,
            "target":26
        },
        {
            "source":7,
            "target":5
        },
        {
            "source":8,
            "target":9
        },
        {
            "source":8,
            "target":14
        },
        {
            "source":9,
            "target":1
        },
        {
            "source":9,
            "target":7
        },
        {
            "source":9,
            "target":10
        },
        {
            "source":9,
            "target":22
        },
        {
            "source":9,
            "target":44
        },
        {
            "source":10,
            "target":2
        },
        {
            "source":10,
            "target":3
        },
        {
            "source":10,
            "target":5
        },
        {
            "source":14,
            "target":16
        },
        {
            "source":14,
            "target":19
        },
        {
            "source":14,
            "target":37
        },
        {
            "source":14,
            "target":38
        },
        {
            "source":14,
            "target":39
        },
        {
            "source":14,
            "target":40
        },
        {
            "source":14,
            "target":41
        },
        {
            "source":15,
            "target":9
        },
        {
            "source":15,
            "target":11
        },
        {
            "source":15,
            "target":13
        },
        {
            "source":15,
            "target":17
        },
        {
            "source":15,
            "target":18
        },
        {
            "source":15,
            "target":19
        },
        {
            "source":15,
            "target":31
        },
        {
            "source":17,
            "target":43
        },
        {
            "source":18,
            "target":14
        },
        {
            "source":18,
            "target":19
        },
        {
            "source":20,
            "target":3
        },
        {
            "source":21,
            "target":20
        },
        {
            "source":23,
            "target":25
        },
        {
            "source":24,
            "target":25
        },
        {
            "source":24,
            "target":26
        },
        {
            "source":24,
            "target":30
        },
        {
            "source":26,
            "target":27
        },
        {
            "source":26,
            "target":28
        },
        {
            "source":27,
            "target":24
        },
        {
            "source":29,
            "target":6
        },
        {
            "source":29,
            "target":23
        },
        {
            "source":31,
            "target":4
        },
        {
            "source":31,
            "target":5
        },
        {
            "source":31,
            "target":32
        },
        {
            "source":31,
            "target":33
        },
        {
            "source":31,
            "target":36
        },
        {
            "source":32,
            "target":15
        },
        {
            "source":32,
            "target":34
        },
        {
            "source":33,
            "target":29
        },
        {
            "source":33,
            "target":36
        },
        {
            "source":34,
            "target":35
        },
        {
            "source":35,
            "target":33
        },
        {
            "source":36,
            "target":32
        },
        {
            "source":36,
            "target":34
        },
        {
            "source":36,
            "target":35
        },
        {
            "source":37,
            "target":46
        },
        {
            "source":37,
            "target":48
        },
        {
            "source":39,
            "target":14
        },
        {
            "source":39,
            "target":38
        },
        {
            "source":39,
            "target":49
        },
        {
            "source":41,
            "target":16
        },
        {
            "source":41,
            "target":37
        },
        {
            "source":41,
            "target":38
        },
        {
            "source":41,
            "target":39
        },
        {
            "source":41,
            "target":40
        },
        {
            "source":41,
            "target":47
        },
        {
            "source":42,
            "target":14
        },
        {
            "source":42,
            "target":44
        },
        {
            "source":42,
            "target":45
        },
        {
            "source":43,
            "target":19
        },
        {
            "source":43,
            "target":38
        },
        {
            "source":47,
            "target":52
        },
        {
            "source":50,
            "target":14
        },
        {
            "source":51,
            "target":47
        },
        {
            "source":53,
            "target":1
        },
        {
            "source":53,
            "target":22
        },
        {
            "source":54,
            "target":7
        },
        {
            "source":54,
            "target":20
        },
        {
            "source":54,
            "target":22
        },
        {
            "source":55,
            "target":22
        },
        {
            "source":56,
            "target":1
        }
    ]

    var nodes = [];
    for (var i = 1; i < 57; i++) {
        var nodeString = {id:i, status:"S", group:null, edges:[], marked:false, degree:null, bcScore:null, exposureTimestep:null, infectedBy:null};
        nodes.push(nodeString);
    }

    for (var i = 0; i < workLinks.length; i++) {
        var linkToMake = workLinks[i];
        for (var ii = 0; ii < nodes.length; ii++) {
            var nodeToCheck = nodes[ii];
            if (linkToMake.source == nodeToCheck.id) {
                workLinks[i].source = nodes[ii];
            }
        }
    }

    for (var i = 0; i < workLinks.length; i++) {
        var linkToMake = workLinks[i];
        for (var ii = 0; ii < nodes.length; ii++) {
            var nodeToCheck = nodes[ii];
            if (linkToMake.target == nodeToCheck.id) {
                workLinks[i].target = nodes[ii];
            }
        }
    }

//    for (var i = 0; i < workLinks.length; i++) {
//        console.log(workLinks[i].source.id + "\t" + workLinks[i].target.id + "\t" + i)
//    }


    workGraph.links = workLinks;
    workGraph.nodes = nodes;
    return workGraph;
}

function initTheaterNet() {
    var theaterGraph = {};
    var theaterLinks = [
        {
            "source":1,
            "target":2
        },
        {
            "source":2,
            "target":31
        },
        {
            "source":2,
            "target":35
        },
        {
            "source":4,
            "target":5
        },
        {
            "source":5,
            "target":6
        },
        {
            "source":6,
            "target":4
        },
        {
            "source":7,
            "target":8
        },
        {
            "source":8,
            "target":9
        },
        {
            "source":8,
            "target":18
        },
        {
            "source":9,
            "target":1
        },
        {
            "source":9,
            "target":7
        },
        {
            "source":10,
            "target":11
        },
        {
            "source":11,
            "target":3
        },
        {
            "source":12,
            "target":3
        },
        {
            "source":12,
            "target":14
        },
        {
            "source":12,
            "target":15
        },
        {
            "source":13,
            "target":4
        },
        {
            "source":13,
            "target":5
        },
        {
            "source":13,
            "target":12
        },
        {
            "source":13,
            "target":15
        },
        {
            "source":14,
            "target":4
        },
        {
            "source":14,
            "target":13
        },
        {
            "source":15,
            "target":5
        },
        {
            "source":15,
            "target":14
        },
        {
            "source":16,
            "target":24
        },
        {
            "source":17,
            "target":7
        },
        {
            "source":17,
            "target":8
        },
        {
            "source":18,
            "target":7
        },
        {
            "source":18,
            "target":9
        },
        {
            "source":18,
            "target":17
        },
        {
            "source":19,
            "target":11
        },
        {
            "source":20,
            "target":11
        },
        {
            "source":20,
            "target":12
        },
        {
            "source":20,
            "target":14
        },
        {
            "source":20,
            "target":19
        },
        {
            "source":21,
            "target":22
        },
        {
            "source":22,
            "target":19
        },
        {
            "source":23,
            "target":24
        },
        {
            "source":24,
            "target":15
        },
        {
            "source":25,
            "target":26
        },
        {
            "source":25,
            "target":28
        },
        {
            "source":26,
            "target":29
        },
        {
            "source":26,
            "target":41
        },
        {
            "source":28,
            "target":26
        },
        {
            "source":28,
            "target":29
        },
        {
            "source":28,
            "target":30
        },
        {
            "source":28,
            "target":42
        },
        {
            "source":29,
            "target":30
        },
        {
            "source":31,
            "target":30
        },
        {
            "source":31,
            "target":32
        },
        {
            "source":32,
            "target":33
        },
        {
            "source":33,
            "target":31
        },
        {
            "source":34,
            "target":19
        },
        {
            "source":34,
            "target":22
        },
        {
            "source":34,
            "target":35
        },
        {
            "source":34,
            "target":36
        },
        {
            "source":35,
            "target":36
        },
        {
            "source":37,
            "target":33
        },
        {
            "source":37,
            "target":43
        },
        {
            "source":38,
            "target":23
        },
        {
            "source":39,
            "target":23
        },
        {
            "source":39,
            "target":38
        },
        {
            "source":40,
            "target":32
        },
        {
            "source":40,
            "target":33
        },
        {
            "source":40,
            "target":37
        },
        {
            "source":41,
            "target":25
        },
        {
            "source":41,
            "target":42
        },
        {
            "source":42,
            "target":26
        },
        {
            "source":42,
            "target":28
        },
        {
            "source":42,
            "target":43
        },
        {
            "source":43,
            "target":26
        },
        {
            "source":43,
            "target":28
        },
        {
            "source":43,
            "target":41
        },
        {
            "source":43,
            "target":46
        },
        {
            "source":44,
            "target":37
        },
        {
            "source":44,
            "target":40
        },
        {
            "source":44,
            "target":47
        },
        {
            "source":44,
            "target":48
        },
        {
            "source":45,
            "target":44
        },
        {
            "source":45,
            "target":47
        },
        {
            "source":45,
            "target":48
        },
        {
            "source":46,
            "target":44
        },
        {
            "source":46,
            "target":45
        },
        {
            "source":46,
            "target":47
        },
        {
            "source":46,
            "target":48
        },
        {
            "source":47,
            "target":37
        },
        {
            "source":47,
            "target":40
        },
        {
            "source":48,
            "target":37
        },
        {
            "source":48,
            "target":38
        },
        {
            "source":48,
            "target":47
        }
    ]

    var nodes = [];
    for (var i = 1; i < 49; i++) {
        var nodeString = {id:i, status:"S", group:null, edges:[], marked:false, degree:null, bcScore:null, exposureTimestep:null, infectedBy:null};
        nodes.push(nodeString);
    }

    var links = [];
    for (var i = 0; i < theaterLinks.length; i++) {
        var sourceToMake = theaterLinks[i].source;
        var targetToMake = theaterLinks[i].target;
        for (var ii = 0; ii < nodes.length; ii++) {
            if (sourceToMake == nodes[ii].id) {
                for (var iii = 0; iii < nodes.length; iii++) {
                    if (targetToMake == nodes[iii].id) {
                        var linkString = {source:nodes[ii],target:nodes[iii],remove:false};
                        links.push(linkString);
                    }
                }
            }
        }
    }


    theaterGraph.nodes = nodes;
    theaterGraph.links = links;
    return theaterGraph;
}

function initRestaurantNet() {

}

function initShopNet() {

}

function initClubNet() {

}

function initRandomNet() {
    if (difficulty == "easy") {
        numberOfIndividuals = 50;
        meanDegree = 3;
        numberOfVaccines = 5;
        independentOutbreaks = 1;
        transmissionRate = 0.7;
        recoveryRate = 0;
    }

    if (difficulty == "medium") {
        numberOfIndividuals = 75;
        meanDegree = 4;
        numberOfVaccines = 10;
        independentOutbreaks = 2;
        transmissionRate = 0.7;
        recoveryRate = 0;
        numberOfRefusers = 5;
    }

    if (difficulty == "hard") {
        charge = -300;
        numberOfIndividuals = 100;
        meanDegree = 4;
        numberOfVaccines = 15;
        transmissionRate = 0.4;
        recoveryRate = 0;
        independentOutbreaks = 3;
        numberOfRefusers = 10;
    }
    return generateSmallWorld(numberOfIndividuals, rewire, meanDegree);
}

