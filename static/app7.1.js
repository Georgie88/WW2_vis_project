var width  = 800;
var height = 600;

var vis = d3.select("#vis").append("svg")
    .attr("width", width).attr("height", height);

var toolTip = d3.select("#vis").append("div")
    .attr("class", "tooltip"); 

d3.json("/static/custom.geo.json", function(error, json) {
     // create a first guess for the projection
     var center = d3.geo.centroid(json)
     var scale  = 400;
     var offset = [width, height/6];
     var projection = d3.geo.mercator().scale(scale).center(center)
         .translate(offset);
 
     // create the path
     var path = d3.geo.path().projection(projection);

    d3.csv("/static/combined4.csv", function(error, csv) {

        var europe = json.features;

        csv.forEach(function(d, i) {
            europe.forEach(function(e, j) {
                if (d.name === e.properties.name) {
                    e.properties.pop1939 = d.pop1939
                    e.properties.pop1940 = d.pop1940
                    e.properties.pop1941 = d.pop1941
                    e.properties.pop1942 = d.pop1942
                    e.properties.pop1943 = d.pop1943
                    e.properties.pop1944 = d.pop1944
                    e.properties.pop1945 = d.pop1945
                    e.properties.gdp1939 = +d.gdp1939
                    e.properties.gdp1940 = +d.gdp1940
                    e.properties.gdp1941 = +d.gdp1941
                    e.properties.gdp1942 = +d.gdp1942
                    e.properties.gdp1943 = +d.gdp1943
                    e.properties.gdp1944 = +d.gdp1944
                    e.properties.gdp1945 = +d.gdp1945
                    e.properties.lifeExp1939 = +d.lifeExp1939
                    e.properties.lifeExp1940 = +d.lifeExp1940
                    e.properties.lifeExp1941 = +d.lifeExp1941
                    e.properties.lifeExp1942 = +d.lifeExp1942
                    e.properties.lifeExp1943 = +d.lifeExp1943
                    e.properties.lifeExp1944 = +d.lifeExp1944
                    e.properties.lifeExp1945 = +d.lifeExp1945
                }
            })
        
        })
        console.log("combined tester", europe)
    
    vis.selectAll("path")
      .data(europe)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "mediumaquamarine")
      .style("stroke-width", ".5")
      .style("stroke", "black")
      
      .on("mouseover", function(d) {      
    	toolTip.transition()        
      	   .duration(50)      
           .style("opacity", .9)      
        toolTip.html(`<b>${d.properties.name}</b> <br> `+ `Population: ${d.properties.pop1939}`+ `<br/> GDP: ${d.properties.gdp1939}`+ `<br/> Life Expectancy: ${d.properties.lifeExp1939}`)	
        .style("left", d3.event.pageX - 600 + "px")
        .style("top", d3.event.pageY - 100 + "px");	
       })  

        // fade out tooltip on mouse out               
       .on("mouseout", function(d) {       
          toolTip.transition()        
            .duration(500)      
            .style("opacity", 0); 
        })
        vis.append("g") 
            .attr("class", "circles")
        .selectAll("circle")
        .data(europe)
        .enter().append("circle")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("r", 5)
        .style("fill", "tomato")
        .style("opacity", ".6");
  

//bar chart ------------->
        
var width2  = 800;
var height2 = 650;

// Define the chart's margins as an object
// // margins
var chartMargin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 80
};

// Define dimensions of the chart area
var chartWidth = width2 - chartMargin.left - chartMargin.right;
var chartHeight = height2 - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#bar")
    .append("svg")
    .attr("height", height2)
    .attr("width", width2)

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("/static/combined4.csv", function (error, csvData) {

    // Log an error if one exists
    if (error) return console.warn(error);

    
    console.log(csvData);

    
    csvData.forEach(function (data) {
    data.gdp1939 = +data.gdp1939;
    });
  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xScale = d3.scaleBand()
        .domain(csvData.map(d => d.name))
        .range([0, chartWidth])
        .padding(0.1);

    // Create a linear scale for the vertical axis.
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, d => d.gdp1939)])
        .range([chartHeight, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale).ticks(csvData.length);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis)
        .selectAll("text")
        .attr("dx", "45")
        .attr("dy", "5")
        .attr("transform", "rotate(45)" )
        .style("bold");

    chartGroup.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .classed("bar", true)
        .style("fill", "tomato")
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.gdp1939))
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.gdp1939));  
  })

//bar chart 2------------->
        
var width3  = 800;
var height3 = 650;

// Define the chart's margins as an object
// // margins
var chartMargin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 30
};

// Define dimensions of the chart area
var chartWidth2 = width3 - chartMargin.left - chartMargin.right;
var chartHeight2 = height3 - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var bar2 = d3
    .select("#bar2")
    .append("svg")
    .attr("height", height3)
    .attr("width", width3)

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup3 = bar2.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


var barToolTip = d3.select("#bar2").append("div")
  .attr("class", "tooltip"); 
  // .offset([-10, 0])
  // .html(function (d) {return `<b>${d.name}</b> <br> ``<br/> GDP: ${d.gdp1939}`})

