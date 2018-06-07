// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 100,
  bottom: 60,
  left: 150
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

var leftAxis   = d3.axisLeft(yLinearScale);
var bottomAxis = d3.axisBottom(xScale);

var yDataSelected;

var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { 
		return "State: " + d.state + "<br> % Depr: " + d.depression + "% Employment Class: "+ d.unableToWork; });

function onClickYLabels(data) {
	d3.select('#yHomemaker').on('click', function() {
		var maxWork = d3.max(data.map(data=>Number(data.homemaker)));
		var minWork = d3.min(data.map(data=>Number(data.homemaker)));
		
		yLinearScale.domain([minWork-2,maxWork+2])
		chartGroup.select("#leftAxis")
			.transition()
			.call(leftAxis);
		console.log(this)	
		document.querySelector(".selected").setAttribute("class","unselected")
		this.setAttribute("class","selected")
		console.log(data);
		var newText = chartGroup.selectAll("#textGroup").data(data)
		newText.enter().append("text")
			.merge(newText)
			.transition()
			.attr("x", function(d) {return xScale(d.depression)-7;})
			.attr("y", function(d) {return yLinearScale(d.homemaker)+3.5;})
		
		var newScatter = chartGroup.selectAll("circle").data(data);
		newScatter.enter().append("circle")
			.merge(newScatter)
			.transition()
			.attr("cx", function(d) {return xScale(d.depression);})
			.attr("cy", function(d) {return yLinearScale(d.homemaker);});
		tool_tip.html(function(d) {
			return  "State: " + d.state + 
				"<br> % Depression: " + d.depression + 
				"<br> % Homemaker: "+ d.homemaker; 
		});
		chartGroup.call(tool_tip);

	});
	d3.select('#yRetired').on('click', function() {
		yDataSelected = "#yRetired";
		var maxWork = d3.max(data.map(data=>Number(data.retired)));
        	var minWork = d3.min(data.map(data=>Number(data.retired)));

		yLinearScale.domain([minWork-2,maxWork+2])
		chartGroup.select("#leftAxis")
			.transition()
			.call(leftAxis);

		document.querySelector(".selected").setAttribute("class","unselected")
		this.setAttribute("class","selected")

		console.log(data);
		var newText = chartGroup.selectAll("#textGroup").data(data)
		newText.enter().append("text")
			.merge(newText)
			.transition()
			.attr("x", function(d) {return xScale(d.depression)-7;})
			.attr("y", function(d) {return yLinearScale(d.retired)+3.5;})

		var newScatter = chartGroup.selectAll("circle").data(data);
		newScatter.enter().append("circle")
			.merge(newScatter)
			.transition()
			.attr("cx", function(d) {return xScale(d.depression);})
			.attr("cy", function(d) {return yLinearScale(d.retired);});

		tool_tip.html(function(d) {
			return  "State: " + d.state + 
				"<br> % Depression: " + d.depression + 
				"<br> % Unable to work: "+ d.retired; 
		});
		chartGroup.call(tool_tip);

	});
	d3.select('#yUnable').on('click', function() {
		var maxWork = d3.max(data.map(data=>Number(data.unableToWork)));
		var minWork = d3.min(data.map(data=>Number(data.unableToWork)));
		
		yLinearScale.domain([minWork-2,maxWork+2])
		chartGroup.select("#leftAxis")
			.transition()
			.call(leftAxis);

		document.querySelector(".selected").setAttribute("class","unselected")
		this.setAttribute("class","selected")
		
		console.log(data);
		var newText = chartGroup.selectAll("#textGroup").data(data)
		newText.enter().append("text")
			.merge(newText)
			.transition()
			.attr("x", function(d) {return xScale(d.depression)-7;})
			.attr("y", function(d) {return yLinearScale(d.unableToWork)+3.5;})
		
		var newScatter = chartGroup.selectAll("circle").data(data);
		newScatter.enter().append("circle")
			.merge(newScatter)
			.transition()
			.attr("cx", function(d) {return xScale(d.depression);})
			.attr("cy", function(d) {return yLinearScale(d.unableToWork);});

		tool_tip.html(function(d) {
			return  "State: " + d.state + 
				"<br> % Depression: " + d.depression + 
				"<br> % Unable to work: " + d.unableToWork; 
		});
		chartGroup.call(tool_tip);
	});
};

d3.csv("BRFSS_correlated.csv", function(error, response) {
	var  data = response.map( function(d) {return {"state":d.States,"retired":d.Retired,"homemaker":d.Homemaker, "depression":d.DepressionYes, "id":d.Id, "unableToWork":d.unableToWork};} );
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

	//var leftAxis = d3.axisLeft(yLinearScale);
	//var bottomAxis = d3.axisBottom(xScale);
	leftAxis = d3.axisLeft(yLinearScale);
	bottomAxis = d3.axisBottom(xScale);
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
		.attr("id","leftAxis")
		.attr("font-size","14px");

	chartGroup.append("text")
		.attr('transform', 'rotate(-90)')
		.attr("x", -(height/2) )
		.attr("y", -margin.left/2-20)
		.style("text-anchor", "middle")
		.attr("id","yUnable")
		.attr('class','selected')
		.text("% Unable to Work");

	chartGroup.append("text")
		.attr('transform','rotate(-90)')
		.attr('x', -(height/2) )
		.attr('y', -margin.left/2  )
		.style('text-anchor','middle')
		.attr('id','yRetired')
		.attr('class','unselected')
		.text("% Retired");

	chartGroup.append("text")
		.attr('transform','rotate(-90)')
		.attr('x', -(height/2) )
		.attr('y', -margin.left/2 + 20  )
		.style('text-anchor','middle')
		.attr('id','yHomemaker')
		.attr('class','unselected')
		.text("% Homemaker");

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
		.attr("fill","black");

	chartGroup.append("g")
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return xScale(d.depression);})
		.attr("cy", function(d) {return yLinearScale(d.unableToWork);}) 
		.attr("r", "14")
		.attr("id",function(d) {return "circle"+d.state;})
		.style("fill", "gray")
		.style("opacity","0.5")
		.on('mouseover', tool_tip.show)
		.on('mouseout', tool_tip.hide);

	onClickYLabels(data);
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

d3.select(window).on('resize', resize)
