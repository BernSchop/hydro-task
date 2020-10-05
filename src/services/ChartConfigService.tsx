import { ChartItem, SelectOption } from '../models/ChartModel';

export default {

    _setChartConfig: (chartData: ChartItem[], selectedData: SelectOption) => {
        const dataActual: number[][] = chartData.map((item: ChartItem) => {
            return [item.timestamp, item.actual];
        });
        const dataPlan: number[][] = chartData.map((item: ChartItem) => {
            return [item.timestamp, item.plan];
        });

        const dataEfficiency: number[][] = chartData.map((item: ChartItem) => {
            return [item.timestamp, item.efficiency];
        });

        const dataMin: number[][] = chartData.map((item: ChartItem) => {
            if (item == chartData[chartData.length - 1]) {
                return [item.timestamp, Number(item.minimum.toFixed(2))]
            }
        }).filter(i => i!!);

        const dataMax: number[][] = chartData.map((item: ChartItem) => {
            if (item == chartData[chartData.length - 1]) {
                return [item.timestamp, Number(item.maximum.toFixed(2))]
            }
        }).filter(i => i!!);

        return {
            title: {
                text: selectedData ? selectedData.label : 'Chart',
            },
            chart: {
                zoomType: 'x'
            },
            tooltip: {
                shared: true,
                zIndex: 99999,
                followPointer: true,
                backgroundColor: 'rgba(0,0,0,0.80)',
                valueDecimals: 2,
                style: {
                    color: '#ffffff',
                    fontSize: '10px'
                },
                pointFormat: '<span style="color:{point.color}">▉' +
                    '</span> {series.name}: <b>{point.y}</b><br/>'
            },
            plotOptions: {
                series: {
                    pointerPlacement: 'on',
                    cursor: 'pointer',
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            xAxis: [{
                type: 'datetime',
                label: {
                    format: '{value: %MMM %d, %yyyy}'
                },
                zoomEnabled: true,
                lineColor:'#e8e8e8',
                crosshair: {
                    zIndex: 9999,
                    dashStyle: 'dash',
                    lineWidth: 4,
                    color: '#333'
                },
                min: chartData[0].timestamp,
                max: chartData[chartData.length - 1].timestamp
            }],
            yAxis: [{
                tickmarkPlacement: 'on',
                lineColor:'#e8e8e8',
                startOnTick: true,
                lineWidth: 1,
                title: {
                    text: 'Efficiency %',
                    style: {
                        color: '#ad1265'
                    }
                },
                tickInterval: 10,
                tickAmount: 11,
                opposite: true,
                max: 100,
                gridLineWidth: 0,
                labels: {
                    style: {
                        color: '#ad1265'
                    },

                }
            },
                {
                    title: {
                        text: 'MW'
                    },
                    lineWidth: 1,
                    tickInterval: 0.2,
                    tickAmount: 8,
                    gridLineWidth: 0,
                    lineColor:'#e8e8e8',
                    plotLines: [{
                        value: dataMax[0][1],
                        color: '#4a5860',
                        width: 1,
                        dashStyle: 'dash',
                        zIndex: 999
                    }, {
                        value: dataMin[0][1],
                        color: '#4a5860',
                        width: 1,
                        dashStyle: 'dash',
                        zIndex: 999
                    }]
                },
            ],
            legend: {
                backgroundColor: 'rgba(255,255,255,0.80)'
            },
            series: [
                {
                    name: 'Plan',
                    type: 'column',
                    yAxis: 1,
                    data: dataPlan,
                    color: '#ccd2d5'
                },
                {
                    name: 'Actual',
                    type: 'column',
                    yAxis: 1,
                    data: dataActual,
                    color: '#0bb7a0'
                },
                {
                    name: 'Efficiency',
                    type: 'line',
                    data: dataEfficiency,
                    color: '#ad1265'
                },
                {
                    name: 'Min',
                    yAxis: 1,
                    type: 'column',
                    data: dataMin,
                    color: 'transparent',
                    showInLegend: false,
                    dataLabels: [{
                        enabled: true,
                        format: '<div style="width: 120px; ' +
                            'height: 20px; ' +
                            'overflow: hidden;' +
                            'color: #4a5860;  ' +
                            'margin-top: 8px;'+
                            'display: flex; align-items: center;' +
                            'background: #ffffff;">' +
                            '<span>' +
                            `Minimum Power ${dataMin[0][1]}` +
                            '</span>' +
                            '</div>',
                        useHTML: true,
                        align: 'left',
                        verticalAlign: 'bottom'
                    }]
                }, {
                    name: 'Max',
                    yAxis: 1,
                    type: 'column',
                    data: dataMax,
                    color: 'transparent',
                    showInLegend: false,
                    dataLabels: [{
                        zIndex: 999,
                        enabled: true,
                        format: '<div style="width: 120px; ' +
                            'height: 20px; ' +
                            'overflow: hidden;' +
                            ' color: #4a5860;' +
                            'display: flex; align-items: center;' +
                            'background: #ffffff;">' +
                            '<span>' +
                            `Maximum Power ${dataMax[0][1]}` +
                            '</span>' +
                            '</div>',
                        useHTML: true,
                        align: 'left',
                        verticalAlign: 'top'
                    }]
                },
            ]
        }

    },

    _changeTheme: (theme: string, chartConfig: any): void => {
        switch (theme) {
            case 'Hydro':
                chartConfig.series[1].color = '#0bb7a0';
                chartConfig.series[2].color = '#ad1265';
                chartConfig.yAxis[0].title.style.color = '#ad1265';
                chartConfig.yAxis[0].labels.style.color = '#ad1265';
                break;
            case 'Randy':
                chartConfig.series[1].color = '#4FD1A9';
                chartConfig.series[2].color = '#49B9DE';
                chartConfig.yAxis[0].title.style.color = '#49B9DE';
                chartConfig.yAxis[0].labels.style.color = '#49B9DE';
                break;
            default:
                chartConfig.series[1].color = '#0bb7a0';
                chartConfig.series[2].color = '#ad1265';
                break;
        }
        return chartConfig;
    }
}