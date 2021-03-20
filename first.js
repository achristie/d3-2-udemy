/**
 * @class       : first
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Friday Mar 19, 2021 19:15:35 EDT
 * @description : first
 */

const margin = { left: 30, right: 10, top: 10, bottom: 30 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/age.csv").then((data) => {
  const rect = g.selectAll("rect").data(data);

  const y = d3
    .scaleLinear()
    .domain([0, 15 * d3.max(data, (d) => +d.age)])
    .range([height, 0]);
  const x = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(data.map((d) => d.name))
    .range([0, width]);

  const xAxis = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);
  g.append("g").attr("class", "y-axis").call(yAxis);

  rect
    .enter()
    .append("rect")
    .attr("fill", "gray")
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.age * 15))
    .attr("y", (d) => y(d.age * 15))
    .attr("x", (d, i) => x(d.name));
});

