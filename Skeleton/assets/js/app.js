// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
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



d3.csv("BRFSS_correlated.csv", function(error, response) {
	var  data = response.map( function(d) {return {"state":d.States, "depression":d.DepressionYes, "id":d.Id, "unableToWork":d.unableToWork};} );
	//console.log(data);
	
	var maxDepression = d3.max(data.map(data=>Number(data.depression)));
	var minDepression = d3.min(data.map(data=>Number(data.depression)));

	var maxWork = d3.max(data.map(data=>Number(data.unableToWork)));
	var minWork = d3.min(data.map(data=>Number(data.unableToWork)));

	//console.log(maxWork);
	//console.log(minWork);

	var xScale = d3.scaleLinear()
		.domain([minDepression-2, maxDepression+2])
		.range([0,width])
	
	var yLinearScale = d3.scaleLinear()
		.domain([minWork-2,maxWork+2])
		.range([height,0])

	var leftAxis = d3.axisLeft(yLinearScale);
	var bottomAxis = d3.axisBottom(xScale);

	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis)
		.attr("font-size","14px");
	
	chartGroup.append("g")
		.call(leftAxis)
		.attr("font-size","14px");

	chartGroup.append("g")
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return xScale(d.depression);})
		.attr("cy", function(d) {return yLinearScale(d.unableToWork);}) 
		.attr("r", "14")
		.style("fill", "blue")
		.style("opacity","0.7");

	chartGroup.append("g")
		.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.attr("x", function(d) {return xScale(d.depression)-7;})
		.attr("y", function(d) {return yLinearScale(d.unableToWork)+3.5;})
		.text( function(d) {return d.state; })
		.attr("font-family", "sans-serif")
		.attr("font-size","10px")
		.attr("fill","white");
	
	
});

function resize() {
	width = parseInt(d3.select("#chart").style("width"), 10);
	width = width - margin.left - margin.right;
	d3.select(chartGroup.node().parentNode)
		.style("width", (width + margin.left+margin.right)+'px');

	console.log(d3.select("svg").style("width"));

};

d3.select(window).on('resize', resize);

