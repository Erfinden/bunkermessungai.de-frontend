document.addEventListener('DOMContentLoaded', function () {
  // Assuming 'options' is already defined with the chart configuration but without the 'data' property set
  var storedKey = localStorage.getItem('key');
  var formData = new FormData();
  formData.append('key', storedKey);

  fetch(`http://127.0.0.1:5000/get_diagram`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  .then(response => response.json())
  .then(jsonData => {
    const formattedData = Object.keys(jsonData).map(dateStr => {
      const dataForDate = jsonData[dateStr];
      return {
        time: new Date(dateStr),  // Assuming `dateStr` is in a format that can be directly converted to a Date object
        percent: dataForDate.percent,     
        confidence: dataForDate.confidence,   
        kwh: dataForDate.brenner_info,
        url: dataForDate.url,
        weather: dataForDate.weather
      };
    });

    // Now `formattedData` is in the format AG Charts requires
    options.data = formattedData; // Assign the fetched data to the `data` property

    if (screen.width < 750) {
      options.axes.forEach(axis => {
        if (!axis.label) axis.label = {}; // Ensure the label property exists
        axis.label.enabled = false; // Disable labels for small screens
      });
    }
    agCharts.AgCharts.create(options);
  })
  .catch(error => console.error('Error fetching data:', error));
});

const options = {
  container: document.getElementById("myChart"),
  title: {
    text: "Hackschnitzelbunker Daten",
  },
  background: {
    fill: "#191919",
  },


  theme : 'ag-vivid-dark',
  
  data: [],

  series: [
    {
      xKey: "time",
      yKey: "percent",
      yName: "Percent (AI)",
      urlKey: "url",
      connectMissingData: false,
      stroke: "rgb(255, 0, 0)",
      tooltip: {
        renderer,
      },
      marker: {
        fill: "rgb(255, 0, 0)",
        size: 0,
      }
    },
    {
      xKey: "time",
      yKey: "confidence",
      yName: "Confidence (AI)",
      urlKey: "url",
      connectMissingData: false,
      stroke: "rgb(255, 255, 0, 0.7)",
      tooltip: {
        renderer,
      },
      marker: {
        fill: "rgb(255, 255, 0, 0.7)",
        size: 0,
      }
    },
    {
      xKey: "time",
      yKey: "kwh",
      yName: "kWh usage",
      urlKey: "url",
      connectMissingData: false,
      stroke: "rgb(96, 161, 50, 0.3)",
      tooltip: {
        renderer,
      },
      marker: {
        fill: "rgb(96, 161, 50, 0.3)",
        size: 0,
      }
    },
    {
      xKey: "time",
      yKey: "weather",
      yName: "Weather",
      urlKey: "url",
      connectMissingData: false,
      tooltip: {
        renderer,
      }
    },
  ],
  axes: [
    {
      type: "time",
      position: "bottom",
    },
    {
      type: "number",
      position: "left",
      keys: ["percent", "confidence"],
      min: 0,
      max: 100,
      label: {
        format: "#{.1f}%",
        
      },

    },
    {
      type: "number",
      position: "right",
      keys: ["weather"],
      min: -50, 
      max: 50,
      label: {
        format: "#{.1f}°C",        
      },

    },
    {
      type: "number",
      position: "left",
      keys: ["kwh"],
      label: {
        format: "#{.1f}kWh",
      },
    }
  ],
};

function renderer(params) {
  return `
      <div class="tooltip">
        <img src="${params.datum.url}" alt="no Image found" crossOrigin="use-credentials"/>  
        |
        ${params.datum[params.yKey]} 

      </div>
      `;
}