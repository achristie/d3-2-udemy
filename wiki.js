/**
 * @class       : wiki
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Saturday Apr 03, 2021 19:09:14 EDT
 * @description : wiki
 */
const margin = { left: 50, right: 30, top: 30, bottom: 30 };
const height = 500 - margin.top - margin.bottom;
const width = 800 - margin.left - margin.right;

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

  const group = d3.groups(
    data,
    (d) => d.timestamp.split(" ")[0],
    (d) => d.timestamp.split(" ")[1]
  );
  console.log(group);
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.timestamp))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(rollup, (d) => +d[1])])
    .range([height, 0]);

  const year_scale = d3
    .scaleBand()
    .domain(group.map((d) => +d[0]))
    .padding(0)
    .range([0, width]);

  const years = g
    .selectAll(".years")
    .data(group)
    .join("g")
    .attr("class", "year");
  // .attr("transform", (d) => `translate(${year_scale(+d[0])} 0)`);

  years
    .selectAll("rect")
    .data((d) => d[1])
    .join("rect")
    .attr("fill", (d) => "cyan")
    .attr("width", x.bandwidth())
    .attr("x", (d, i) => x(d[1][0].timestamp))
    .attr("y", (d) => y(d[1].length))
    .attr("height", (d) => height - y(d[1].length));

  xAxis_year = (g) => {
    const group = g
      .selectAll(".tick")
      .data(year_scale.domain())
      .join("g")
      .attr("class", "tick")
      .attr("transform", (d) => `translate(${year_scale(d)} 0)`);

    group
      .append("line")
      .attr("x1", year_scale.bandwidth())
      .attr("x2", year_scale.bandwidth())
      .attr("y1", -20)
      .attr("y2", 10)
      .attr("stroke", "#dcdcdc");

    group
      .append("text")
      .text((d) => d)
      .attr("x", year_scale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#999")
      .attr("font-size", 14);
  };
  // const xAxis = d3.axisBottom(year_scale);
  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${height + 20})`);

  xAxisGroup.call(xAxis_year);

  // const rect = g.selectAll("rect").data(rollup);
  // rect
  //   .join("rect")
  //   .attr("y", (d) => y(d[1]))
  //   .attr("height", (d) => height - y(d[1]))
  //   .attr("fill", "green")
  //   .attr("");
});

