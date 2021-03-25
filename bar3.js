/**
 * @class       : bar3
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Wednesday Mar 24, 2021 22:06:06 EDT
 * @description : bar3
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
  const t = d3.transition(250);

  const x = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(data.map((d) => d.name))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.age)])
    .range([height, 0]);

  rect
    .enter()
    .append("rect")
    .attr("width", 0)
    .attr("height", (d) => height - y(d.age))
    .attr("fill", "blue")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.age))
    .transition(t)
    .delay((d, i) => i * 700)
    .attr("width", x.bandwidth());

  const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
  const yAxisGroup = g.append("g");

  xAxisGroup.call(d3.axisBottom(x));
  yAxisGroup.call(d3.axisLeft(y));
});

