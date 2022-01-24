var width = 600,
  height = 600
 
var projection = d3.geo.azimuthalEquidistant()
  .scale(width / 5)
  .translate([0, 0])
  .rotate([-18 * 15, -66.56])
 
var starsContainer = d3.select('.stars').append('svg')
  //.attr('width', width)
  //.attr('height', height)
  .attr('viewBox','0 0 '+width*4/5+' '+height*4/5)
  .append('g')
  .attr('transform', 'translate(' + width * 2 / 5 + ',' + height * 2 / 5 + ')')
 
function addZodiacName(g, name, x, y) {
  var rotation = 'rotate(' +
    (Math.atan2(y, x) * 180 / Math.PI + 90) + ',' +
    x + ',' +
    y + ')';
  g.append('text')
    .classed('zodiac-bg', true)
  g.append('text')
  g.selectAll('text')
    .text(name)
    .attr('x', x)
    .attr('y', y)
    .attr('transform', rotation)

}
function distance(x,y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}
 
d3.json("https://gist.githubusercontent.com/djdmsr/e7179cd81961200ee5c39c2c8c3e1ac6/raw/231765dc684864b1552065f320282c62a8fa7921/stars", function(error, data) {
  var groups = starsContainer.selectAll('g')
    .data(data)
    .enter()
    .append('g')
 
  groups.each(function (constellation) {
    var name = constellation.name
    var projections = constellation.stars.map(function (star) {
      var p = projection([star.ra, star.dec])
      var out = (distance(p[0], p[1]) > width / 2.5)
      return {
        color: star.color,
        mag: star.mag,
        radius: Math.pow(1.2, 3 - star.mag),
        projection: p,
        out: out
      }
    })
 
    var x = d3.mean(projections, function (d) { return d.projection[0] = -d.projection[0] })
 
    var y = d3.mean(projections, function (d) { return d.projection[1] })
 
    var g = d3.select(this)
 
    projections = projections.filter(function (star) {
      return !star.out && star.mag <= 6
    })
 
    if (distance(x, y) < width / 3 || constellation.zodiac){
      var lines = constellation.lines.map(function (line) {
        var p1 = projection([line.ra1, line.dec1])
        var p2 = projection([line.ra2, line.dec2])
        p1[0] = -p1[0]
        p2[0] = -p2[0]
        var out = distance(p1[0], p1[1]) > width / 3
        return {line: [p1, p2], zodiac: constellation.zodiac, out: out}
      })
      var starLines = g.selectAll('line')
        .data(lines)
        .enter()
        .append('line')
      starLines
        .attr('x1', function (d) { return d.line[0][0] })
        .attr('y1', function (d) { return d.line[0][1] })
        .attr('x2', function (d) { return d.line[1][0] })
        .attr('y2', function (d) { return d.line[1][1] })
        .style('stroke',function (d) { if (d.out && !d.zodiac) return 'none'})
        .classed('zodiac', function (d) { return d.zodiac; })
    }
 
    var circles = g.selectAll('circle')
      .data(projections)
      .enter()
    circles.append('circle')
      .classed('bg', true)
      .attr('r', function (d) { return 1.2 + d.radius })
    circles.append('circle')
      .attr('fill', function (d) { return d.color })
      .attr('r', function (d) { return d.radius })
    g.selectAll('circle')
      .attr('cx', function (d) { return d.projection[0] })
      .attr('cy', function (d) { return d.projection[1] })
 
    if (constellation.zodiac)
      addZodiacName(g, name, x, y)
  })

  d3.selectAll('text')
  .filter(function() {
      return d3.select(this).text() == "Aquarius"
  })
  .style("fill", "#f2f237")
  .style("font", "14px sans-serif")
  .on("click", () => {

    document.body.style["background-image"] = 'none';
      d3.select('.container').remove();
      FX.loop();
  });

  var frames = 0

  function animate(){
    window.requestAnimationFrame(animate)
    frames++
  }
  animate()

  setInterval(function () {
    fps = frames / 10 + ' fps'
    //console.log(fps)
    frames = 0
  }, 10000)
})