// Load data from CSV
d3.csv('311-basic/311_boston_data.csv').then(data => {
  // Parse the count as numbers
  data.forEach(d => {
    d.Count = +d.Count;
  });

  // Sort the data by Count in descending order
  data.sort((a, b) => b.Count - a.Count);

  // Take only the top 10 reasons
  const top10Data = data.slice(0, 10);

  // Set up the SVG container
  const svg = d3.select('#chart-container')
    .append('svg')
    .attr('width', 800)
    .attr('height', 400);

  // Set up scales
  const xScale = d3.scaleBand()
    .domain(top10Data.map(d => d.reason))
    .range([0, 800])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(top10Data, d => d.Count)])
    .range([400, 0]);

  // Create bars with pink fill color
  svg.selectAll('rect')
    .data(top10Data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.reason))
    .attr('y', d => yScale(d.Count))
    .attr('width', xScale.bandwidth())
    .attr('height', d => 400 - yScale(d.Count))
    .attr('fill', 'pink');

  // Add text labels with black color
  svg.selectAll('text')
    .data(top10Data)
    .enter()
    .append('text')
    .text(d => `${d.reason}: ${d.Count}`)
    .attr('x', d => xScale(d.reason) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.Count) - 5)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', 'black');

  // Add x-axis
  svg.append('g')
    .attr('transform', 'translate(0,400)')
    .call(d3.axisBottom(xScale))
    .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

  // Add y-axis
  svg.append('g')
    .call(d3.axisLeft(yScale));

  // Add chart title
  svg.append('text')
    .attr('x', 400)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .style('font-size', '18px')
    .text('Top 10 Reasons for 311 in Boston (2023)');
});
