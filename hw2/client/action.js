var initialData = null;
var desiredCols = ["name", "continent", "gdp", "life_expectancy", "population", "year"];
var continents = ["Asia", "Africa", "Europe", "Oceania", "Americas"];
var checkedContinents = [];
var selectedYear;

/**
    0  - not sorted,
    1  - asc sorted,
    -1 - desc sorted
*/
var sortFlag = 0;

function getDesiredCols() {
  return desiredCols;
}

function format(column, value) {
  switch (column) {
    case "name":
      return value;
    case "continent":
      return value;
    case "gdp":
      return d3.format("8,.1f")(value / 10e9) + "G";
    case "life_expectancy":
      return d3.format("8,.1f")(value);
    case "population":
      return d3.format(",")(value);
    case "year":
      return (value);
    default:
      alert("Something wrong!");
  }
}

function filter() {

  d3.selectAll("input[name='checkbox']").each(function() {
    var currentContinent = d3.select(this);
    if (currentContinent.property("checked")) {
      if (checkedContinents.indexOf(currentContinent.attr("value")) < 0) {
        checkedContinents.push(currentContinent.attr("value"));
      }
    } else {
      var continentIndex = checkedContinents.indexOf(currentContinent.attr("value"));
      if (continentIndex > -1) {
        checkedContinents.splice(continentIndex, 1);
      }
    }
  });

  if (!Array.isArray(checkedContinents) || !checkedContinents.length) {
    tbody.selectAll("tr.row").each(function() {
      d3.select(this).classed("filtered", false);
    });
  } else {
    tbody.selectAll("tr.row").each(function() {
      d3.select(this).classed("filtered", true);
    });

    tbody.selectAll("tr.row").each(function() {
      var nrow = (d3.select(this))[0][0].innerText;
      for (var j = 0; j < checkedContinents.length; j++) {
        if (nrow.indexOf(checkedContinents[j]) > -1) {
          d3.select(this).classed("filtered", false);
        }
      }
    });
  }
}

function aggregate() {
  var aggr = d3.select('input[name="radio"]:checked').property("value");
  if (aggr == "None") {
    tbody.selectAll("tr.row").each(function() {
      var nrow = (d3.select(this))[0][0].innerText;

      var applyFilterStyle = false;
      for (var i = 0; i < continents.length; i++) {
        if (getNumOfOccur(nrow, continents[i]) == 2) {
          applyFilterStyle = true;
          break;
        }
      }
      d3.select(this).classed("filtered", applyFilterStyle);
    });
  } else {
    tbody.selectAll("tr.row").each(function() {
      var nrow = (d3.select(this))[0][0].innerText;

      var applyFilterStyle = true;
      for (var i = 0; i < continents.length; i++) {
        if (getNumOfOccur(nrow, continents[i]) == 2) {
          applyFilterStyle = false;
          break;
        }
      }
      d3.select(this).classed("filtered", applyFilterStyle);
    });
  }
}


function getNumOfOccur(str, pattern) {
  var pos = str.indexOf(pattern);
  for (var count = 0; pos != -1; count++)
    pos = str.indexOf(pattern, pos + pattern.length);
  return count;
}


function Continent(name) {
  this.name = name;
  this.continent = name;
  this.gdp = 0;
  this.life_expectancy = 0;
  this.population = 0;
  this.year = selectedYear;
  //use as counter
  this.alpha2_code = 0;
  this.latitude = 0;
  this.longitude = 0;
}