// Load data from hours-of-tv-watched.csv
d3.csv("/static/combined4.csv", function (error, csvData) {

    // Log an error if one exists
    if (error) return console.warn(error);

    // Print the tvData
    console.log(csvData);

    // Cast the hours value to a number for each piece of tvData
    csvData.forEach(function (data) {
    data.pop1939 = +data.pop1939;
    });
  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xScale = d3.scaleBand()
        .domain(csvData.map(d => d.name))
        .range([0, chartWidth2])
        .padding(0.1);

    // Create a linear scale for the vertical axis.
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, d => d.pop1939)])
        .range([chartHeight2, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale).ticks(csvData.length);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup3.append("g")
        .call(leftAxis);

    chartGroup3.append("g")
        .attr("transform", `translate(0, ${chartHeight2})`)
        .call(bottomAxis)
        .selectAll("text")
        .attr("dx", "45")
        .attr("dy", "5")
        .attr("transform", "rotate(45)" )
        .style("bold");

    chartGroup3.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .classed("bar", true)
        .style("fill", "turquoise")
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight2 - yScale(d.pop1939))
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.pop1939))
        .on("mouseover", function(d) {      
          barToolTip.transition()        
               .duration(50)      
               .style("opacity", .9)      
            barToolTip.html(`<b>${d.name}</b> <br> `+ `Population: ${d.pop1939}`)	
            .style("left", d3.event.pageX - 600 + "px")
            .style("top", d3.event.pageY - 100 + "px");	
           })  
    
            // fade out tooltip on mouse out               
           .on("mouseout", function(d) {       
              barToolTip.transition()        
                .duration(500)      
                .style("opacity", 0); 
            });
    
    
  });
})
})      





















//scatter plot -------------------------->

// var width3  = 800;
// var height3 = 650;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 80,
//   left: 100
// };

// var width = width3 - margin.left - margin.right;
// var height = height3 - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// //and shift the latter by left and top margins.
// var scatter = d3
//   .select("#scattter")
//   .append("svg")
//   .attr("width", width3)
//   .attr("height", height3)

// // Append an SVG group
// var scatterGroup = scatter.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial Params
// var chosenXAxis = "gdp_1939"

// // function used for updating x-scale var upon click on axis label
// function xScale(csvData2, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(csvData2, d => d[chosenXAxis]) * 0.8,
//       d3.max(csvData2, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width])

//   return xLinearScale

// };

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale)

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis)

//   return xAxis
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]))

//   return circlesGroup
// };

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis == "gdp1939") {
//     var label = "GDP 1939:"
//   } else {
//     var label = "Life Expectancy 1939:"
//   }

//   var scatterToolTip = d3.select("#vis").append("div")
//   .attr("class", "tooltip"); 


// //   circlesGroup.call(scatterToolTip);

//   circlesGroup.on("mouseover", function(d) {      
//     scatterToolTip.transition()        
//          .duration(50)      
//        .style("opacity", .9)      
//     scatterToolTip.html(`<b>${d.name}</b> <br> `+ `Population: ${d.pop1939}`+ `<br/> GDP: ${d.gdp1939}`+ `<br/> Life Expectancy: ${d.lifeExp1939}`)	
//     .style("left", d3.event.pageX - 600 + "px")
//     .style("top", d3.event.pageY - 100 + "px");	
//    })  

//     // fade out tooltip on mouse out               
//    .on("mouseout", function(d) {       
//       scatterToolTip.transition()        
//         .duration(500)      
//         .style("opacity", 0); 
//     })

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function (d) {
//       return (`${d.name}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function (data) {
//       toolTip.show(data);
//     })
//     // onmouseout event
//     .on("mouseout", function (data, index) {
//       toolTip.hide(data);
    // });

//   return circlesGroup
// }

// // Retrieve data from the CSV file and execute everything below
// d3.csv("/static/combined4.csv", function (err, csvData2) {
//   if (err) throw err;

//   // parse data
//   csvData2.forEach(function (data) {
//     data.gdp1939 = +data.gdp1939;
//     data.pop1939 = +data.pop1939;
//     data.lifeExp1939 = +data.lifeExp1939;
//   });

//   // xLinearScale function above csv import
//   var xLinearScale = xScale(csvData2, chosenXAxis)

//   // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(csvData2, d => d.pop1939)])
//     .range([height, 0]);

//   // Create initial axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
//   var xAxis = scatterGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis)

//   // append y axis
//   scatterGroup.append("g")
//     .call(leftAxis)

//   // append initial circles
//   var circlesGroup = scatterGroup.selectAll("circle")
//     .data(csvData2)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenYear]))
//     .attr("cy", d => yLinearScale(d.pop1939))
//     .attr("r", 20)
//     .attr("fill", "tomato")
//     .attr("opacity", ".8")

//   // Create group for  2 x- axis labels
//   var labelsGroup = scatterGroup.append("g")
//     .attr("transform", `translate(${width/2}, ${height + 20})`)

//   var gdpLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "gdp1939") //value to grab for event listener
//     .classed("active", true)
//     .text("Projected GDP");

//   var lifeExpLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "lifeExp1939") //value to grab for event listener
//     .classed("inactive", true)
//     .text("Projected Life Expectancy");

//   // append y axis
//   scatterGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Population");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenYear, circlesGroup)

//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function () {
//       // get value of selection
//       var value = d3.select(this).attr("value")
//       if (value != chosenYear) {

//         // replaces chosenXAxis with value
//         chosenYear = value;

//         // console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(csvData2, chosenYear);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenYear);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenYear, circlesGroup);

//         // changes classes to change bold text
//         if (chosenYear == "lifeExp1939") {
//           lifeExpLabel
//             .classed("active", true)
//             .classed("inactive", false)
//           gdpLabel
//             .classed("active", false)
//             .classed("inactive", true)
//         } else {
//           lifeExpLabel
//             .classed("active", false)
//             .classed("inactive", true)
//           gdpLabel
//             .classed("active", true)
//             .classed("inactive", false)
//         };
//       };
//     });
// });

//     });

// })



