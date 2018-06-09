// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  d3.json("/bombarded_countries", function (error, targeted_data) {

    // Log an error if one exists
    if (error) return console.warn(error);
  
    // Print the data
    console.log(targeted_data);
  
    // Cast the hours value to a number for each piece of tvData
    targeted_data.forEach(function (data) {
      data.locations = +data.locations;
    });
  
     // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xBandScale = d3.scaleBand()
     .domain(targeted_data.map(d => d.name))
     .range([0, chartWidth])
     .padding(0.1);

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(targeted_data, d => d.locations)])
     .range([chartHeight, 0])
  
    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
     .call(leftAxis);
    
    chartGroup.append("g")
     .attr("transform", `translate(0, ${chartHeight})`)
     .call(bottomAxis);

    // Create one SVG rectangle per piece of tvData
    // Use the linear and band scales to position each rectangle within the chart
    chartGroup.selectAll(".bar")
     .data(targeted_data)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", d => xBandScale(d.name))
     .attr("y", d => yLinearScale(d.locations))
     .attr("width", xBandScale.bandwidth())
     .attr("height", d => chartHeight - yLinearScale(d.locations));

    });
