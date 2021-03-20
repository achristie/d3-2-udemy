/**
 * @class       : scatter
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Saturday Mar 20, 2021 17:32:51 EDT
 * @description : scatter
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

const x = d3.scaleLog().base(10).domain([1e2, 15e4]).range([0, width]);
const y = d3.scaleLinear().domain([0, 90]).range([height, 0]);
const r = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([0, 14e9]);
const c = d3.scaleOrdinal(d3.schemeCategory10);

const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
const xAxis = (label) => (g) => g.call(d3.axisBottom(x).ticks(3, "~s"));

const yAxisGroup = g.append("g");
const yAxis = (label) => (g) => g.call(d3.axisLeft(y));

const timeLabel = g
  .append("text")
  .attr("y", height - 10)
  .attr("x", width - 40)
  .attr("font-size", "40px")
  .attr("text-anchor", "middle")
  .text("1800");

d3.json("data/data.json").then((data) => {
  c.domain(data[0].countries.map((d) => d.continent));
  let i = 0;
  let int = d3.interval(() => {
    update(data[++i]);
    i = i == 214 ? 0 : i;
  }, 1000);

  update(data[i]);
});

function update(data) {
  timeLabel.text(data.year);
  data.countries = data.countries.filter((d) => d.income ?? false);
  data.countries = data.countries.filter((d) => d.life_exp ?? false);
  const circle = g.selectAll("circle").data(data.countries, (d) => d.country);
  const t = d3.transition().duration(300);

  circle.exit().attr("fill", "red").transition(t).remove();
  circle
    .enter()
    .append("circle")
    .attr("fill", (d) => c(d.continent))
    .merge(circle)
    .transition(t)
    .attr("r", (d) => Math.sqrt(r(d?.population ?? 1) / Math.PI))
    .attr("cx", (d) => x(d?.income ?? 100))
    .attr("cy", (d) => y(d.life_exp ?? 0));

  xAxisGroup.call(xAxis("GDP Per Capita"));
  yAxisGroup.call(yAxis("Life Expectancy"));
}

