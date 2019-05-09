<template>
    <div class="statistics-wrap">
        <div class="statistics">
            <div class="statistics-title">项目统计</div>
            <div class="statistics-con">
                <div class="charts-lsit">
                    <div @click="goDetail(1,'按任务执行者分布')" class="charts-title">按任务执行者分布</div>
                    <div id="chart1" class="charts-con"></div>
                </div>
                <div class="charts-lsit">
                    <div  @click="goDetail(2,'近期完成的任务')" class="charts-title">近期完成的任务</div>
                    <div id="chart2" class="charts-con"></div>
                </div>
                <div class="charts-lsit">
                    <div  @click="goDetail(3,'概览报表')" class="charts-title">概览报表</div>
                    <div id="chart3" class="charts-con">
                        <div class="chart3-wrap">
                            <div class="chart3-list" v-for="item in chartData4">
                                <p>{{item.value }}</p>
                                <div class="num">{{item.label }}</div>
                                <Progress :stroke-color="color[Math.floor(Math.random()*5.1)]" :percent="75" hide-info :stroke-width=5 />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="charts-lsit">
                    <div  @click="goDetail(4,'任务燃尽图')" class="charts-title">任务燃尽图</div>
                    <div id="chart4" class="charts-con"></div>
                </div>
                <div class="charts-lsit">
                    <div  @click="goDetail(5,'项目进展走势图')" class="charts-title">项目进展走势图</div>
                    <div id="chart5" class="charts-con"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import HighchartsDrilldown from 'highcharts/modules/drilldown';
    import Highcharts3D from 'highcharts/highcharts-3d';
    import Highmaps from 'highcharts/modules/map';
    import  { getPieDate }  from "../../../axios/statisticApi.js";
    // import exportCSV from '@/libs/export-csv.js'
    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    Highmaps(Highcharts);
    // exportCSV(Highcharts);


        export default {
            data: function () {
                return {
                    color: ['#0DA9F5', '#8BDC76', '#FF7969', '#A0A3D6', '#FFC669'],
                    chartData1: [],
                    staticData:[],
                    chartData4:[]
                }
            },
            mounted() {
                getPieDate(this.$route.params.id).then(res => {
                    this.chartData1 = res.pieData;
                    this.chartData2 = res.staticHistogram.nameArray
                    this.chartData3 = res.staticHistogram.dataArray
                    this.chartData4 = res.countData;

                    this.chartEveryDate1 = res.statisticsBurnout.everyDate
                    this.chartTrueTask = res.statisticsBurnout.trueTask
                    this.chartIdealTask = res.statisticsBurnout.idealTask
                    this.cumulativeTask = res.statisticsBurnout.cumulativeTask
                    this.completionTask = res.statisticsBurnout.completionTask
                    this.initChart1(this.chartData1);
                    this.initChart2(this.chartData2,this.chartData3);
                    this.initChart4(this.chartEveryDate1,this.chartTrueTask,this.chartIdealTask);
                    this.initChart5(this.chartEveryDate1,this.cumulativeTask,this.completionTask);
                })
            },
            methods: {
                initChart1(data) {
                        console.log(this.chartData1)
                        Highcharts.chart('chart1', {
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: 'pie'
                            },
                            credits: {
                                enabled: false     //不显示LOGO
                            },
                            title: {
                                text: null
                            },
                            tooltip: {
                                // 鼠标移入 显示的提示
                                pointFormat: '任务比重: <b>{point.percentage:.1f}%</b>'

                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        style: {
                                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                        }
                                    }
                                }
                            },
                            series: [{
                                name: '任务数',
                                colorByPoint: true,
                                data: data
                            }]
                        });
                },
                initChart2(data2,data3) {
                        Highcharts.chart('chart2', {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: null
                            },
                            credits: {
                                enabled: false     //不显示LOGO
                            },
                            xAxis: {
                                categories: data2,
                                crosshair: false
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: '任务数'
                                }
                            },
                            tooltip: {
                                // shared: false,
                                // useHTML: false
                            },
                            plotOptions: {
                                column: {
                                    borderWidth: 0
                                }
                            },
                            series: [{
                                name: '任务数',
                                data: data3
                            }]
                        });
                },
                initChart4(everyDate1,trueTask,idealTask) {
                        Highcharts.chart('chart4', {
                            title: {
                                text: null
                            },
                            credits: {
                                enabled: false     //不显示LOGO
                            },
                            xAxis: {
                                categories: everyDate1,
                                crosshair: false
                            },
                            yAxis: {
                                title: {
                                    text: '任务数'
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle'
                            },
                            // plotOptions: {
                            //     series: {
                            //         label: {
                            //             connectorAllowed: false
                            //         },
                            //         pointStart: 2010
                            //     }
                            // },
                            series: [{
                                name: '理想剩余任务数',
                                data: idealTask
                            }, {
                                name: '实际剩余任务数',
                                data: trueTask
                            }],
                            responsive: {
                                rules: [{
                                    condition: {
                                        maxWidth: 500
                                    },
                                    chartOptions: {
                                        legend: {
                                            layout: 'horizontal',
                                            align: 'center',
                                            verticalAlign: 'bottom'
                                        }
                                    }
                                }]
                            }
                        });
                },
                initChart5(everyDate2,cumulativeTask,completionTask) {
                        Highcharts.chart('chart5', {
                            title: {
                                text: null
                            },
                            credits: {
                                enabled: false     //不显示LOGO
                            },
                            xAxis: {
                                categories: everyDate2,
                                crosshair: false
                            },
                            yAxis: {
                                title: {
                                    text: '任务数'
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle'
                            },
                            // plotOptions: {
                            //     series: {
                            //         label: {
                            //             connectorAllowed: false
                            //         },
                            //         pointStart: 2010
                            //     }
                            // },
                            series: [{
                                name: '累计任务总数',
                                data: cumulativeTask
                            }, {
                                name: '累计完成任务总数',
                                data: completionTask
                            }],
                            responsive: {
                                rules: [{
                                    condition: {
                                        maxWidth: 500
                                    },
                                    chartOptions: {
                                        legend: {
                                            layout: 'horizontal',
                                            align: 'center',
                                            verticalAlign: 'bottom'
                                        }
                                    }
                                }]
                            }
                        });
                },
                goDetail(type, title) {
                    localStorage.statisticsRouter = this.$route.fullPath
                    this.$router.push({
                        path: '/statisticsDetail',
                        query: {
                            type: type,
                            title: title,
                            id:this.$route.params.id
                        }
                    })
                }
            }

    }


