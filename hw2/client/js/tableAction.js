var desiredCols = ["name", "continent", "gdp", "life_expectancy", "population", "year"];

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
