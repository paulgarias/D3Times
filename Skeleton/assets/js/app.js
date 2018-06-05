// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 50,
  bottom: 60,
  left: 50
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleLinear()
var yLinearScale = d3.scaleLinear()


var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return "State: " + d.state; });

d3.csv("BRFSS_correlated.csv", function(error, response) {
	var  data = response.map( function(d) {return {"state":d.States, "depression":d.DepressionYes, "id":d.Id, "unableToWork":d.unableToWork};} );
	//console.log(data);
	
	var maxDepression = d3.max(data.map(data=>Number(data.depression)));
	var minDepression = d3.min(data.map(data=>Number(data.depression)));

	var maxWork = d3.max(data.map(data=>Number(data.unableToWork)));
	var minWork = d3.min(data.map(data=>Number(data.unableToWork)));

	//console.log(maxWork);
	//console.log(minWork);

	xScale.domain([minDepression-2, maxDepression+2])
		.range([0,width])
	
	yLinearScale.domain([minWork-2,maxWork+2])
		.range([height,0])

	var leftAxis = d3.axisLeft(yLinearScale);
	var bottomAxis = d3.axisBottom(xScale);
	chartGroup.call(tool_tip)

	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.attr("id","xAxisGroup")
		.call(bottomAxis)
		.attr("font-size","14px");

	chartGroup.append("text")
		.attr("x", width/2)
		.attr("y",height+margin.top/2+margin.bottom/2-12)
		.style("text-anchor","middle")
		.attr("id","xLabel")
		.text("% rate of depression");
	
	chartGroup.append("g")
		.call(leftAxis)
		.attr("font-size","14px");

	chartGroup.append("text")
		.attr('transform', 'rotate(-90)')
		.attr("x", -(height/2) )
		.attr("y", -margin.left/2)
		.style("text-anchor", "middle")
		.attr("id","yLabel")
		.text("% Unable to Work");

	chartGroup.append("g")
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return xScale(d.depression);})
		.attr("cy", function(d) {return yLinearScale(d.unableToWork);}) 
		.attr("r", "14")
		.attr("id",function(d) {return "circle"+d.state;})
		.style("fill", "blue")
		.style("opacity","0.7")
		.on('mouseover', tool_tip.show)
		.on('mouseout', tool_tip.hide);

	chartGroup.append("g")
		.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.attr("x", function(d) {return xScale(d.depression)-7;})
		.attr("y", function(d) {return yLinearScale(d.unableToWork)+3.5;})
		.text( function(d) {return d.state; })
		.attr("id","textGroup")
		.attr("font-family", "sans-serif")
		.attr("font-size","10px")
		.attr("fill","white");
});

function resize() {
	width = parseInt(d3.select("#chart").style("width"), 10);
	width = width - margin.left - margin.right;

	d3.select(chartGroup.node().parentNode)
		.style("width", (width + margin.left+margin.right)+'px');

	xScale.range([0,width])

	var bottomAxis = d3.axisBottom(xScale);

	chartGroup.select("#xAxisGroup").remove();
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.attr("id","xAxisGroup")
		.call(bottomAxis)
		.attr("font-size","14px");

	chartGroup.selectAll("circle")
		.attr("cx", function(d) { return xScale(d.depression); });

	chartGroup.selectAll("text#textGroup")
		.attr("x", function(d) { return xScale(d.depression)-7; });

	chartGroup.select("#xLabel")
		.attr("x",width/2);
};

d3.select(window).on('resize', resize);
