// @TODO: YOUR CODE HERE!
let width = parseInt(d3.select("#scatter").style("width"))
let height = width - width / 3.9;

let margin = 20;

let labelArea = 110;

let topPadBottom = 40;
let topPadLeft = 40;


let svg = d3.select("#scatter")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "chart")


var circleRadius;
function GetCircle(){
    if(width <= 530){
        circleRadius = 5;
    } else {
        circleRadius = 10;
    }
}

GetCircle()

svg.append("g").attr("class", "xText")


let xText = d3.select(".xText");

function xTextRefresh(){
    xText.attr("transform", `translate(${((width - labelArea) / 2 + labelArea)}, ${height - margin - topPadBottom})`)
}

xTextRefresh()

xText.append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty (%)")

xText.append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)")

xText.append("text")
    .attr("y", 26 )
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)")


let leftTextX = margin + topPadLeft;
let leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", 'yText')

var yText = d3.select(".yText")

function yTextRefresh(){
    yText.attr(
        "transform",
        `translate(${leftTextX}, ${leftTextY})rotate(-90)`
    )
}
yTextRefresh()

yText.append("text")
    .attr("y", -26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese %")

yText.append("text")
    .attr("x", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes %")

yText.append("text")
    .attr("y", 26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lack Healthcare %")

d3.csv("assets/data/data.csv").then(function(data){
    visualize(data);
})


function visualize(data){
    let curX = "poverty";
    let curY = "obesity";

    
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    let toolTip = d3.tip().attr("class", "d3-tip").offset([40,-60])
    .html(function(d){
        let theX;
        let theState = "<div>" + d.state + "</div>"
        let theY = "<div>" + curY + ":" + d[curY] + "%</div>"
        if(curX === "poverty"){
            theX = "<div>" + curX + ":" + d[curX] + "%</div>"
        } else {
            theX =  "<div>" + curX + ":" + parseFloat(d[curX]).toLocaleString("en") + "%</div>"
        }
        return theState + theX + theY
    })

    
    svg.call(toolTip);


    function xMinMax(){
        xMin = d3.min(data, function(d){
            return parseFloat(d[curX]) * 0.90;
        })
        xMax = d3.max(data, function(d){
            return parseFloat(d[curX]) * 1.10;
        })
    }

    function yMinMax(){
        yMin = d3.min(data, function(d){
            return parseFloat(d[curY]) * 0.90;
        })
        yMax = d3.max(data, function(d){
            return parseFloat(d[curY]) * 1.10;
        })
    }

    function labelChange(axis, clickedText){
        d3.selectAll(".aText")
            .filter("." + axis)
            .filter(".active")
            .classed("active", "false")
            .classed("inactive", true)

            clickedText.classed("inactive", false).classed("active", true)
    }


    yMinMax()
    xMinMax()

    let xScale = d3.scaleLinear()
                .domain([xMin, xMax])
                .range([margin + labelArea, width-margin])
    
    
    let yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin -  labelArea, margin])

    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)

    function tickCount(){
        if(width <= 500){
            xAxis.ticks(5);
            yAxis.ticks(5);
        } else {
            xAxis.ticks(10);
            yAxis.ticks(10);
        }
    }

    tickCount()


    svg.append("g").call(xAxis).attr("class", "xAxis")
    .attr("transform", `translate(0, ${height-margin - labelArea})`)

    svg.append("g").call(yAxis).attr("class", "yAxis")
    .attr("transform", `translate(${margin + labelArea}, 0)`)

    var theCircles = svg.selectAll("g theCircles").data(data).enter()

    theCircles.append("circle")
        .attr("cx", function(d){
            return xScale(d[curX]);
        })
        .attr("cy", function(d){
            return yScale(d[curY]);
        })
        .attr("r", circleRadius)
        .attr("class", function(d){
            return `stateCircle ${d.abbr}`
        })
        .on("mouseover", function(d){
            toolTip.show(d,this);
            d3.select(this).style("stroke", "#323232");
        })
        .on("mouseout", function(d){
            toolTip.hide(d)
            d3.select(this).style("stroke", "#e3e3e3");
        })

    theCircles
    .append("text")
    .text(function(d){
        return d.abbr
    }).attr("dx", function(d){
        return xScale(d[curX])
    })
    .attr("dy", function(d){
        return yScale(d[curY]) + circleRadius / 2.5
    })
    .attr("font-size", circleRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d){
        toolTip.show(d)
        d3.select(`.${d.abbr}`).style("stroke", "#323232");
    })
    .on("mouseout", function(d){
        toolTip.hide(d)
        d3.select(`.${d.abbr}`).style("stroke", "#e3e3e3");
    })
}