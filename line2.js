/**
 * @class       : line2
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Sunday Mar 28, 2021 17:42:19 EDT
 * @description : line2
 */

const margin = { left: 50, right: 30, top: 30, bottom: 30 };
const height = 400 - margin.top - margin.bottom;
const width = 700 - margin.left - margin.right;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./data/sales.csv").then((data) => {
  data = data.flatMap((d) => [
    { metric: "Sales", value: +d.Sales, month: d.Month },
    { metric: "Profit", value: +d.Profit, month: d.Month },
  ]);

  const groups = d3.groups(data, (d) => d.metric);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value))
    .range([height, 0]);

  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(data.map((d) => d.metric));

  const line = d3
    .line()
    .x((d) => x(d.month))
    .y((d) => y(d.value));

  const path = g.selectAll("path").data(groups);
  const t = d3.transition(2500);

  path
    .join("path")
    .attr("class", "line")
    .attr("stroke", (d) => console.log(d))
    .attr("stroke", (d) => color(d[0]))
    .transition(t)
    .attr("d", (d) => line(d[1]));

  const circle = g.selectAll("circle").data(data);

  circle
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("fill", (d) => color(d.metric))
    .attr("cx", (d) => x(d.month))
    .attr("cy", (d) => y(d.value))
    .attr("r", 5);
});

