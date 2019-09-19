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

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgHeight - margin.left - margin.right;

   // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("data.csv", function(err, stateData) {

   // create scales
    var xTimeScale = d3.scaleTime()
      .domain(d3.extent(stateData, d => d.obesity))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.smokes)])
      .range([height, 0]); 

    // create axes
      var xAxis = d3.axisBottom(xTimeScale);
      var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.obesity))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "10")
      .attr("fill", "light blue")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    // Step 1: Append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d, i) {
        toolTip.style("display", "block");
        toolTip.html(`<strong>${dateFormatter(d.obesity)}<strong><hr>${d.smokes}medal(s) won`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })

    // Step 3: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function() {
        toolTip.style("display", "none");
      });
  
    });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);