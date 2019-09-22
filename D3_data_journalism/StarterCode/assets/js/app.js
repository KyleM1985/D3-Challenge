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
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append group element
  var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
  d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

  // Read CSV
  d3.csv("data.csv", function(err, healthData) {
    if (err) throw err;

    //console.log(healthData);

    healthData.forEach(function(d) {
      data.age = +d.age;
      data.smokes = +d.smokes;
    });
   // create scales
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    // create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;
    
    xMin = d3.min(healthData, function(data) {
        return data.age;
    });
    
    xMax = d3.max(healthData, function(data) {
        return data.age;
    });
    
    yMin = d3.min(healthData, function(data) {
        return data.smokes;
    });
    
    yMax = d3.max(healthData, function(data) {
        return data.smokes;
    });
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

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
      .attr("cx", d => xLinearScale(d.age +1.5))
      .attr("cy", d => yLinearScale(d.smokes +0.3))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5")
      
      .on("mouseout", function(data, indext) {
        toolTip.hide(data);
      });

    //Create text labels with state abbreviations for each circle
    circlesGroup.append("text")
      .classed("stateText", true)
      .attr("x", d => xLinearScale(d.age))
      .attr("y", d => yLinearScale(d.smokes))
      .attr("stroke", "black")
      .attr("font-size", "10px")
      .text(d => d.abbr)

    // Initialize tooltip div
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (abbr + '%');
      });

    //Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data);
      })

    // Step 3: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    // Create axes labels
    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
      .attr("x", function(data) {
        return xLinearScale(data.age +1.3);
      })
      .attr("y", function(data) {
        return yLinearScale(data.smokes +1);
      })
      .text(function(data) {
        return data.abbr
      });

      chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height +margin.top +30})`)
        .attr("class", "axisText")
        .text("Obese Smokers (%");
    });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);