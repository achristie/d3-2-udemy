/**
 * @class       : column
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Thursday Mar 25, 2021 20:40:45 EDT
 * @description : column
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
  const rect = g.selectAll("rect").data(data);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.age)])
    .range([0, width]);
  const y = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(data.map((d) => d.name))
    .range([0, height]);

  const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
  const yAxisGroup = g.append("g");
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  const t = d3.transition(250);

  rect
    .enter()
    .append("rect")
    .attr("height", (d) => y.bandwidth())
    .attr("x", (d) => 0)
    .attr("y", (d) => y(d.name))
    .attr("fill", "orange")
    .transition(t)
    .delay((d, i) => i * 50)
    .attr("width", (d) => x(d.age));
});

