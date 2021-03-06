/**
 * @class       : line3
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Thursday Apr 01, 2021 19:27:44 EDT
 * @description : line3
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
  lineData = data.flatMap((d) => [
    { metric: "Sales", value: +d.Sales, month: d.Month },
    { metric: "Profit", value: +d.Profit, month: d.Month },
  ]);
  const groups = d3.groups(lineData, (d) => d.metric);

  const x = d3
    .scaleBand()
    .domain(lineData.map((d) => d.month))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(lineData, (d) => d.value))
    .range([height, 0]);
  const c = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(lineData.map((d) => d.metric));

  const line = d3
    .line()
    .x((d) => x(d.month) + x.bandwidth() / 2)
    .y((d) => y(d.value));

  const path = g.selectAll("path").data(groups);

  path
    .join("path")
    .attr("class", "line")
    .attr("stroke", (d) => c(d[0]))
    .attr("d", (d) => line(d[1]));

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
  const yAxisGroup = g.append("g");

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  const dot = g.selectAll("circle").data(lineData);

  dot
    .join("circle")
    .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.value))
    .attr("fill", (d) => c(d.metric))
    .attr("r", 4);
});

