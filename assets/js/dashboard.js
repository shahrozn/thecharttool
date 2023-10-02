/*!
 * Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
 */

//Handsontable, Chart JS, Editor JS, isNew (flag for first execution/plotting - not used at the moment)
let hot, theChart, editor, chartHeader, isNew = true;

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
    $('#contentRow').hide();
    $('#analysisResults').hide();
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
      });

    const container = document.querySelector("#datagrid");
    initializeHOT(container);
    initializeEditorJS();
}

/** Initialize Handsontable Module
 * Initialize Handsontable Module ~ All configuration of HOT to be done here.
 * @param {Object} container #datagrid element 
 */
function initializeHOT(container) {
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
}

/** Initialize Editor JS Module
 * Initialize Editor JS Module ~ All configuration of editor js to be done here.
 */
function initializeEditorJS() {
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
    chartHeader = new EditorJS({
        holder: 'chartHeader',
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
    })
}

/** Process Data (Datagrid)
 * Processes the data pasted to the Data Grid
 */
function processData() {

}
/** Plot Chart
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
    const spanGaps = $('#spanGapsCheck').is(':checked');

    const chartHeight = $('#chartHeight').val(); 
    ctx.style.height = chartHeight + "px";

    updateChartHeaders(chartTitle, chartSubtitle);

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
            },
            spanGaps: spanGaps
        },
    });

    if (chartTheme === "dark") {
        ctx.style.backgroundColor = "#082032";
    } else {
        ctx.style.backgroundColor = "white";
    }

    $('#chartHeader').removeClass();
    $('#analysisResults').removeClass();
    if (chartBackground == 'bg-grad-light') {
        $('#analysisResults').addClass('mt-2 text-dark');
        $('#chartHeader').addClass('text-dark');
    }
    else {
        $('#analysisResults').addClass('mt-2 text-light');
        $('#chartHeader').addClass('text-light');
    }

    $('#contentRow').show();
    $('#contentContainer').removeClass();
    $('#contentContainer').addClass(`rounded p-3 ${chartBackground}`);
    $('#downloadBtn').removeClass('disabled');
    $('#analyzeBtn').removeClass('disabled');

    $('#analysisResults').show();
    toast(
        `<h6 class="text-white">Chart plotted!</h6>
                <p><i>You can now add a basic analysis and/or download it.</i></p>`,
                COLORS.Gradients.Green,
                5000
    )
}

function updateChartHeaders(chartTitle, chartSubtitle) {
    if(chartHeader.blocks) {
        chartHeader.blocks.delete[0]
    };
    
    if(chartTitle == "")
        chartTitle = "Data Plot"
    chartHeader.blocks.insert('header',{
        text: chartTitle,
        level: 3
    });
    if(chartSubtitle != "") {
        chartHeader.blocks.insert('header',{
            text: chartSubtitle,
            level: 5
        });
    }
    
    chartHeader.save().then((outputData) => {
        chartHeader.render(outputData);
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}

/**
 * Analyzes the data in the data grid and generates basic statistical insights
 */
function analyzeData() {
    const hotData = hot.getData();
    const headers = hot.getColHeader();
    const insights = [];

    // Calculate basic statistics and trend analysis for each column
    for (let col = 1; col < hotData[0].length; col++) {
        const columnData = hotData.slice(1).map(row => parseFloat(row[col]));

        const columnStats = {
            column: headers[col], // Column name or header
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
        level: 4
    });
    for (item of summary) {
        editor.blocks.insert('paragraph', {
            text: item,
            alignment: 'left'
        });
    }
    editor.save().then((outputData) => {
        //console.log('Article data: ', outputData)
        editor.render(outputData);
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });

    $('#analysisResults').show();
    toast(
        `<h6 class="text-white">Analysis added!</h6>
        <p><i>Please note that the analysis may not be accurate.</i></p>`,
        COLORS.Gradients.Green,
        5000
    );
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
    toast('<h6>Dummy data added!</h6>', COLORS.Gradients.Light, 5000);
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
    toast('<h6 class="text-white">Headers Updated!</h6>', COLORS.Gradients.Blue, 5000);
}

/**
 * Triggers whenever content is pasted on the Data Grid. 
 */
function pasteTrigger(data) {
    if($('#autoHeaderUpdateCheck').is(':checked')){
        updateHeaders();
        toast('<h6>Data pasted!</h6>', COLORS.Gradients.Blue, 5000);
    }
    else {
        let toastMessage = `<h6 class="text-white">Data pasted!</h6>
        <p class="text-white">Click below to update the headers!</p>
        <a onclick="updateHeaders()" class="btn btn-sm btn-outline-light">Update</a>`
        toast(toastMessage, COLORS.Gradients.Blue, 5000);
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

/** Toast Message
 * Displays a toast notification based on information and details provided.
 * @param {string} message Contents of toast message in string (can be HTML)
 * @param {COLORS} color Background color selected from COLORS.Gradients or COLORS.Solids.  
 * @param {*} duration Duration in ms before the toast fades away.
 */
function toast(message, color, duration) {
    Toastify({
        text: message,
        duration: duration,
        destination: "",
        newWindow: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: color,
          color: (color == COLORS.Gradients.Light) ? COLORS.Solids.Black : COLORS.Solids.White,
          'border-radius': "7.5px"
        },
        escapeMarkup: false,
      }).showToast();
}