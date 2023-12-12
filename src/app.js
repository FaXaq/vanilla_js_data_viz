import * as d3 from 'd3'
import data from '../data.json'
import anime from 'animejs';

// Copy data into a new table
const FULL_DATA = [...data]
// This will contain the fees for our simulation
let fees = 0
// This is an index on which we will apply the animation
const MOVING_INDEX = {
  x: 0
}

/**
 * This function draws the line chart along with its level lines
 * @param {number} index Index until we have to draw the chart
 */
function chart(index) {
  const container = document.getElementById("graph")
  const DATA_UNTIL_INDEX = FULL_DATA.slice(0, index)

  // Declare the chart dimensions and margins.
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  // Quick helper to 
  const formatDate = (date) => {
    const dates = date.split('/')
    return new Date(`${dates[1]}/${dates[0]}/${dates[2]}`)
  }

  // Declare the x (horizontal position) scale.
  const x = d3.scaleUtc(d3.extent(FULL_DATA, d => formatDate(d.date)), [marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear([0, d3.max(FULL_DATA, d => d.market_price)], [height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  // Add the x-axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Daily close ($)"));

  /**
   * MarketPrice Line
   */
  // Declare the line generator.
  const marketPriceLine = d3.line()
      .x(d => x(formatDate(d.date)))
      .y(d => y(d.market_price))

  // Append a path for the marketPriceLine line.
  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", marketPriceLine(DATA_UNTIL_INDEX));

  /**
   * 50% sell
   * uncomment if you want to see lines
   */
  // // Declare the line generator.
  // const fiftyPSell = d3.line()
  //     .x(d => x(formatDate(d.date)))
  //     .y(d => y(d['50p_sell_price']))

  // // Append a path for the fiftyPSell line.
  // svg.append("path")
  //   .attr("fill", "none")
  //   .attr("stroke", "purple")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", fiftyPSell(DATA_UNTIL_INDEX))

  /**
   * 50% buy
   * uncomment if you want to see lines
   */
  // Declare the line generator.
  // const fiftyPBuy = d3.line()
  //     .x(d => x(formatDate(d.date)))
  //     .y(d => y(d['50p_buy_price']))

  // // Append a path for the fiftyPSell line.
  // svg.append("path")
  //   .attr("fill", "none")
  //   .attr("stroke", "purple")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", fiftyPBuy(DATA_UNTIL_INDEX));

  /**
   * Draw current lower line
   */
  // Setting x range for lower line
  // This is a tricky bit, that will always return the current 50p_sell_price as y value
  const lowerLine = d3.line()
    .x(d => x(formatDate(d.date)))
    .y(() => y(DATA_UNTIL_INDEX[DATA_UNTIL_INDEX.length - 1]['50p_sell_price']))

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "lime")
    .attr("stroke-width", 1.5)
    .attr("d", lowerLine(FULL_DATA));

  /**
   * Draw current upper line
   */
  // Setting x range for lower line
  // This is a tricky bit, that will always return the current 50p_buy_price as y value
  const upperLine = d3.line()
    .x(d => x(formatDate(d.date)))
    .y(() => y(DATA_UNTIL_INDEX[DATA_UNTIL_INDEX.length - 1]['50p_buy_price']))

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", upperLine(FULL_DATA));
  
  
  container.replaceChildren(svg.node())
}

function pie(assets) {
  const container = document.getElementById("pie")
  // Declare the chart dimensions and margins
  const width = 928;
  const height = Math.min(width, 500);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // generate pie arc generator
  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);
  
  // Create a quick color scheme for our pie chart (works with more than 2 assets)
  const color = d3.scaleOrdinal()
      .domain(assets.map(d => d))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), assets.length).reverse())

  // Create a pie generator
  const pie =  d3.pie()
    .sort(null)
    .value(d => d.value);

  // Generate d3 pie arcs
  const arcs = pie(assets)

  // use the generated pie arcs and pie arc generator to create new svg paths
  svg.append("g")
    .attr("stroke", "white")
    .selectAll()
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)

  container.replaceChildren(svg.node())
}

/**
 * Here is all the logic. We animate the x index, hence creating a "data animation" on x
 */
anime({
  targets: MOVING_INDEX,
  x: FULL_DATA.length - 1,
  round: 1,
  easing: 'linear',
  // Feel free to modify, but beware, the pie chart might stagger a bit
  duration: 30000,
  update() {
    // Render chart until x index
    chart(MOVING_INDEX.x)

    // Here we calculate a percentage of assets depending on the market price value position between 50p_sell_price & 50p_buy_price
    const diffBetween50pSell50pBuy =  FULL_DATA[MOVING_INDEX.x]['50p_buy_price'] - FULL_DATA[MOVING_INDEX.x]['50p_sell_price']
    const percentAsset1 = (FULL_DATA[MOVING_INDEX.x].market_price - FULL_DATA[MOVING_INDEX.x]['50p_sell_price']) / diffBetween50pSell50pBuy
    const percentAsset2 = 1 - percentAsset1

    // Each arc has a 30% value min, so the remaining asset value is only counting for the remaining total 40%
    // Hence the percentage value multiplier of 40
    pie([
      { name: 'percentAsset1', value: 30 + (percentAsset1 * 40)},
      { name: 'percentAsset2', value: 30 + (percentAsset2 * 40)}
    ])


    /**
     * Logic to add fees each time we hit a price level
     */
    if (FULL_DATA[MOVING_INDEX.x].market_price === FULL_DATA[MOVING_INDEX.x]['50p_buy_price']) {
      fees += 1
    }
    if (FULL_DATA[MOVING_INDEX.x].market_price === FULL_DATA[MOVING_INDEX.x]["50p_sell_price"]) {
      fees += 1
    }
    // Render fees
    document.getElementById('fees').innerText = `Price level bars hits : ${fees}`
  }
})