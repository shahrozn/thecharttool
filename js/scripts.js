/*!
 * Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
 */

let hot, theChart, editor, isNew = true;
const COLORS = {
    Gradients: {
        Blue: "linear-gradient(126deg, rgba(9,71,121,1) 35%, rgba(0,99,255,1) 100%)",
        Green: "linear-gradient(126deg, rgba(29,151,108,1) 35%, rgba(147,249,185,1) 100%)",
        Teal: "linear-gradient(126deg, rgba(34,175,171,1) 35%, rgba(161,236,251,1) 100%)",
        Orange: "linear-gradient(126deg, rgba(253,200,48,1) 35%, rgba(243,115,53,1) 100%)",
        Red: "background: linear-gradient(126deg, rgba(237,33,58,1) 35%, rgba(147,41,30,1) 100%)",
        Dark: "linear-gradient(126deg, rgba(40,40,40,1) 35%, rgba(75,75,75,1) 100%)",
        Light: "linear-gradient(126deg, rgba(236,233,230,1) 35%, rgba(255,255,255,1) 100%)"
    },
    Solids: {
        Blue: "#094779",
        Green: "#1d976c",
        Teal: "#22afab",
        Orange: "#fdc830",
        Red: "#ed213a",
        Dark: "#4b4b4b",
        Light: "#ece9e6",
        White: "#FFFFFF",
        Black: "#000000"
    }
}
window.addEventListener("DOMContentLoaded", (event) => {
    initialize();
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            document.body.classList.toggle('sb-sidenav-toggled');
        }
        sidebarToggle.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
            localStorage.setItem(
                "sb|sidebar-toggle",
                document.body.classList.contains("sb-sidenav-toggled")
            );
        });
    }
});

function initialize() {
    $('#downloadBtn').addClass('disabled');
    $('#analyzeBtn').addClass('disabled');
    $('#contentContainer').hide();
    $('#analysisResults').hide();

    const container = document.querySelector("#datagrid");
    hot = new Handsontable(container, {
        rowHeaders: true,
        colHeaders: true,
        height: "auto",
        contextMenu: true,
        fillHandle: true,
        filters: true,
        dropdownMenu: true,
        comments: true,
        licenseKey: "non-commercial-and-evaluation", // for non-commercial use only
        afterChange: (changes) => hotAfterChange(changes),
        afterPaste: (data) => pasteTrigger(data)
    });

    editor = new EditorJS({
        holder: 'analysisResults',
        minHeight: 0,
        tools: {
            header: Header,
            delimiter: Delimiter,
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            embed: Embed
        }
    });
}

/**
 * Processes the data pasted to the Data Grid
 */
function processData() {

}
/**
 * Plots chart with chart.js using the data provided
 */
