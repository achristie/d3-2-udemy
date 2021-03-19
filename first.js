/**
 * @class       : first
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Friday Mar 19, 2021 19:15:35 EDT
 * @description : first
 */

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.csv("data/age.csv").then((data) => {
  const rect = svg.selectAll("rect").data(data);

  rect
    .enter()
    .append("rect")
    .attr("fill", "gray")
    .attr("width", 18)
    .attr("height", (d) => d.age * 15)
    .attr("x", (d, i) => i * 20);
});

