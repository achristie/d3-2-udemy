/**
 * @class       : second
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Friday Mar 19, 2021 20:32:03 EDT
 * @description : second
 */

const margin = { left: 50, right: 30, top: 30, bottom: 30 };
const height = 400 - margin.top - margin.bottom;
const width = 600 - margin.left - margin.right;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/sales.csv").then((data) => {
  console.log(data);

  const rect = g.selectAll("rect").data(data);

  const x = d3
    .scaleBand()
    .paddingInner(0.3)
    .domain(data.map((d) => d.Month))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Sales)])
    .range([height, 0]);

  rect
    .enter()
    .append("rect")
    .attr("fill", "green")
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.Sales))
    .attr("y", (d) => y(d.Sales))
    .attr("x", (d, i) => x(d.Month));

  xAxis = (label) => (g) =>
    g
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .text(label)
      .attr("fill", "#000")
      .attr("font-size", "16px")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", 50);

  yAxis = (label) => (g) =>
    g
      .call(d3.axisLeft(y))
      .append("text")
      .text(label)
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -50);

  g.append("g").call(yAxis("Sales"));
  g.append("g").call(xAxis("Month"));
});