function plotChart() {
    let selectedChartType = $('#chartType').val();

    if (theChart) {
        theChart.destroy(); // Destroy the existing chart if it exists
    }
    
    const ctx = document.getElementById("theChart");
    const chartData = {
        labels: [],
        datasets: [],
    };

    let hotData = hot.getData();
    if (hotData.length < 2) {
        alert("Please add at least two rows of data.");
        return;
    }
    let headerRow = hot.getColHeader();

    chartData.labels = hotData.map((row) => row[0]);

    for (let i = 1; i < headerRow.length; i++) {
        const dataset = {
            label: headerRow[i],
            data: hotData.slice(0).map((row) => row[i]),
            borderWidth: 1,
            fill: selectedChartType === "area" ? true : false
        };
        chartData.datasets.push(dataset);
    }

    const chartTheme = $('#chartTheme').val();
    const chartBackground = $('#chartBackground').val();
    const chartTitle = $('#chartTitle').val();
    const chartSubtitle = $('#chartSubtitle').val();
    const legendPosition = $('#legendPosition').val();

    const chartHeight = $('#chartHeight').val(); 
    ctx.style.height = chartHeight + "px";

    let scales = {
        x: {
            beginAtZero: true,
            grid: {
                color: chartTheme === "dark" ? "#27374D" : "#DDE6ED", // Color schemes switched with themes
                borderColor: chartTheme === "dark" ? "#27374D" : "#DDE6ED",
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: chartTheme === "dark" ? "#27374D" : "#DDE6ED", // Color schemes switched with themes
                borderColor: chartTheme === "dark" ? "#27374D" : "#DDE6ED",
            },
        },
    }

    theChart = new Chart(ctx, {
        type: selectedChartType === "area" ? "line" : selectedChartType, // Area isn't a chart type - it's just the line chart filled
        data: chartData,
        options: {
            interaction: {
                mode:'dataset'
            },
            scales: (selectedChartType === "doughnut" || selectedChartType === "pie" || selectedChartType === "polarArea") ? {} : scales,
            layout: {
                padding: 20,
            },
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    padding: {
                        top: 10,
                        bottom: 5,
                    },
                    font: {
                        size: 16,
                    },
                    color: chartTheme === "dark" ? "white" : "black",
                },
                subtitle: {
                    display: true,
                    text: chartSubtitle,
                    font: {
                        size: 14,
                    },
                    padding: {
                        top: 0,
                        bottom: 10,
                    },
                    color: chartTheme === "dark" ? "white" : "black",
                },
                legend: {
                    position: legendPosition,
                    labels: {
                        color: chartTheme === "dark" ? "white" : "black",
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            transitions: {
                show: {
                    animations: {
                        x: {from:0},
                        y: {from:0}
                    }
                },
                hide: {
                    animations: {
                        x: {to:0},
                        y: {to:0}
                    }
                },
            }
        },
    });

    if (chartTheme === "dark") {
        ctx.style.backgroundColor = "#082032";
    } else {
        ctx.style.backgroundColor = "white";
    }

    $('#analysisResults').removeClass();
    if (chartBackground == 'bg-grad-light') {
        $('#analysisResults').addClass('mt-2 text-dark');
    }
    else {
        $('#analysisResults').addClass('mt-2 text-white');
    }

    $('#contentContainer').show();
    $('#contentContainer').removeClass();
    $('#contentContainer').addClass(`rounded p-3 ${chartBackground}`);
    $('#downloadBtn').removeClass('disabled');
    $('#analyzeBtn').removeClass('disabled');

    $('#analysisResults').show();
    Toastify({
        text: `<h6>Chart plotted!</h6>
                <p><i>You can now add a basic analysis and/or download it.</i></p>`,
        duration: 5000,
        destination: "",
        newWindow: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: COLORS.Gradients.Green,
          "border-radius": "var(--bs-border-radius) !important"
        },
        escapeMarkup: false,
      }).showToast();
}

/**
 * Analyzes the data in the data grid and generates basic statistical insights
 */
function analyzeData() {
    const hotData = hot.getData();
    const insights = [];

    // Calculate basic statistics and trend analysis for each column
    for (let col = 1; col < hotData[0].length; col++) {
        const columnData = hotData.slice(1).map(row => parseFloat(row[col]));

        const columnStats = {
            column: hotData[0][col], // Column name or header
            count: columnData.length, // Number of data points
            min: Math.min(...columnData), // Minimum value
            max: Math.max(...columnData), // Maximum value
            mean: columnData.reduce((acc, val) => acc + val, 0) / columnData.length, // Mean (average)
            median: calculateMedian(columnData), // Median (middle value)
            stdDev: calculateStandardDeviation(columnData), // Standard deviation
            trend: calculateTrend(columnData), // Trend analysis
        };

        insights.push(columnStats);
    }

    const summary = insights.map(columnStats => {
        const trendStatement = columnStats.trend;

        return `&#8594; "${columnStats.column}" has a high of ${columnStats.max.toFixed(2)}, a low of ${columnStats.min.toFixed(2)}, and a mean of ${columnStats.mean.toFixed(2)}. It also has a median of ${columnStats.median.toFixed(2)}, a standard deviation of ${columnStats.stdDev.toFixed(2)}, and ${trendStatement}.`;
    });
    console.log(summary);
    
    editor.blocks.insert('header',{
        text: 'Insights',
        level: 3
    });
    for (item of summary) {
        editor.blocks.insert('paragraph', {
            text: item,
            alignment: 'left'
        });
    }
    editor.save().then((outputData) => {
        console.log('Article data: ', outputData)
        editor.render(outputData);
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });

    $('#analysisResults').show();
    Toastify({
        text: `<h6>Analysis added!</h6>
                <p><i>Please note that the analysis may not be accurate.</i></p>`,
        duration: 5000,
        destination: "",
        newWindow: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: COLORS.Gradients.Green,
          "border-radius": "var(--bs-border-radius) !important"
        },
        escapeMarkup: false,
      }).showToast();
}

/**
 * Calculates the median of the provided array
 * @param {Array} arr Array which contains the data for which the median is required 
 * @returns Returns the median value
 */
function calculateMedian(arr) {
    const sortedArr = [...arr].sort((a, b) => a - b);
    const middle = Math.floor(sortedArr.length / 2);

    if (sortedArr.length % 2 === 0) {
        return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
    } else {
        return sortedArr[middle];
    }
}

