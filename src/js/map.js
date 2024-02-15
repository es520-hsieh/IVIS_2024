var element = document.querySelector(".visualization-section > section");
var width = element.clientWidth;
var height = element.clientHeight;

const map = d3
  .select("#map")
  .append("svg")
  .append("g")
  .attr("width", width) 
  .attr("height", height);

d3.json("/src/data/worldMap.json").then(function (geojsonData) {
  const projection = d3
    .geoMercator()
    .rotate([-12, 0, 0])
    .center([0, 0])
    .scale(height / 1.17 / Math.PI)
    .translate([width / 2, height / 1.7]);
  var worldGraticule = d3.geoGraticule();

  const path = d3.geoPath().projection(projection);

  map
    .selectAll("path")
    .data(geojsonData.features) 
    .enter()
    .append("path") 
    .attr("d", path) 
    .attr("fill", "lightblue") 
    .attr("stroke", "white"); 
});


Promise.all([
  d3.json("/src/data/world_country_zoom.json"), 
  d3.json("/src/data/countries.json"), 
  d3.csv("/src/data/database.csv"), ])
  .then(function (data) {
    const worldMapData = data[0]; 
    const countriesData = data[1]; 
    const songsData = data[2]; 

    const projection = d3
      .geoMercator()
      .rotate([-12, 0, 0])
      .center([0, 0])
      .scale(height / 1.17 / Math.PI)
      .translate([width / 2, height / 1.7]);
    var worldGraticule = d3.geoGraticule();

    const swedenCoords = worldMapData["SWE"];

    const countryMap = {};
    songsData.forEach(function (d) {
      var songName = d["Original"];
      var country = d["Artist Country"];

      if (!countryMap[songName]) {
        countryMap[songName] = [];
      }
      countryMap[songName].push(country);
    });

    function drawCurvesFromSweden(
      projection,
      swedenCoords,
      countryMap,
      countriesData
    ) {
      const svg = d3.select("#map").select("svg"); 
      const startingPoint = projection(swedenCoords); 
    
      Object.keys(countryMap).forEach(function (songName) {
        const countries = countryMap[songName];
    
        countries.forEach(function (countryCode) {
          const countryCoords = countriesData[countryCode];
    
          if (countryCoords) {
            const endPoint = projection(countryCoords);
    
            const pathData = `M${startingPoint[0]},${startingPoint[1]} L${endPoint[0]},${endPoint[1]}`;
    
            svg
              .append("path")
              .attr("d", pathData)
              .attr("stroke", "red")
              .attr("stroke-width", 2)
              .attr("fill", "none");
          }
        });
      });
    }
    
    drawCurvesFromSweden(projection, swedenCoords, countryMap, countriesData);
  })
  .catch(function (error) {
    console.error("Error loading data files:", error);
  });

