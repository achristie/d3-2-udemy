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

const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
const yAxisGroup = g.append("g");

const x = d3.scaleLinear().range([0, width]);

const y = d3.scaleBand().paddingInner(0.2).range([0, height]);

const year = g
  .append("text")
  .attr("x", width - 20)
  .attr("y", height - 20)
  .attr("text-anchor", "end");

d3.json("data/data.json").then((data) => {
  // const groupedData = groupBy(data[200].countries, "continent");
  let i = 0;
  d3.interval(() => update(data[++i]), 300);

  update(data[i]);
});

function update(data) {
  const groupedData = d3
    .rollups(
      data.countries,
      (v) => d3.sum(v, (d) => d.population),
      (d) => d.continent
    )
    .sort((a, b) => d3.descending(a[1], b[1]));

  console.log(groupedData);

  const t = d3.transition(100);
  const rect = g.selectAll("rect").data(groupedData, function (d) {
    return d[0];
  });

  x.domain([0, d3.max(groupedData, (d) => d[1])]);
  y.domain(groupedData.map((d) => d[0]));

  const xAxis = d3.axisBottom(x).ticks(4, "~s");
  const yAxis = d3.axisLeft(y);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  rect.join(
    (enter) =>
      enter
        .append("rect")
        .attr("fill", "green")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", (d) => x(d[1]))
        .attr("y", (d) => y(d[0])),
    (update) =>
      update
        .call((update) => update.transition(t))
        .attr("y", (d) => y(d[0]))
        .attr("height", y.bandwidth())
        .attr("width", (d) => x(d[1]))
  );

  year.text(data.year);
}

