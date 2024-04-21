// set the dimensions and margins of the graph
var margin = { top: 120, right: 400, bottom: 20, left: 50 },
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// var svg = d3.select("#stackbar")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

var svg = d3.select("#stackbar")
  .append("svg")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
var barWidth = 80;
var x0 = d3.scaleBand().range([0, width]);

var x1 = d3.scaleBand();

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x0);

var yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));

var color = d3.scaleOrdinal().range(["#7b6888", "#8a89a6", "#98abc5"]);
// Parse the Data
d3.csv("../data/StackBar.csv", function(data) {
  var yBegin;
  
  var innerColumns = {
    column1: ["Biography", "Physics", "Chemistry"],
    column2: ["History", "Geography", "Civic"]
  };
  var columnHeaders = d3.keys(data[0]).filter(function(key) {
    return key !== "Quarter";
  });
  color.domain(
    d3.keys(data[0]).filter(function(key) {
      return key !== "Quarter";
    })
  );
  var groupData = data.forEach(function(d) {
    var yColumn = new Array();
    d.columnDetails = columnHeaders.map(function(name) {
      for (ic in innerColumns) {
        if (innerColumns[ic].indexOf(name) >= 0) {
          if (!yColumn[ic]) {
            yColumn[ic] = 0;
          }
          yBegin = yColumn[ic];
          yColumn[ic] += +d[name];
          return {
            name: name,
            column: ic,
            yBegin: yBegin,
            yEnd: +d[name] + yBegin
          };
        }
      }
    });
    d.total = d3.max(d.columnDetails, function(d) {
      return d.yEnd;
    });
  });
  x0.domain(
    data.map(function(d) {
      return d.Quarter;
    })
  )
  .padding(0.25);
  x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]).paddingInner(0);
  
  y.domain([
    0,
    1.15 *
      d3.max(data, function(d) {
        return d.total;
      })
  ]);
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  
  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);
  
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
    .text("Number of Students with Above-Average Scores by Birth Month Period");

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  var stackedbar = svg
    .selectAll(".stackedbar")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
      return "translate(" + x0(d.Quarter) + ",0)";
    });
  stackedbar
    .selectAll("rect")
    .data(function(d) {
      return d.columnDetails;
    })
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("x", function(d) {
      return x1(d.column) + (x1.bandwidth() - barWidth) / 2;
    })
    .attr("y", function(d) {
      return y(d.yEnd);
    })
    .attr("height", function(d) {
      return y(d.yBegin) - y(d.yEnd);
    })
    .style("fill", function(d) {
      if (d.column === "column2") {
        // Change the color for column 2
        if (d.name === "History") {
          return "#347E84";
        } else if (d.name === "Geography") {
          return "#4B9A9F";
        } else if (d.name === "Civic") {
          return "#7cc9cf";
        }
      }
      return color(d.name);
    })
    .on("mouseover", function(d) {
      var subjectValue = d.yEnd - d.yBegin;
      // Show tooltip on mouseover
      tooltip
      .style("display", "block")
      .style("opacity", 0.9)
      .html(d.name + ": " + subjectValue)
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY - 10 + "px")
      .style("position", "absolute")
      .transition()
      .duration(500)
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px");
    })
    .on("mouseout", function(d) {
      // Hide tooltip on mouseout
      tooltip
        .style("display", "none");
    });

// Extract unique categories for legend
var legendData = [
  { name: "Chemistry", column: "column1", color: color("Chemistry") },
  { name: "Physics", column: "column1", color: color("Physics") },
  { name: "Biography", column: "column1", color: color("Biography") },
  { name: "Civic", column: "column2", color: "#7cc9cf" },
  { name: "Geography", column: "column2", color: "#4B9A9F" },
  { name: "History", column: "column2", color: "#347E84" }

];

var legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', 'translate(' + (width - 20) + ',' + (height - 150) + ')');

var legendGroup1 = legend.append('g')
  .attr('class', 'legend-group')
  .attr('transform', 'translate(0, 0)');

var legendGroup2 = legend.append('g')
  .attr('class', 'legend-group')
  .attr('transform', 'translate(100, 0)');

legendGroup1.selectAll('rect')
  .data(legendData.filter(d => d.column === "column1"))
  .enter()
  .append('rect')
  .attr('x', 0)
  .attr('y', function(d, i) { return i * 20; })
  .attr('width', 12)
  .attr('height', 12)
  .attr('fill', function(d) {
    return d.color;
  });

legendGroup1.selectAll('text')
  .data(legendData.filter(d => d.column === "column1"))
  .enter()
  .append('text')
  .text(function (d) {
    return d.name;
  })
  .attr('x', 15)
  .attr('y', function(d, i) { return i * 20; })
  .attr('text-anchor', 'start')
  .attr('alignment-baseline', 'hanging');

legendGroup2.selectAll('rect')
  .data(legendData.filter(d => d.column === "column2"))
  .enter()
  .append('rect')
  .attr('x', 0)
  .attr('y', function(d, i) { return i * 20; })
  .attr('width', 12)
  .attr('height', 12)
  .attr('fill', function(d) {
    return d.color;
  });

legendGroup2.selectAll('text')
  .data(legendData.filter(d => d.column === "column2"))
  .enter()
  .append('text')
  .text(function (d) {
    return d.name;
  })
  .attr('x', 15)
  .attr('y', function(d, i) { return i * 20; })
  .attr('text-anchor', 'start')
  .attr('alignment-baseline', 'hanging');

})