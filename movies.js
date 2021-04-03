/**
 * @class       : movies
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Friday Apr 02, 2021 19:44:43 EDT
 * @description : movies
 */

const margin = { left: 250, right: 30, top: 30, bottom: 30 };
const height = 2300 - margin.top - margin.bottom;
const width = 800 - margin.left - margin.right;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("./data/ratings.json").then((data) => {
  data = data
    .map((d) => ({
      ...d,
      audience: +d.audience,
      critic: +d.critic,
    }))
    .sort((a, b) => console.log(a, b))
    .filter((d) => d.critic && d.audience);
  console.log(data);

  const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const y = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(data.map((d) => d.title))
    .range([height, 0]);

  const rect = g.selectAll("rect").data(data);

  rect
    .join("rect")
    .attr("fill", "black")
    .attr("x", (d) => x(Math.min(d.audience, d.critic)))
    .attr("y", (d) => y(d.title) + y.bandwidth() / 2)
    .attr("height", 1)
    .attr("width", (d) => Math.abs(x(d.critic) - x(d.audience)));

  const ccircle = g.selectAll("critic.circle").data(data);

  ccircle
    .join("circle")
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("cx", (d) => x(d.critic))
    .attr("cy", (d) => y(d.title) + y.bandwidth() / 2);

  const acircle = g.selectAll("aud.circle").data(data);

  acircle
    .join("circle")
    .attr("r", 5)
    .attr("fill", "red")
    .attr("cx", (d) => x(d.audience))
    .attr("cy", (d) => y(d.title) + y.bandwidth() / 2);

  const yAxis = d3.axisLeft(y).tickSizeOuter(0).tickSize(0);
  const xAxis = d3.axisTop(x);
  const yAxisGroup = g.append("g");
  const xAxisGroup = g.append("g");

  yAxisGroup.call(yAxis);
  xAxisGroup.call(xAxis);
});

