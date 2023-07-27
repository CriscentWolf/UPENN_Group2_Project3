var graphSel = document.querySelector('#graph-sel');
document.querySelector('#btnApply').addEventListener('click', createGraph);

var h1 = d3.select('#graph')

function init() {
    fetch("countries.geojson")
        .then((res) => {
        return res.json();
    })
    .then(() => {
        createGraph();
    });
}
init();

function createGraph() {
    var url = 'http://localhost:5000/api/' + graphSel.value
    fetch(url)
        .then(res => res.json())
        .then(function(apiData) {

            if (graphSel.value == 'top10_population') {
                h1.text(graphSel.value)
                x = []
                y = []
                for (var i = 0; i < apiData.length; i++) {
                    x.push(apiData[i].country)
                    y.push(apiData[i].population)
                }
                var trace = {
                    x: x,
                    y: y,
                    type: 'bar'
                }}
            else if (graphSel.value == 'top10_population_density'){
                h1.text(graphSel.value)
                    x = []
                    y = []
                    for (var i = 0; i < apiData.length; i++) {
                        x.push(apiData[i].country)
                        y.push(apiData[i].density_p_km2)
                    }
                var trace = {
                    x: x,
                    y: y,
                    type: 'bar'
                }}

            Plotly.newPlot('plot', [trace])

        })
}