function getAggregatedByContinentsInfo(data) {
  var aggregatedInf = [];
  var americas = new Continent("Americas");
  var asia = new Continent("Asia");
  var europe = new Continent("Europe");
  var oceania = new Continent("Oceania");
  var africa = new Continent("Africa");

  for (var i = 0; i < data.length; i++) {
    switch (data[i].continent) {
      case "Americas":
        americas.population += data[i].population;
        americas.gdp += data[i].gdp;
        americas.life_expectancy += data[i].life_expectancy;
        americas.alpha2_code++;
        break;
      case "Asia":
        asia.population += data[i].population;
        asia.gdp += data[i].gdp;
        asia.life_expectancy += data[i].life_expectancy;
        asia.alpha2_code++;
        break;
      case "Europe":
        europe.population += data[i].population;
        europe.gdp += data[i].gdp;
        europe.life_expectancy += data[i].life_expectancy;
        europe.alpha2_code++;
        break;
      case "Oceania":
        oceania.population += data[i].population;
        oceania.gdp += data[i].gdp;
        oceania.life_expectancy += data[i].life_expectancy;
        oceania.alpha2_code++;
        break;
      case "Africa":
        africa.population += data[i].population;
        africa.gdp += data[i].gdp;
        africa.life_expectancy += data[i].life_expectancy;
        africa.alpha2_code++;
        break;
    }
  }

  americas.life_expectancy /= americas.alpha2_code;
  asia.life_expectancy /= asia.alpha2_code;
  europe.life_expectancy /= europe.alpha2_code;
  oceania.life_expectancy /= oceania.alpha2_code;
  africa.life_expectancy /= africa.alpha2_code;

  aggregatedInf.push(americas);
  aggregatedInf.push(asia);
  aggregatedInf.push(europe);
  aggregatedInf.push(oceania);
  aggregatedInf.push(africa);
  return aggregatedInf;
}

function getMaxAndMinYears(data) {
  var max = 2012;
  var min = 2012;
  for (var i = 0; i < data.length; i++) {
    var currentYears = data[i].years;
    for (var j = 0; j < currentYears.length; j++) {
      var curruntYear = currentYears[j].year;
      if (max < curruntYear) {
        max = curruntYear;
      }
      if (min > curruntYear) {
        min = curruntYear;
      }
    }
  }
  return [min, max];
}

function getInfoForCurrentYear(data, year) {
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    var currentYears = data[i].years;
    var j = 0;
    while (currentYears[j].year != year) {
      j++;
    }

    newData[i] = {
      alpha2_code: data[i].alpha2_code,
      continent: data[i].continent,
      gdp: !!(data[i].years)[j].gdp ? (data[i].years)[j].gdp : "",
      latitude: data[i].latitude,
      life_expectancy: (data[i].years)[j].life_expectancy,
      longitude: data[i].longitude,
      name: data[i].name,
      population: (data[i].years)[j].population,
      year: (data[i].years)[j].year
    }
  }
  return newData;
}

function init(data) {
  initialData = data;

  d3.selectAll("input[name='checkbox']").on("change", filter);
  d3.selectAll("input[name='radio']").on("change", aggregate);

  var range = getMaxAndMinYears(initialData);
  selectedYear = ~~((range[1] + range[0]) / 2);
  d3.select("input[name='range']")
    .attr("min", range[0])
    .attr("max", range[1])
    .attr("value", selectedYear)
    .on("change", changeYear);

  d3.select("label[name ='min']").text(range[0]);
  d3.select("label[name ='max']").text(range[1]);


  render();
}

function changeYear() {
  selectedYear = d3.select("input[name='range']").property("value");
  render();
}

function render() {
  d3.select("table").remove();

  var columns = getDesiredCols();

  var table = d3.select("body").append("table"),
    thead = table.append("thead")
    .attr("class", "thead");
  tbody = table.append("tbody");


  filter();
  aggregate();



  table.append("caption")
    .html("World Countries Ranking");

  thead.append("tr").selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(d) {
      return d;
    })
    .on("click", function(header) {
      var i = 0;
      tbody.selectAll("tr").sort(function(a, b) {
        if (sortFlag <= 0) {
          i = 1;
          return d3.ascending(a[header], b[header]);
        } else {
          i = -1;
          return d3.descending(a[header], b[header]);
        }
      });
      sortFlag = i;
    });

  var dataForCurrrentYear = getInfoForCurrentYear(initialData, selectedYear);
  var aggr = getAggregatedByContinentsInfo(dataForCurrrentYear);
  var rows = tbody.selectAll("tr.row")
    .data(dataForCurrrentYear.concat(aggr))
    .enter()
    .append("tr").attr("class", "row");

  var cells = rows.selectAll("td")
    .data(function(row) {
      return d3.range(columns.length).map(function(column, i) {
        return format(columns[i], row[columns[i]])
      });
    })
    .enter()
    .append("td")
    .text(function(d) {
      return d;
    })
    .on("mouseover", function(d, i) {

      d3.select(this.parentNode)
        .style("background-color", "#F3ED86");

    }).on("mouseout", function() {

      tbody.selectAll("tr")
        .style("background-color", null)
        .selectAll("td")
        .style("background-color", null);
    });

}