</script>
<style socped lang="less">
    .project-main{
        overflow: auto !important;
    }
    .statistics-wrap{
        padding-top: 78px;
        width: 100%;
        padding-bottom: 30px;
        background-color: #F5F5F4;
        .statistics{
            width: 1200px;
            margin: 0 auto;
            .statistics-title{
                width: 100%;
                height: 48px;
                line-height: 40px;
                font-size: 16px;
            }
            .statistics-con{
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
            }
        }
    }
    .charts-lsit{
        width: 590px;
        height: 340px;
        border-radius: 4px;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        margin-bottom: 20px;
        .charts-title{
            width: 100%;
            height: 50px;
            border-bottom: 1px solid #e5e5e5;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            color: #a6a6a6;
            cursor: pointer;
            &:hover{
                color: #3da8f5;
            }
        }
        .charts-con{
            width: 100%;
            height: 290px;
        }
    }
    .chart3-wrap{
        width: 100%;
        height: 100%;
        padding: 32px 50px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .chart3-list{
            width: 104px;
            height: 88px;
            margin-bottom: 24px;
            padding: 12px;
            p{
                font-size: 12px;
                color: #a6a6a6;
            }
            .num{
                height: 32px;
                line-height: 32px;
                font-size: 28px;
                font-weight: 600;
            }
        }
    }
</style>