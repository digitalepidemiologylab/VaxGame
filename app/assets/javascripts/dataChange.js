function metric(node) {
    var metric = null;
    if (sizeByDegree == false) {
        if (sizeByBC == false) metric = 8;   // both false, basic
        if (sizeByBC == true) metric = (node.bcScore / 0.025) + 6;  // only bc
    }
    else {
        if (sizeByBC == true) metric = ((node.bcScore / 0.01) + 1) + ((node.degree + 2) * 2) / 2; // both true, composite
        if (sizeByBC == false) metric =  (node.degree + 2) * 2; // only degree
    }
    return metric;
}

function color(node) {
    var color = null;
    if (node.status == "S") color = "#37FDFC";
    if (node.status == "V") color = "#ffff00";
    if (node.status == "E") color = "#db3248";
    if (node.status == "I") color = "#ff0000";
    if (node.status == "R") color = "#9400D3";
    if (node.status == "Q") color = "#37F000";
    if (node.status == "VOL") color = "#ffff00";
    if (node.status == "REF") color = "#37FDFC";
    return color;
}