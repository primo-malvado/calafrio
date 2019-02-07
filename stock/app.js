var chart = am4core.create("chartdiv", am4charts.XYChart);
var dataSort;

// using Promise
fetch("32.json")
    .then(response => response.json())
    .then(parsed => {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        chart.paddingRight = 20;

        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        var series = chart.series.push(new am4charts.CandlestickSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "close";
        series.dataFields.openValueY = "open";
        series.dataFields.lowValueY = "low";
        series.dataFields.highValueY = "high";
        series.simplifiedProcessing = true;
        series.tooltipText = "Open: {openValueY.value}\nLow: {lowValueY.value}\nHigh: {highValueY.value}\nClose:${valueY.value}";

        chart.cursor = new am4charts.XYCursor();

        // a separate series for scrollbar
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.dateX = "date";
        lineSeries.dataFields.valueY = "high";
        

        // Add a bullet
        var bullet = lineSeries.bullets.push(new am4charts.Bullet());

        // Add a triangle to act as am arrow
        var arrow = bullet.createChild(am4core.Triangle);
        arrow.horizontalCenter = "middle";
        arrow.verticalCenter = "middle";
        arrow.strokeWidth = 0;
        arrow.fill = chart.colors.getIndex(0);
        arrow.direction = "bottom";
        arrow.width = 12;
        arrow.height = 12;

 
        
        // need to set on default state, as initially series is "show"
        lineSeries.defaultState.properties.visible = true;
        lineSeries.hiddenInLegend = true;
        lineSeries.strokeOpacity = 0.0;
        lineSeries.fillOpacity = 0.0;
 
 
 
 /**/

        // a separate series for scrollbar
        var lineSeriesLow = chart.series.push(new am4charts.LineSeries());
        lineSeriesLow.dataFields.dateX = "date";
        lineSeriesLow.dataFields.valueY = "low";
        

        // Add a bullet
        var bullet = lineSeriesLow.bullets.push(new am4charts.Bullet());

        // Add a triangle to act as am arrow
        var arrow = bullet.createChild(am4core.Triangle);
        arrow.horizontalCenter = "middle";
        arrow.verticalCenter = "middle";
        arrow.strokeWidth = 0;
        arrow.fill = chart.colors.getIndex(1);
        arrow.direction = "top";
        arrow.width = 12;
        arrow.height = 12;

 
        
        // need to set on default state, as initially series is "show"
        lineSeriesLow.defaultState.properties.visible = true;
        lineSeriesLow.hiddenInLegend = true;
        lineSeriesLow.strokeOpacity = 0.0;
        lineSeriesLow.fillOpacity = 0.0;
 
 
/*
 */
 
 
 
 
 
        
        var scrollbarX = new am4charts.XYChartScrollbar();  
        scrollbarX.series.push(lineSeries);
        chart.scrollbarX = scrollbarX;


        var data = parsed.Candles[0].Candles.map(function(item) {
            return {
                "date": item.FromDate /*.substring(0, 10)*/ ,
                "open": item.Open,
                "high": item.High,
                "low": item.Low,
                "close": item.Close,
            };

        });




            dataSort = data.sort(function(a, b) {
            return a.date > b.date ? 1 : -1;
        });

        for (var i = 2; i < dataSort.length - 2; i++) {

            if (dataSort[i].high > dataSort[i-1].high && dataSort[i].high > dataSort[i + 1].high 
                    && dataSort[i].high > dataSort[i-2].high && dataSort[i].high > dataSort[i + 2].high
                    ) {
                dataSort[i].top = true
            } else {
                dataSort[i].top = false
            }

            if (dataSort[i].low < dataSort[i - 1].low && dataSort[i].low < dataSort[i + 1].low 
                    && dataSort[i].low < dataSort[i - 2].low && dataSort[i].low < dataSort[i + 2].low
                        ) {
                dataSort[i].down = true
            } else {
                dataSort[i].down = false;
            }
        }



        var dataFilter = dataSort
        /*.filter(function (item, idx) {
                                    return idx > 600
                                })
                                */
        ;



        chart.data = dataFilter;
/*

        lineSeriesLow.data = dataFilter.filter(function (item, idx) {
                                    return item.down === true
                                })

        lineSeries.data = dataFilter.filter(function (item, idx) {
                                    return item.top === true
                                })
*/
    });