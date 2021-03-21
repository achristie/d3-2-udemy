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
const continents = ["europe", "asia", "americas", "africa"];
const c = d3.scaleOrdinal(d3.schemeCategory10).domain(continents);

// const tip = d3
//   .tip()
//   .attr("class", "d3-tip")
//   .html((d) => {
//     let text = `<strong> Country: </strong> <span style='color: red'>${d.country}</span>`;
//     return text;
//   });

// g.call(tip);

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

const legend = g
  .append("g")
  .attr("transform", `translate(${width - 10}, ${height - 125})`);

continents.forEach((cont, i) => {
  const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`);

  legendRow
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", c(cont));

  legendRow
    .append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .style("text-transform", "capitalize")
    .text(cont);
});

d3.json("data/data.json").then((data) => {
  let i = 0;
  let int = d3.interval(() => {
    update(data[++i]);
    i = i == 214 ? 0 : i;
  }, 200);

  update(data[i]);
});

function update(data) {
  timeLabel.text(data.year);
  data.countries = data.countries.filter((d) => d.income ?? false);
  data.countries = data.countries.filter((d) => d.life_exp ?? false);
  const circle = g.selectAll("circle").data(data.countries, (d) => d.country);
  const t = d3.transition().duration(300);

  circle.exit().remove();

  circle
    .enter()
    .append("circle")
    .attr("fill", (d) => c(d.continent))
    // .on("mouseover", tip.show)
    // .on("mouseout", tip.hide)
    .merge(circle)
    .transition(t)
    .attr("r", (d) => Math.sqrt(r(d?.population ?? 1) / Math.PI))
    .attr("cx", (d) => x(d?.income ?? 100))
    .attr("cy", (d) => y(d.life_exp ?? 0));

  xAxisGroup.call(xAxis("GDP Per Capita"));
  yAxisGroup.call(yAxis("Life Expectancy"));
}

