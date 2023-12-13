var rowConverter = function (d) {
  return {
    Month: parseInt(d.Month),
    Subject: d["Subject"],
    AverageScore: parseFloat(d.AverageScore),
  };
};
d3.csv("Data_Design2.csv", rowConverter, function (error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
    // Set the margins
    var margin = { top: 60, right: 500, bottom: 60, left: 80 },
      width = 1200 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
    // Create the svg canvas
    var svg = d3
      .select("#design02")
      .append("svg")
      .style("width", width + margin.left + margin.right + "px")
      .style("height", height + margin.top + margin.bottom + "px")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "svg");

    //NEST : group data by country
    var nest = d3
      .nest()
      .key(function (d) {
        return d.Subject;
      })
      .entries(data);
    console.log(nest);

    // Set the ranges
    var x = d3.scaleLinear().domain([0, 12]).range([0, width]);

    var y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
    // color
    var res = nest.map(function (d) {
      return d.key;
    });
    console.log(nest);

    var color = d3
      .scaleOrdinal()
      .domain(res)
      .range(["blue", "green", "orange", "red", "purple", "pink", "gold", "black","cyan"]);

    //  Add the X Axis
    var xaxis = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(
        d3
          .axisBottom(x)
          .ticks(12)
          .tickSize(0, 0)
          .tickSizeInner(0)
          .tickPadding(10)
      );

    // Add the Y Axis
    var yaxis = svg
      .append("g")
      .attr("class", "y axis")
      .call(
        d3.axisLeft(y).ticks(10).tickSizeInner(0).tickPadding(10).tickSize(0, 0)
      );

    // Add a label to the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 80)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Score")
      .attr("class", "y axis label")
      .style("fill", "darkgreen");

    // Add a label to the x axis
    svg
      .append("text")
      .attr("y", height + 40)
      .attr("x", width / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Birth Month")
      .attr("class", "x axis label")
      .style("fill", "darkgreen");

    // Add line into SVG
    var line = d3
      .line()
      .x((d) => x(d.Month))
      .y((d) => y(d.AverageScore));

    let glines = svg.append("g");

    glines
      .selectAll(".line-group")
      .data(nest)
      .enter()
      .append("g")
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .attr("class", function (d) {
        return "line " + d.key;
      })
      .attr("d", (d) => line(d.values))
      .style("stroke-width", "2");

    // Add the CIRCLE on the lines
    svg
      .selectAll("myDots")
      .data(nest)
      .enter()
      .append("g")
      .style("fill", "white")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .style("stroke-width", "0.5")
      .selectAll("myPoints")
      .data(function (d) {
        return d.values;
      })
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.Month);
      })
      .attr("cy", function (d) {
        return y(d.AverageScore);
      })
      .attr("r", 2)
      .attr("class", function (d) {
        return "circle " + d.key;
      });
    //.style("opacity", 0.5)

    // LEGEND

    //Hightlight the country which is hovered
    var highlight = function (d) {
      d3.selectAll(".line").transition().duration(300).style("opacity", 0.05);

      d3.select("." + d.key)

        .transition()
        .duration(300)
        .style("opacity", "1")
        .style("stroke-width", "4");
    };

    // when it is not hovered anymore
    var noHighlight = function (d) {
      d3.selectAll(".line")
        .transition()
        .duration("100")
        .style("opacity", "1")
        .style("stroke-width", "2");
    };

    // Add one dot in the legend for each name.
    var size = 20;
    svg
      .selectAll("myRect")
      .data(nest)
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", function (d, i) {
        return i * (size + 5);
      })
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) {
        return color(d.key);
      })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    // Add one dot in the legend for each name.
    svg
      .selectAll("mylabels")
      .data(nest)
      .enter()
      .append("text")
      .attr("x", 100 + size * 1.2)
      .attr("y", function (d, i) {
        return i * (size + 5) + size / 2;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .text(function (d) {
        return d.key;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    // this the black vertical line to folow mouse
    var mouseG = svg.append("g").attr("class", "mouse-over-effects");

    mouseG
      .append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-dasharray", "3, 3")
      .style("stroke-width", "1.5px")
      .style("opacity", "0");

    var mousePerLine = mouseG
      .selectAll(".mouse-per-line")
      .data(nest)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine
      .append("circle")
      .attr("r", 7)
      .style("stroke", function (d) {
        return color(d.key);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text").attr("transform", "translate(10,-5)");

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "#D3D3D3")
      .style("padding", 5 + "px")
      .style("display", "none");

    mouseG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", function () {
        d3.select(".mouse-line").style("opacity", "0");
        d3.selectAll(".mouse-per-line circle").style("opacity", "0");
        d3.selectAll(".mouse-per-line text").style("opacity", "0");
        d3.selectAll("#tooltip").style("display", "none");
      })
      .on("mouseover", function () {
        d3.select(".mouse-line").style("opacity", "1");
        d3.selectAll(".mouse-per-line circle").style("opacity", "1");
        d3.selectAll(".mouse-per-line text").style("opacity", "1");
        d3.selectAll("#tooltip").style("display", "block");
      })
      .on("mousemove", function () {
        var mouse = d3.mouse(this);

        if (mouse[0] >= width) {
          mouseG.select("rect").attr("width", width + 30);
          return;
        }

        d3.selectAll(".mouse-per-line").attr("transform", function (d) {
          var xDate = x.invert(mouse[0] - 20);
          var bisect = d3.bisector(function (d) {
            return d.Month;
          }).right;
          var idx = bisect(d.values, xDate);

          let xCoordinate = x(d.values[idx].Month).toString();
          let yCoordinate = y(d.values[idx].AverageScore).toString();

          d3.select(".mouse-line").attr("d", function () {
            var data = "M" + xCoordinate + "," + height;
            data += " " + xCoordinate + "," + 0;
            return data;
          });

          d3.select(this)
            .select("text")
            .text(d.values[idx].AverageScore.toFixed(2))
            .attr("fill", function (d) {
              return color(d.key);
            });

          return "translate(" + xCoordinate + "," + yCoordinate + ")";
        });

        updateTooltipContent(mouse, nest);
      });

    function updateTooltipContent(mouse, nest) {
      var sortingObj = [];

      nest.map((d) => {
        var xDate = x.invert(mouse[0]);
        var bisect = d3.bisector(function (d) {
          return d.Month;
        }).left;
        var idx = bisect(d.values, xDate);

        sortingObj.push({
          Subject: d.values[idx].Subject,
          Month: d.values[idx].Month,
          AverageScore: d.values[idx].AverageScore,
        });
      });

      if (sortingObj[0] == null) return;

      sortingObj.sort((x, y) => y.Month - x.Month);

      tooltip
        .html((d) => {
          var string = sortingObj[0].AverageScore.toString();
          var i = string.indexOf("00:00:00");
          return string.substring(0, i);
        })
        .style("left", d3.event.pageX + 50 + "px")
        .style("top", d3.event.pageY - 50 + "px")
        .style("display", "block")
        .style("font-size", 12)
        .selectAll()
        .data(sortingObj)
        .enter()
        .append("div")
        .style("color", (d) => {
          return color(d.Subject);
        })
        .style("font-size", 10)
        .html((d) => {
          return d.Subject + " : " + /*d.Month + " : "*/ + d.AverageScore;
        });
    }
  }
});
