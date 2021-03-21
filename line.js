/**
 * @class       : line
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Saturday Mar 20, 2021 21:57:36 EDT
 * @description : line
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

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const parseTime = d3.timeParse("%d/%m/%Y");
const bisectDate = d3.bisector((d) => d.year).left;

const xAxis = (label) => (g) => g.call(d3.axisBottom(x));
const yAxis = (label) => (g) => g.call(d3.axisLeft(y));

const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
const yAxisGroup = g.append("g");

d3.json("data/coins.json").then((data) => {
  data = data["bitcoin"];

  data.forEach((row) => {
    (row.date = parseTime(row.date)),
      (row["24h_vol"] = +row["24h_vol"]),
      (row.market_cap = +row.market_cap),
      (row.price_usd = +row.price_usd);
  });
  x.domain(d3.extent(data, (d) => d.date));
  y.domain([
    d3.min(data, (d) => d.price_usd) * 0.95,
    d3.max(data, (d) => d.price_usd) * 1.05,
  ]);
  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.price_usd));

  g.append("path")
    .attr("stroke", "grey")
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("d", line(data));

  xAxisGroup.call(xAxis("Date"));
  yAxisGroup.call(yAxis("Price"));
});

