/**
 * @class       : wiki
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Saturday Apr 03, 2021 19:09:14 EDT
 * @description : wiki
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

d3.json("./data/data.json").then((data) => {
  const fmt = d3.timeFormat("%Y %m");
  data.forEach((d) => (d.timestamp = fmt(new Date(d.timestamp))));
  const rollup = d3.rollups(
    data,
    (v) => v.length,
    (d) => d.timestamp
  );

  const group = d3.groups(data, (d) => d.timestamp.split(" ")[0]);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.timestamp))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(rollup, (d) => d[1])])
    .range([height, 0]);

  const year_scale = d3
    .scaleBand()
    .domain(group.map((d) => d[0]))
    .range([0, width]);

  const years = g.selectAll(".years").data(group);

  years
    .join("g")
    .attr("class", "year")
    .attr("transform", (d) => `translate(${year_scale(d[0])} 40)`);

  const rect = g.selectAll("rect").data(rollup);

  years
    .selectAll("rect")
    .data(rollup)
    .join("rect")
    .attr("fill", (d) => console.log(d));

  rect
    .join("rect")
    .attr("x", (d) => x(d[0]))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => height - y(d[1]))
    .attr("fill", "green")
    .attr("");
});

