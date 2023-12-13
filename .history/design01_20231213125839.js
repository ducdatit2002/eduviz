var opt = "";

function filterDataBySubject(subject, mappedData) {
  return mappedData.filter(function(d) {
      return d.Subject === subject;
  });
}

function updateChart(subject) {
    opt = subject;
    d3.csv("Data_Des1.csv", function(data) {
        var mappedData = data.map(function(d){
            return {
                Subject: d["Subject"],
                Score: parseFloat(d.Score),
                ExamineeNumber: parseInt(d.ExamineeNumber)
            };
        });
        var filterData = filterDataBySubject(opt, mappedData);
        renderChart(filterData); // Call renderChart function to update the chart
    });
}

// Function to render the chart
function renderChart(filterData) {
    d3.select("#design1").selectAll("*").remove(); 

    var margin = { top: 60, right: 10, bottom: 20, left: 50 },
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#design1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(filterData, function(d) { return d.ExamineeNumber; })])
        .range([height, 0])
        .nice();

    var barWidth = width / filterData.length;

    var bars = svg.selectAll(".bar")
        .data(filterData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", function(d) {
            if ([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0].includes(d.Score)) {
                return "#6EC3C9"; // Change color for specified x values
            } else {
                return "#d0d0d0"; // Default color
            }
        })  
        .attr("x", function(d) { return xScale(d.Score); })
        .attr("y", function(d) { return yScale(d.ExamineeNumber); })
        .attr("width", barWidth)
        .attr("height", function(d) { return height - yScale(d.ExamineeNumber); });

    // Add a title to the chart
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-family", "Roboto Slab")
        .attr("font-weight", "bold")
        .style("font-size", "25px")
        .style("fill", "#009298")
        .text("SCORE SPECTRUM: " + opt.toUpperCase());

    var labels = svg.selectAll(".label")
        .data(filterData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("transform", function(d) {
            return "translate(" + (xScale(d.Score) + barWidth / 2) + "," + (yScale(d.ExamineeNumber) - 15) + ") rotate(-90)";})
        .attr("dy", "0.35em")
        .attr("font-family", "Roboto Slab")
        .style("font-size", "8px")
        .style("text-anchor", "middle")
        .text(function(d) {
            if (opt === "Literature") {
                svg.selectAll(".label")
                    .filter(function(d) { return d.ExamineeNumber > 20; })
                    .text(function(d) {
                        if (d.ExamineeNumber !== 0) {
                            return d.ExamineeNumber.toLocaleString();
                        }
                        return "";
                    });
            }
            else {
                if (d.ExamineeNumber !== 0) {
                    return d.ExamineeNumber.toLocaleString();
                }
                return "";
            }
        });
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(40));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    var tooltip = d3.select("#tooltip_des1"); // Select the tooltip div

    // Add X-axis position line
    var xAxisLine = svg.append("line")
        .attr("class", "x-axis-line")
        .style("stroke", "#777777") // Color of the X-axis line
        .style("stroke-width", 1)
        .style("stroke-dasharray", "4"); // Optional dashed line style

    // Add Y-axis position line
    var yAxisLine = svg.append("line")
        .attr("class", "y-axis-line")
        .style("stroke", "#777777") // Color of the Y-axis line
        .style("stroke-width", 1)
        .style("stroke-dasharray", "4"); // Optional dashed line style

    bars.on("mouseover", function(d) {
    // Show the existing tooltip with Score and ExamineeNumber values
    tooltip.style("display", "block")
        .style("width", "200px")
        .html("Score: " + d.Score + "<br>Number of Examinees: " + d.ExamineeNumber);

    // Get mouse position relative to the current bar
    var mousePos = d3.mouse(this);
    var xPos = mousePos[0];
    var yPos = mousePos[1];

    // Update the X-axis position line
    xAxisLine.transition()
        .duration(100)
        .attr("x1", xPos)
        .attr("y1", 0)
        .attr("x2", xPos)
        .attr("y2", height);

    // Update the Y-axis position line
    yAxisLine.transition()
        .duration(100)
        .attr("x1", 0)
        .attr("y1", yPos)
        .attr("x2", width)
        .attr("y2", yPos);

    // Calculate the tooltip's position relative to the mouse cursor
    var tooltipXPos = d3.event.pageX + 10;
    var tooltipYPos = d3.event.pageY - 10;

    // Set the tooltip's position
    tooltip.style("left", tooltipXPos + "px")
        .style("top", tooltipYPos + "px");
    })
} 
updateChart('Math'); // Default subject to display initially
// Add this code to your test.js file

// Array of subjects for the buttons
var subjects = [
    "Math",
    "Literature",
    "Foreign Language",
    "History",
    "Civic",
    "Geography",
    "Biography",
    "Physics",
    "Chemistry"
    
];

// Function to create buttons and attach event handlers
function createButtons() {
    var buttonContainer = document.getElementById("button-container-des1");
    
    subjects.forEach(function(subject) {
        var button = document.createElement("button1");
        button.textContent = subject;
        button.onclick = function() {
            updateChart(subject);
        };
        buttonContainer.appendChild(button1);
    });
}

// Call the function to create buttons when the page loads
window.onload = createButtons;
