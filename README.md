# Interactive Markdown

Interactive Markdown Chrome Extension


## Javascript

```js
var name = "Kartik Talwar";
var age = 11*2;

console.log("Hi, I'm", name, "and I'm", age);
```

## Python

```python
def square(x):
  return x*x

print map(square, [2,3,4,5])
```

## Ruby

```ruby
name = "Chen"
puts print "This is ", name, "\n"
puts print "This is ", name, " again in another code block.\n"
```

## HTML

```html
<html>
<head>
  <link rel="stylesheet" href="https://rawgit.com/interactive-markdown/interactive-markdown-chrome/master/lib-example/a.singlediv.com_reset.css">
  <link rel="stylesheet" href="https://rawgit.com/interactive-markdown/interactive-markdown-chrome/master/lib-example/a.singlediv.com_main.css">
</head>
<body>
<div id="mario-mushroom" class="entry">
  <div></div>
</div>
<div id="mario-tube" class="entry">
  <div></div>
</div>
<div id="mickey-hat" class="entry wide">
  <div></div>
</div>
<div id="battery" class="entry wide">
  <div></div>
</div>
</body>
</html>
```

## d3js

```html
<meta charset="utf-8">
<style>
 
body {
  background: #222;
  font-family: sans-serif;
  font-style: italic;
}
 
</style>
<body>
<script src="https://rawgit.com/interactive-markdown/interactive-markdown-chrome/master/lib-example/d3js.org_d3.v3.min.js"></script>
<script>
 
var now = new Date(d3.time.year.floor(new Date()));

var spacetime = d3.select('body');
var width = 192,
    height = 100,
    radius = Math.min(width, height);

var radii = {
  "sun": radius / 8,
  "earthOrbit": radius / 2.5,
  "earth": radius / 32,
  "moonOrbit": radius / 16,
  "moon": radius / 96
};

// Space
var svg = spacetime.append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Sun
svg.append("circle")
  .attr("class", "sun")
  .attr("r", radii.sun)
  .style("fill", "rgba(255, 204, 0, 1.0)");

// Earth's orbit
svg.append("circle")
  .attr("class", "earthOrbit")
  .attr("r", radii.earthOrbit)
  .style("fill", "none")
  .style("stroke", "rgba(255, 204, 0, 0.25)");

// Current position of Earth in its orbit
var earthOrbitPosition = d3.svg.arc()
  .outerRadius(radii.earthOrbit + 1)
  .innerRadius(radii.earthOrbit - 1)
  .startAngle(0)
  .endAngle(0);
svg.append("path")
  .attr("class", "earthOrbitPosition")
  .attr("d", earthOrbitPosition)
  .style("fill", "rgba(255, 204, 0, 0.75)");

// Earth
svg.append("circle")
  .attr("class", "earth")
  .attr("r", radii.earth)
  .attr("transform", "translate(0," + -radii.earthOrbit + ")")
  .style("fill", "rgba(113, 170, 255, 1.0)");

// Time of day
var day = d3.svg.arc()
  .outerRadius(radii.earth)
  .innerRadius(0)
  .startAngle(0)
  .endAngle(0);
svg.append("path")
  .attr("class", "day")
  .attr("d", day)
  .attr("transform", "translate(0," + -radii.earthOrbit + ")")
  .style("fill", "rgba(53, 110, 195, 1.0)");

// Moon's orbit
svg.append("circle")
  .attr("class", "moonOrbit")
  .attr("r", radii.moonOrbit)
  .attr("transform", "translate(0," + -radii.earthOrbit + ")")
  .style("fill", "none")
  .style("stroke", "rgba(113, 170, 255, 0.25)");

// Current position of the Moon in its orbit
var moonOrbitPosition = d3.svg.arc()
  .outerRadius(radii.moonOrbit + 1)
  .innerRadius(radii.moonOrbit - 1)
  .startAngle(0)
  .endAngle(0);
svg.append("path")
  .attr("class", "moonOrbitPosition")
  .attr("d", moonOrbitPosition(now))
  .attr("transform", "translate(0," + -radii.earthOrbit + ")")
  .style("fill", "rgba(113, 170, 255, 0.75)");

// Moon
svg.append("circle")
  .attr("class", "moon")
  .attr("r", radii.moon)
  .attr("transform", "translate(0," + (-radii.earthOrbit + -radii.moonOrbit) + ")")
  .style("fill", "rgba(150, 150, 150, 1.0)");

// Update the clock every second
setInterval(function () {
  now = new Date();
  
  var interpolateEarthOrbitPosition = d3.interpolate(earthOrbitPosition.endAngle()(), (2 * Math.PI * d3.time.hours(d3.time.year.floor(now), now).length / d3.time.hours(d3.time.year.floor(now), d3.time.year.ceil(now)).length));
  
  var interpolateDay = d3.interpolate(day.endAngle()(), (2 * Math.PI * d3.time.seconds(d3.time.day.floor(now), now).length / d3.time.seconds(d3.time.day.floor(now), d3.time.day.ceil(now)).length));
  
  var interpolateMoonOrbitPosition = d3.interpolate(moonOrbitPosition.endAngle()(), (2 * Math.PI * d3.time.hours(d3.time.month.floor(now), now).length / d3.time.hours(d3.time.month.floor(now), d3.time.month.ceil(now)).length));
  
  d3.transition().tween("orbit", function () {
    return function (t) {
      // Animate Earth orbit position
      d3.select(".earthOrbitPosition").attr("d", earthOrbitPosition.endAngle(interpolateEarthOrbitPosition(t)));

      // Transition Earth
      d3.select(".earth")
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");

      // Animate day
      // Transition day
      d3.select(".day")
        .attr("d", day.endAngle(interpolateDay(t)))
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");
      
      // Transition Moon orbit
      d3.select(".moonOrbit")
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");

      // Animate Moon orbit position
      // Transition Moon orbit position
      d3.select(".moonOrbitPosition")
        .attr("d", moonOrbitPosition.endAngle(interpolateMoonOrbitPosition(t)))
        .attr("transform", "translate(" + radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + "," + -radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + ")");
      
      // Transition Moon
      d3.select(".moon")
        .attr("transform", "translate(" + (radii.earthOrbit * Math.sin(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + radii.moonOrbit * Math.sin(interpolateMoonOrbitPosition(t) - moonOrbitPosition.startAngle()())) + "," + (-radii.earthOrbit * Math.cos(interpolateEarthOrbitPosition(t) - earthOrbitPosition.startAngle()()) + -radii.moonOrbit * Math.cos(interpolateMoonOrbitPosition(t) - moonOrbitPosition.startAngle()())) + ")");
    };
  });
}, 1000);
 
</script>
```
