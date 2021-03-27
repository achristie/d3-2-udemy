/**
 * @class       : column2
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Friday Mar 26, 2021 20:34:59 EDT
 * @description : column2
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

// function groupBy(array, key) {
//   return array.reduce((result, cv) => {
//     (result[cv[key]] = result[cv[key]] || []).push(cv);
//     return result;
//   }, {});
// }

d3.json("data/data.json").then((data) => {
  // const groupedData = groupBy(data[200].countries, "continent");
  const groupedData = Array.from(
    d3.rollup(
      data[200].countries,
      (v) => d3.sum(v, (d) => d.population),
      (d) => d.continent
    )
  ).map((arr) => ({ key: arr[0], value: arr[1] }));
  console.log(groupedData);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(groupedData, (d) => +d.value)])
    .range([0, width]);

  const y = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(groupedData.map((d) => d.key))
    .range([0, height]);

  const rect = g.selectAll("rect").data(groupedData);

  rect
    .enter()
    .append("rect")
    .attr("fill", "cyan")
    .attr("x", 0)
    .attr("y", (d) => y(d.key))
    .attr("width", (d) => x(d.value))
    .attr("height", y.bandwidth());

  const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
  const yAxisGroup = g.append("g");

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
});

