

function calculateColorFromValue(value, min, max, minColor, maxColor) {
  var range = max - min;
  var perc = (value - min) / range;

  var dRed = maxColor.red - minColor.red;
  var dGreen = maxColor.green - minColor.green;
  var dBlue = maxColor.blue - minColor.blue;

  dRed = parseInt(dRed * perc + minColor.red);
  dGreen = parseInt(dGreen * perc + minColor.green);
  dBlue = parseInt(dBlue * perc + minColor.blue);

  var h = dRed * 0x10000 + dGreen * 0x100 + dBlue * 0x1;
  var val = "#" + ("000000" + h.toString(16)).slice(-6);
  return val;
}

function toggleDetailViewVisibility() {
  var details = d3.select(".detail-wrapper");
  var isHidden = details.classed("detail-hidden");
  if (isHidden) {
    details.classed("detail-hidden", false);
    // make sure the country tooltip is hidden
    countryTooltip.classed("country-tooltip-hidden", true);
    setTimeout(hideCountryTooltip, 500);
  } else {
    details.classed("detail-hidden", true);
    // let tooltip be shown on map after zooming out is almost done
    setTimeout((function(){
      countryTooltip.classed("country-tooltip-hidden", false);
    }), 1100);
  }
}

function countryClickSelection(CC) {
  var isSelected = selectedCountries.indexOf(CC);
  if (isSelected > -1) {
    deselectCountry(CC);
  } else if (selectedCountries.length < 3) {
    selectedCountries.push(CC);
    d3.select("#country-list-" + CC).style("color", "#1ed760");
    addCountryToDetailView(CC);
  }
}
