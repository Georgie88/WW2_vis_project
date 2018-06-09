// Getting references
var selDataset = document.getElementById("selDataset");
var sampleMetadata = document.getElementById("sampleMetadata");
var bubble = document.getElementById("bubble");
var gauge = document.getElementById("gauge");

// Creating drop down
d3.json("/bombarded_countries", function(error, response) {
    if (error) return console.log(error);

    console.log(response);

    var items = response;
    console.log(items);

    for (var i = 0; i < items.length; i++) {

        // Create option elemeent
        var option = document.createElement("option");
        option.setAttribute("value", items[i].name);
        option.innerHTML = items[i].name;

        // Append to select tag
        selDataset.appendChild(option);
    };
});

// Inital loading page
function init() {

    // Initial sample metadata
    d3.json("/metadata/GERMANY", function(error, response) {
        if (error) return console.log(error);

        console.log(response);

        var keys = Object.keys(response);
        console.log(keys);

        for (var i = 0; i < keys.length; i++) {
            var p = document.createElement("p");
            p.innerHTML = `${keys[i]}: ${response[keys[i]]}`;

            sampleMetadata.appendChild(p);
        };
    });

    // Inital pie & bubble plots
    d3.json("/samples/GERMANY", function(error, response) {
        if (error) console.log(error);
    
        // Data slices
        var idSlice = response.otu_ids.slice(0,10);
        var valueSlice = response.sample_values.slice(0,10);

        // Pie data
        var pieIds = [];
        var pieValues = [];
        for (var i = 0; i < valueSlice.length; i++) {
            if (valueSlice[i] != 0) {
                pieIds.push(idSlice[i]);
                pieValues.push(valueSlice[i]);
            };
        };
    
        // Bubble plot variables
        var bubbleIds = [];
        var bubbleValues = [];
        for (var i = 0; i < response.sample_values.length; i++) {
            if (response.sample_values[i] != 0) {
                bubbleIds.push(response.otu_ids[i]);
                bubbleValues.push(response.sample_values[i]);
            };
        };
    
        d3.json("/otu", function(error, response) {
            if (error) console.log(error);
    
            // Pie chart labels
            var pieLabels = [];
            for (var i = 0; i < pieIds.length; i++) {
                pieLabels.push(response[pieIds[i]]);
            };
    
            // Bubble plot labels
            var bubbleLabels = [];
            for (var i = 0; i < bubbleIds.length; i++) {
                bubbleLabels.push(response[bubbleIds[i]]);
            }
    
            // Plotting pie chart
            var pieData = [{
                values: pieValues,
                labels: pieIds,
                type: "pie",
                hovertext: pieLabels
            }];
            Plotly.newPlot("pie", pieData);
    
            // Plotting bubble plot
            var bubbleData = [{
                x: bubbleIds,
                y: bubbleValues,
                mode: "markers",
                text: bubbleLabels,
                marker: {
                    size: bubbleValues,
                    color: bubbleIds.map(row=>row),
                    colorscale: "Rainbow"
                }
            }];
            var bubbleLayout = {
                xaxis: {
                    title: "OTU ID"
                }
            };
            Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        });
    });

// Update pie & bubble plots
function updatePlots(newPie, newBubble) {
    
    // Restyle pie chart
    var pieUpdate = {
        values: [newPie.values],
        labels: [newPie.lables],
        hovertext: [newPie.hovertext]
    };
    Plotly.restyle("pie", pieUpdate);

    // Restyle bubble plot
    Plotly.restyle("bubble", "x", [newBubble.x]);
    Plotly.restyle("bubble", "y", [newBubble.y]);
    Plotly.restyle("bubble", "text", [newBubble.text]);
    Plotly.restyle("bubble", "marker.size", [newBubble.y]);
    Plotly.restyle("bubble", "marker.color", [newBubble.x.map(row=>row)]);
};

// Get new data
function optionChanged(dataset) {

    // Update metadata
    var dataURL = '/metadata/' + dataset;
    d3.json(dataURL, function(error, response) {
        if (error) return console.log(error);

        sampleMetadata.innerHTML = "";

        var keys = Object.keys(response);

        for (var i = 0; i < keys.length; i++) {
            var p = document.createElement("p");
            p.innerHTML = `${keys[i]}: ${response[keys[i]]}`;
            sampleMetadata.appendChild(p);
        };
    });

    // Update pie & bubble plots
    var plotURL = '/samples/' + dataset;
    d3.json(plotURL, function(error, response) {
        if (error) return console.log(error);

        // Empty object for new data
        var newPie = {};
        var newBubble = {};

        // Data slices
        var idSlice = response.otu_ids.slice(0,10);
        console.log(idSlice);
        var valueSlice = response.sample_values.slice(0,10);
        console.log(valueSlice);

        // Pie data
        var pieIds = [];
        var pieValues = [];
        for (var i = 0; i < valueSlice.length; i++) {
            if (valueSlice[i] != 0) {
                pieIds.push(idSlice[i]);
                pieValues.push(valueSlice[i]);
            };
        };
        newPie["values"] = pieValues;
        newPie["labels"] = pieIds;

        // Bubble data
        var bubbleIds = [];
        var bubbleValues = [];
        for (var i = 0; i < response.sample_values.length; i++) {
            if (response.sample_values[i] != 0) {
                bubbleIds.push(response.otu_ids[i]);
                bubbleValues.push(response.sample_values[i]);
            };
        };
        newBubble["x"] = bubbleIds;
        newBubble["y"] = bubbleValues;

        d3.json("/otu", function(error, response) {
            if (error) console.log(error);

            var pieLabels = [];
            for (var i = 0; i < pieIds.length; i++) {
                pieLabels.push(response[pieIds[i]]);
            };
            newPie["hovertext"] = pieLabels;

            var bubbleLables = [];
            for (var i = 0; i < bubbleIds.length; i++) {
                bubbleLables.push(response[bubbleIds[i]]);
            };
            newBubble["text"] = bubbleLables;

            // Update plots
            updatePlots(newPie, newBubble);
        });
    }); 

};

// Run initial function
init();