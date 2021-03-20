/**
 * @class       : second
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Friday Mar 19, 2021 20:32:03 EDT
 * @description : second
 */

const margin = { left: 50, right: 30, top: 30, bottom: 30 };
const height = 400 - margin.top - margin.bottom;
const width = 600 - margin.left - margin.right;
let flag = true;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleBand().paddingInner(0.3).range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
const yAxisGroup = g.append("g");

const xAxis = (label) => (g) => g.call(d3.axisBottom(x));
// .append("text")
// .text(label)
// .attr("fill", "#000")
// .attr("font-size", "16px")
// .attr("x", margin.left + (width - margin.left - margin.right) / 2)
// .attr("y", 50);

const yAxis = (label) => (g) => g.call(d3.axisLeft(y));
// .append("text")
// .text(label)
// .attr("fill", "#000")
// .attr("transform", "rotate(-90)")
// .attr("y", -50);

d3.csv("data/sales.csv").then((data) => {
  d3.interval(() => {
    flag = !flag;
    const newData = flag ? data : data.slice(1);
    update(newData);
  }, 1000);
  update(data);
});

function update(data) {
  const metric = flag ? "Profit" : "Sales";
  const t = d3.transition().duration(750);

  x.domain(data.map((d) => d.Month));
  y.domain([0, d3.max(data, (d) => d[metric])]);
  xAxisGroup.transition(t).call(xAxis("Month"));
  yAxisGroup.transition(t).call(yAxis(metric));

  const rect = g.selectAll("rect").data(data, (d) => d.Month);

  rect
    .exit()
    .attr("fill", "red")
    .transition(t)
    .attr("height", 0)
    .attr("y", y(0))
    .remove();

  rect
    .transition(t)
    .attr("fill", "green")
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d[metric]))
    .attr("y", (d) => y(d[metric]))
    .attr("x", (d, i) => x(d.Month));

  rect
    .enter()
    .append("rect")
    .attr("fill", "green")
    .attr("width", x.bandwidth())
    .attr("x", (d, i) => x(d.Month))
    .attr("y", y(0))
    .attr("height", 0)
    .transition(t)
    .attr("y", (d) => y(d[metric]))
    .attr("height", (d) => height - y(d[metric]));
}

