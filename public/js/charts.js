var charting = function(response) {
    var parseDate = d3.time.format("%Y/%m/%d %S:%U").parse;

    var data = response.data;
    var ndx = crossfilter(data);
    var all = ndx.groupAll();


    /*** Prepare Data ***/
    data.forEach(function(d) {
      d.dateTime = parseDate(d.dateTime);
    })

    data.forEach(function(d) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        d.month=monthNames[d.dateTime.getMonth()];
    });
    /*** End Prepare Data ***/

    /*** Prepare Dimensions ***/
    var dateDim = ndx.dimension(function(d) {
      return d.dateTime;
    });

    var monthDimension = ndx.dimension(function (d) {
        return d.month;
    });

    var yearDim = ndx.dimension(function(d) {
        return d.dateTime.getFullYear();
    })

    var atmosphericPressureDim = ndx.dimension(function (d) {
        return d.atmosphericPressureMBar;
    });

    var rainfallDim = ndx.dimension(function (d) {
        return d.rainfallMM;
    });

    var windspeedDim = ndx.dimension(function(d) {
        return d.windSpeedMS;
    })

    var surfaceTempDim = ndx.dimension(function(d) {
        return d.surfaceTemperatureC;
    })
    /*** End Prepare Dimensions ***/

    /*** Create Date Boundaries ***/
    var minDate = dateDim.bottom(1)[0].dateTime;
    var maxDate = dateDim.top(1)[0].dateTime;
    /*** End Create Date Boundaries ***/

    /*** Prepare Groups ***/
    var atmosphericPressureGroup = atmosphericPressureDim.group();
    var yearGroup = yearDim.group();
    var rainfallGroup = dateDim.group().reduceSum(dc.pluck('rainfallMM'));
    var monthGroup = monthDimension.group();
    var windspeedGroup = dateDim.group().reduceSum(dc.pluck('windSpeedMS'));
    var surfaceTempGroup = dateDim.group().reduceSum(dc.pluck('surfaceTemperatureC'));

    /*** End Prepare Dimensions ***/

    /*** Initiate Selectors ***/
    var yearlyBubbleChart = dc.bubbleChart("#yearly-bubblechart")
    var yearlyPieChart = dc.pieChart("#yearly-piechart")
    var lineChart = dc.barChart("#line-chart")
    var monthChart = dc.rowChart("#months-chart");
    var stackedLineChart = dc.lineChart("#stacked-line-chart");
    /*** End Initiate Selectors ***/


    yearlyBubbleChart
       .width(700)
       .height(300)
       .transitionDuration(1500) // (optional) define chart transition duration, :default = 750
       .margins({top: 10, right: 50, bottom: 30, left: 40})
       .dimension(monthDimension)
       .group(atmosphericPressureGroup)
       .colorAccessor(function (d) {
         return d.value / 100
       })
       .keyAccessor(function (p) {
         return p.value
       })
       .valueAccessor(function (p) {
         return p.value
       })
       .radiusValueAccessor(function (p) {
         return p.value
       })
       .maxBubbleRelativeSize(0.1)
       .x(d3.time.scale().domain([minDate,maxDate]))
       .y(d3.scale.linear().domain([0, 5000]))
       .r(d3.scale.linear().domain([0, 4000]))
       //##### Elastic Scaling
       .elasticY(true)
       .elasticX(true)
       .yAxisPadding(100)
       .xAxisPadding(500)
       .renderHorizontalGridLines(true)
       .renderVerticalGridLines(true)
       .xAxisLabel('Date')
       .yAxisLabel('Atmospheric Pressure (MBars)')
       .renderLabel(true)
       .label(function (p) {
         return p.key;
       })
       .renderTitle(true)
       .title(function (p) {
           return [p.key]
       })
       .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"])

    yearlyPieChart
        .width(350).height(350)
        .dimension(yearDim)
        .group(yearGroup)
        .innerRadius(80)
        .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"])

    lineChart
        .width(900)
        .height(350)
        .dimension(dateDim)
        .group(rainfallGroup)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .xAxisLabel("Time")
        .yAxisLabel("Rainfall (mm)")
        .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"])

      monthChart.width(80)
          .height(330)
          .width(200)
          .margins({top: 20, left: 10, right: 10, bottom: 20})
          .group(monthGroup)
          .dimension(monthDimension)
          .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"])
          .label(function (d) {
              return d.key;
          })
          // title sets the row text
          .title(function (d) {
              return d.key;
          })
          .elasticX(true)
          .xAxis().ticks(2);

        stackedLineChart
    				.width(1200).height(350)
    				.dimension(dateDim)
    				.group(windspeedGroup, "Windspeed")
    				.stack(surfaceTempGroup, "Surface Temp")
    				.x(d3.time.scale().domain([minDate,maxDate]))
    				.renderArea(true)
    				.xAxisLabel("Time")
    				.yAxisLabel("Windspeed vs Surface Temp")
    				.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
    			  .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"]);

    dc.renderAll();
}
