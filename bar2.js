/**
 * @class       : bar2
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Tuesday Mar 23, 2021 19:35:27 EDT
 * @description : bar2
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

d3.csv("./data/age.csv").then((data) => {
  const x = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(data.map((d) => d.name))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.age)])
    .range([height, 0]);

  const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
  const yAxisGroup = g.append("g");

  const xAxis = (label) => (g) => g.call(d3.axisBottom(x));
  const yAxis = (label) => (g) => g.call(d3.axisLeft(y));

  xAxisGroup.call(xAxis("Name"));
  yAxisGroup.call(yAxis("Age"));

  const rect = g.selectAll("rect").data(data);

  rect
    .enter()
    .append("rect")
    .attr("fill", "red")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.age))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.age));
});

