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
  console.log(data);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.Month))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.Sales))
    .range([height, 0]);

  const line = d3
    .line()
    .x((d) => x(d.Month))
    .y((d) => y(d.Sales));

  const line2 = d3
    .line()
    .x((d) => x(d.Month))
    .y((d) => y(d.Profit));

  g.append("path").datum(data).attr("class", "line").attr("d", line);
  g.append("path").datum(data).attr("class", "line").attr("d", line2);

  const circle = g.selectAll("circle").data(data);

  circle
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.Month))
    .attr("cy", (d) => y(d.Sales))
    .attr("r", 5);
});

