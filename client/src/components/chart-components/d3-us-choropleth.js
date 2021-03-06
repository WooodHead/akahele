var topojson = require('topojson');
var MapChoropleth = require('react-d3-map-choropleth').MapChoropleth;
var width = 960,
  height = 600;

  var topodata = require('../../public//us.json');
  let unemploy = d3.tsvParse('./unemployment.tsv');

  // data should be a MultiLineString
  var dataStates = topojson.mesh(topodata, topodata.objects.states, function(a, b) { return a !== b; });
  /// data should be polygon
  var dataCounties = topojson.feature(topodata, topodata.objects.counties).features;

  // domain
  var domain = {
    scale: 'quantize',
    domain: [0, .15],
    range: d3.range(9).map(function(i) { return "q" + i + "-9"; })
  };
  var domainValue = function(d) { return +d.rate; };
  var domainKey = function(d) {return +d.id};
  var mapKey = function(d) {return +d.id};

  var scale = 1280;
  var translate = [width / 2, height / 2];
  var projection = 'albersUsa';