/**
 * Calculates the standard deviation of the provided array
 * @param {Array} arr Array which contains the data for which the standard deviation is required 
 * @returns Returns the standard deviation
 */
function calculateStandardDeviation(arr) {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    const squaredDifferences = arr.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(variance);
}

/**
 * Uses linear regression to calculate the trend of the provided array
 * @param {Array} arr Array which contains the data for which the trend is required 
 * @returns Returns a statement describing the trend of data
 */
function calculateTrend(arr) {
    const n = arr.length;
    if (n === 0) return 'N/A';

    const data = arr.map((value, index) => [index + 1, value]);
    const trendResult = ss.linearRegression(data);
    console.log(trendResult);
    const slope = trendResult.m;

    if (slope > 0.05) {
        return 'there is a strong upward trend';
    } else if (slope > 0) {
        return 'there is an upward trend';
    } else if (slope < -0.05) {
        return 'there is a strong downward trend';
    } else if (slope < 0) {
        return 'there is a downward trend';
    } else {
        return 'there is no clear trend';
    }
}

/**
 * Downloads chart in png format
 */
function downloadChart() {
    const chartCanvas = document.getElementById("contentContainer");

    domtoimage.toBlob(chartCanvas).then(function (blob) {
        window.saveAs(blob, "chart.png");
    });
}

/**
 * Adds randomly generated numbers in the data grid
 */
function addDummyData() {
    let dummyData = [
        ['Time', 'Type A', 'Type B', 'Type C', 'Type D'],
        ['Monday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
        ['Tuesday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
        ['Wednesday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
        ['Thursday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
        ['Friday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
        ['Saturday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
        ['Sunday', Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
    ]
    hot.loadData(dummyData);
    Toastify({
        text: `<h6>Dummy data added!</h6>`,
        duration: 5000,
        destination: "",
        newWindow: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: COLORS.Gradients.Light,
          color: COLORS.Solids.Dark
        },
        escapeMarkup: false,
      }).showToast();
    updateHeaders();
}

function hotAfterChange(changes) {
    //console.log(`hot changed: `,changes);
}

function updateHeaders() {
    let newHeaders = hot.getData()[0];
    hot.updateSettings({
        colHeaders: newHeaders
    });
    hot.alter('remove_row', 0, 1);
    Toastify({
        text: `<h6>Headers updated!</h6>`,
        duration: 5000,
        destination: "",
        newWindow: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: COLORS.Gradients.Green,
        },
        escapeMarkup: false,
      }).showToast();
}

/**
 * Triggers whenever content is pasted on the Data Grid. 
 */
function pasteTrigger(data) {
    if($('#autoHeaderUpdateCheck').is(':checked')){
        updateHeaders();
        Toastify({
            text: `<h6>Data pasted!</h6>`,
            duration: 5000,
            destination: "",
            newWindow: true,
            gravity: "bottom", 
            position: "right", 
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: COLORS.Gradients.Blue,
            },
            escapeMarkup: false,
          }).showToast();
    }
    else {
        Toastify({
            text: `<h6>Data pasted!</h6>
                    <p>Click below to update the headers!</p>
                    <a onclick="updateHeaders()" class="btn btn-sm btn-outline-light">Update</a>`,
            duration: 5000,
            destination: "",
            newWindow: true,
            gravity: "bottom", 
            position: "right", 
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: COLORS.Gradients.Blue,
            },
            escapeMarkup: false,
          }).showToast();
    }
}

/**
 * Triggers on the width adjustment in visual options. 
 */
function onChartWidthChange(value) {
    $('#contentColumn').removeClass();
    $('#contentColumn').addClass(`col-${value}`);
}

/**
 * Triggers on chart type adjustment in visual options. 
 */
function onChartTypeChange(value) {

    // Currently used to provide recommendations for optimal legend placement. Can be further enhanced.
    switch (value) {
        case "line":
            $('#legendRecommendation').text('Recommended: Top/Bottom');
            break;
        case "bar":
            $('#legendRecommendation').text('Recommended: Top/Bottom');
            break;
        case "area":
            $('#legendRecommendation').text('Recommended: Top/Bottom');
            break;
        case "doughnut":
            $('#legendRecommendation').text('Recommended: Left/Right');
            break;
        case "pie":
            $('#legendRecommendation').text('Recommended: Left/Right');
            break;
        case "polarArea":
            $('#legendRecommendation').text('Recommended: Left/Right');
            break;
    
        default:
            break;
    }
}