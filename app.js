function buildMetadata(sample) {
    console.log("sample: " + sample)
    var url = "/metadata/"+sample;
    // `d3.json` to fetch the metadata for a sample
      //  d3 to select the panel with id of `#sample-metadata`
    d3.json(url).then(function(response){
      var metadata_Sample= d3.select("#sample-metadata");
      metadata_Sample.selectAll("p").remove();
  
      for(var key in response){
          if(response.hasOwnProperty(key)){
              metadata_Sample.append("p").text(key + ":   " + response[key]);
          }
      }
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  });
  }
  
  function buildCharts(sample) {
  
    d3.json("/samples/" + sample).then(function(response){
      var pielabels = response['otu_ids'].slice(0,10);
      var pievalues = response['sample_values'].slice(0,10);
      var piedescription = response['otu_labels'].slice(0,10);
      var trace1 = { 
        values: pievalues,
        labels: pielabels,
        type:"pie",
        name:"Top 10 Samples",
        textinfo:"percent",
        text: piedescription,
        textposition: "inside",
        hoverinfo: 'label+value+text+percent'
      }
    var data=[trace1];
    var layout={
        title: "<b>Top 10 Samples: " + sample + "</b>"
    }
    Plotly.newPlot("pie", data, layout);
    })
  
    d3.json("/samples/"+sample).then(function(response){
  
      var scatter_description = response['otu_labels'];
  
      var trace1 = {
          x: response['otu_ids'],
          y: response['sample_values'],
          marker: {
              size: response['sample_values'],
              color: response['otu_ids'].map(d=>100+d*20),
              colorscale: "Earth"
          },
          type:"scatter",
          mode:"markers",
          text: scatter_description,
          hoverinfo: 'x+y+text',
      };
      var data = [trace1];
  
      var layout = {
          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "# of germs in Sample",zeroline:true, hoverformat: '.2r'},
          height: 500,
          width:1200,
          margin: {
              l: 100,
              r: 10,
              b: 70,
              t: 10,
              pad: 5
            },
          hovermode: 'closest',
      };
  
      Plotly.newPlot("bubble",data,layout);
    })
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    console.log("Option Changed")
    console.log("New sample: " + newSample )
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();