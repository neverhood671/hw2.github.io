var encodesBarBy = "Population";
var initialData;
var selectedYear;

var max;
var min;

function initBarPage(data){

  initialData = data;

  var range = getMaxAndMinYears(initialData);
  selectedYear = ~~((range[1] + range[0]) / 2);
  d3.select("input[name='range']")
    .attr("min", range[0])
    .attr("max", range[1])
    .attr("value", selectedYear)
    .on("change", changeBarsYear);

  d3.selectAll("input[name='encodesBarRadio']").on("change", changeEncode);
  d3.selectAll("input[name='checkbox']").on("change", barFilter);
  d3.selectAll("input[name='aggrRadio']").on("change", barAggregate);
  d3.selectAll("input[name='sortRadio']").on("change", barAggregate);


  renderBarPage();
}

function renderBarPage(){
  d3.select("g").remove();

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var newData = getInfoForCurrentYear(initialData, selectedYear);

  if (encodesBarBy == "Population"){
    max = d3.max(newData, function(d) {
      return d.population;
    });
  } else {
    max = d3.max(newData, function(d) {
      return d.gdp;
    });
  }

  min = 0;

  xScale.domain([min, max]);
  yScale.domain(newData.map(function(d) {
    return d.name;
  }));

  var groups = g.append("g")
    .selectAll("text")
    .data(newData)
    .enter()
    .append("g");

  var labels = groups
    .append("text")
    .text(function(d){return d.name})
    .attr("x", xScale(min))
    .attr("y", function(d) {
      return yScale(d.name) * 3;
    })
    .attr("dy", "0.7em")
    .attr("dx", "-11em")
    .attr("class","label");

  var bars = groups
    .append("rect")
    .attr("width", function(d) {
      if (encodesBarBy == "Population"){
        return xScale(d.population);
      } else {
        return xScale(d.gdp)
      }
    })
    .attr("x",  xScale(min))
    .attr("y", function(d) {
      return  yScale(d.name) * 3;
    })
    .attr("class","bar");
}

function barFilter(){

}

function barAggregate(){

}

function changeEncode() {
  encodesBarBy = d3.select("input[name='encodesBarRadio']:checked").property("value");
  renderBarPage();
}

function sortRadio(){

}

function changeBarsYear() {
  selectedYear = d3.select("input[name='range']").property("value");
  renderBarPage();
}
