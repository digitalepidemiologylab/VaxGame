function metric(node) {
    var metric = null;
    if (node.bcScore == 0) node.bcScore = 0.00001;
    if (toggleDegree == false) {
        if (toggleCentrality == false) metric = 8;   // both false, basic
        if (toggleCentrality == true) metric = (node.bcScore / 0.025) + 6;  // only bc
    }
    else {
        if (toggleCentrality == true) metric = (((node.bcScore / 0.01) + 1) + ((node.degree + 2) * 2)) / 2; // both true, composite
        if (toggleCentrality == false) metric =  (node.degree + 2) * 2; // only degree
    }
    if (metric < 6) metric = 3;
    if (isNaN(metric)) metric = 3;


    return metric;
}

function color(node) {
    var color = null;

    if (outbreakDetected && diseaseIsSpreading) {
        if (node.status == "S") color = "#37FDFC";
        if (node.status == "V") color = "#ffff00";
        if (node.status == "E") color = "#db3248";
        if (node.status == "I") color = "#ff0000";
        if (node.status == "R") color = "#9400D3";
        if (node.status == "Q") color = "#37F000";
        if (node.status == "VOL") color = "#ffff00";
        if (node.status == "REF") color = "#000000";
        return color;
    }

    else {
        if (node.status == "S") color = "#37FDFC";
        if (node.status == "V") color = "#ffff00";
        if (node.status == "E") color = "#37FDFC";
        if (node.status == "I") color = "#37FDFC";
        if (node.status == "R") color = "#37FDFC";
        if (node.status == "Q") color = "#37F000";
        if (node.status == "VOL") color = "#37F000";
        if (node.status == "REF") color = "#000000";
        return color;
    }

}