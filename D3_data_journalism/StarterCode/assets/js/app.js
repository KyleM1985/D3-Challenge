// @TODO: YOUR CODE HERE!
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
   left: 50
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
   // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
  //d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

  // Read CSV
  d3.csv("data.csv").then(function(healthData) {

    //console.log(healthData);

    healthData.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });
   // create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty)-0.5, d3.max(healthData, d => d.poverty)+0.5, 30])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)+1.1])
      .range([height, 0]);

    // create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "green")
      .attr("opacity", ".5");

    // circlesGroup.on("mouseover", function() {
    //   d3.select(this)
    //     .transition()
    //     .duration(1000)
    //     .attr("r", 20)
    //     .attr("fill", "red");
    // })
    //   .on("mouseout", function() {
    //     d3.select(this)
    //       .transition()
    //       .duration(1000)
    //       .attr("r", 10)
    //       .attr("fill", "green");
    // })
  //Create text labels with state abbreviations for each circle
      circlesGroup.append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("stroke", "black")
        .attr("font-size", "10px")
        .text(d => d.abbr);

        // Initialize tooltip div
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });

        //Create tooltip in the chart
        chartGroup.call(toolTip);

        // Create event listeners to display tooltip
        circlesGroup.on("click", function(data) {
          toolTip.show(data, this);
        })
      // Step 3: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
        // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
      });
    };
  
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);