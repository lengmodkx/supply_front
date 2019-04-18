<template>
    <div class="box">
        <header class="top-header">
            <span>{{title}}</span>
            <Icon @click="close" type="md-close" size="22"/>
        </header>
        <div class="contents">
            <div class="w900">
                <div class="tu">
                    <div id="chart1"></div>
                </div>
                <div class="biao">
                    <h2>详情表</h2>
                    <Table border :columns="columns1" :data="data1"></Table>
                </div>
            </div>
        </div>
        <!--按条件查询-->
        <div class="filter-box">
            <p>按任务完成情况</p>
            <RadioGroup v-model="finished" vertical>
                <Radio label="全部"></Radio>
                <Radio label="已完成"></Radio>
                <Radio label="未完成"></Radio>
            </RadioGroup>
            <p>执行者</p>
            <Select v-model="people" style="width:200px" placeholder="全部">
                <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <p>任务分组</p>
            <Select v-model="people" style="width:200px" placeholder="所有任务分组">
                <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div style="margin-top: 20px">
                <Button type="info" long>确定</Button>
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
    // import exportCSV from '@/libs/export-csv.js'
    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    Highmaps(Highcharts);
    // exportCSV(Highcharts);
    export default {
        data: function () {
            return {
                title: '',
                color:['#0DA9F5','#8BDC76','#FF7969','#A0A3D6','#FFC669'],
                finished: '全部',
                people: '',
                peopleList: [
                    {
                        value: '全部',
                        label: '全部'
                    },
                    {
                        value: '亚索',
                        label: '亚索'
                    },
                    {
                        value: '泰隆',
                        label: '泰隆'
                    },
                ],
                columns1: [
                    {
                        title: '执行者',
                        key: 'zxz'
                    },
                    {
                        title: '任务数',
                        key: 'rws'
                    }
                ],
                data1: [
                    {
                        zxz: 'John Brown',
                        rws: 18,
                    },
                    {
                        zxz: 'Jim Green',
                        rws: 24,
                    },
                    {
                        zxz: 'Joe Black',
                        rws: 30,
                    },
                    {
                        zxz: 'Jon Snow',
                        rws: 26,
                    }
                ]
            }
        },
        mounted() {
            this.title=this.$route.query.title
            console.log(this.$route.query)
           this.initChart1()
        },
        methods: {
            initChart1(){
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
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            showInLegend: true,
                            dataLabels: {
                                enabled: false,
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
                        data: [{
                            name: '待认领',
                            y: 40,
                        }, {
                            name: '李健',
                            y: 30
                        }, {
                            name: '何少华',
                            y: 30
                        }]
                    }]
                });
            },
            initChart2(){
                Highcharts.chart('chart2',{
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
                        categories: [
                            '李健','何少华','待认领'
                        ],
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
                        data: [12, 14, 10]
                    }]
                });
            },
            initChart4(){
                Highcharts.chart('chart4', {
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false     //不显示LOGO
                    },
                    xAxis: {
                        categories: [
                            '4月1','4月2','4月3','4月4','4月5','4月6','4月7','4月8'
                        ],
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
                        data: [50, 40, 30, 20, 15, 10, 5, 0]
                    }, {
                        name: '实际剩余任务数',
                        data: [50, 50, 45, 40, 35, 30, 25, 10]
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
            initChart5(){
                Highcharts.chart('chart5', {
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false     //不显示LOGO
                    },
                    xAxis: {
                        categories: [
                            '4月1','4月2','4月3','4月4','4月5','4月6','4月7','4月8'
                        ],
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
                        data: [2, 4, 4, 4, 6, 6, 8, 10]
                    }, {
                        name: '累计完成任务总数',
                        data: [0, 0, 1, 3, 3, 5, 6, 7]
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
            close(){
                this.$router.push(localStorage.statisticsRouter)
            }
        }
    }
</script>
<style socped lang="less">
.box{
    width: 100%;
    padding: 76px 0 0 20px;
    background-color: #F5F5F4;
}
.top-header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    height: 56px;
    box-shadow: 0 1px 3px rgba(0,0,0,.15);
    background-color: white;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    i{
        cursor: pointer;
        &:hover{
            color: #3da8f5;
        }
    }
}
.contents{
    width: 1250px;
    margin: 0 auto;
}
.w900{
    width: 900px;
    padding-bottom: 20px;
    .tu{
        width: 100%;
        height: 400px;
        background-color: white;
        border: 1px solid #e5e5e5;
    }
    .biao{
        width: 100%;
        margin-top: 20px;
        background-color: white;
        border:1px solid #e5e5e5;
        h2{
            width: 100%;
            height: 48px;
            font-size: 14px;
            text-align: center;
            line-height: 48px;
        }
    }
}
.filter-box{
    width: 320px;
    height: calc(100vh - 100px) ;
    background-color: white;
    border-radius: 5px;
    border:1px solid #e5e5e5;
    position: fixed;
    top: 76px;
    right: calc((100vw - 1250px)/2) ;
    padding: 16px;
    p{
        line-height: 24px;
        padding: 10px 0;
        font-size: 14px;
        color: gray;
    }
}
</style>