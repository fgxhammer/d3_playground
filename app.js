d3 = require("d3")
_ = require("lodash")

const width = 1000
const height = 600

// Get svg element
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

// Render function
const render = (data) => {

    const xValue = d => d.pop
    const yValue = d => d.name

    const margin = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 100
    }

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.left - margin.right

    // Color
    const colorDomain = d3.extent(data, xValue)
    const colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(colorDomain)

    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerHeight])
        .padding(0.1)

    // Axis
    const xAxisTickFormat = number => d3.format(".3s")(number).replace("G", "B") // format ticks
    const xAxis = d3.axisBottom(xScale).tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)
    const yAxis = d3.axisLeft(yScale)

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    g.append("g").call(yAxis)
        .selectAll(".domain, .tick line") // remove unnecessary lines
        .remove()

    const xAxisG = g.append("g").call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`)
        
    xAxisG.selectAll(".domain")
        .remove()

    xAxisG.append("text")
        .attr("y", 40)
        .attr("x", innerWidth / 2)
        .text("Population")
        .attr("fill", "black")
        .attr("font-size", "20px")

    g.selectAll("rect").data(data)
        .enter()
        .append("rect")
        .attr("width", d => xScale(xValue(d)))
        .attr("height", yScale.bandwidth())
        .attr("y", d => yScale(yValue(d)))
        .attr("fill", d => colorScale(xValue(d)))

    g.append("text")
        .text("Estimated population")
        .attr("font-size", "30px")
        .attr("text-align", "center")
        .attr("x", innerWidth / 2 - margin.left)
        .attr("y", -10)
        .attr("font-family", "arial")

}

// Fetch data from API and clean it up
const getData = async () => {
    data = await d3.tsv("https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.tsv")
    let countries = data.map(c => ({ name: c.name, pop: +c.pop_est }))
        .sort((a, b) => b.pop - a.pop)
        .slice(0, 10)
    console.log(countries)
    render(countries)
}
getData()
// console.log(typeof(getData))

