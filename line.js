/**
 * @class       : line
 * @author      : awc (awc@$HOSTNAME)
 * @created     : Saturday Mar 20, 2021 21:57:36 EDT
 * @description : line
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

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const parseTime = d3.timeParse("%Y");
const bisectDate = d3.bisector((d) => d.year).left;

const xAxis = (label) => (g) => g.call(d3.axisBottom(x));
const yAxis = (label) => (g) =>
  g.call(
    d3
      .axisLeft(y)
      .ticks(6)
      .tickFormat((d) => `${parseInt(d / 1000)}k`)
  );

const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
const yAxisGroup = g.append("g");

const line = d3
  .line()
  .x((d) => x(d.year))
  .y((d) => y(d.value));

