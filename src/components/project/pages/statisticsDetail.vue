<template>
    <div class="box">
        <header class="top-header">
            <span>{{title}}</span>
            <Icon @click="close" type="md-close" size="22"/>
        </header>
        <div class="contents">
            <!-- left -->
            <div class="w900">
                <div class="tu">
                    <div v-if="type==1" id="chart6"></div>
                    <div v-if="type==2" id="chart7"></div>
                    <div v-if="type==3" id="chart8">
                        <div class="type3-chart">
                            <div class="chart3-list" v-for="(item,index) in countData"
                                 :class="{checked:nowChecked==index}" :key="index" @click="checkOne(item, index)">
                                <p>{{item.value}}</p>
                                <div class="num">{{item.label}}</div>
                                <Progress :stroke-color="color[Math.floor(Math.random()*5.1)]" :percent="item.percent" hide-info :stroke-width=5 />
                            </div>
                        </div>
                    </div>
                    <div v-if="type==4" id="chart9"></div>
                    <div v-if="type==5" id="chart10"></div>
                </div>
                <div class="biao">
                    <h2>详情表</h2>
                    <Table border :columns="columns1" :data="data1"></Table>
                </div>
            </div>

            <!-- right -->
            <!--按条件查询-->
            <div class="filter-box">
                <div v-show="show_summary">
                    <p>汇总方式</p>
                    <RadioGroup v-model="summary" vertical @on-change="Task_Summarize">
                        <Radio label="按任务数"></Radio>
                        <Radio label="按计划工时"></Radio>
                    </RadioGroup>
                </div>
                <div v-show="show_finish">
                    <p>按任务完成情况</p>
                    <RadioGroup v-model="finished" vertical @on-change="Task_Finish">
                        <Radio label="全部"></Radio>
                        <Radio label="已完成"></Radio>
                        <Radio label="未完成"></Radio>
                    </RadioGroup>
                </div>
                <div v-show="show_finish1">
                    <p>按任务完成情况（默认已完成）</p>
                    <RadioGroup v-model="finish" vertical @on-change="Task_Finish">
                        <Radio label="已完成"></Radio>
                        <Radio label="未完成"></Radio>
                    </RadioGroup>
                </div>
                <div v-show="time_scope">
                    <p>时间范围</p>
                    <Select v-model="scope" style="width:200px" placeholder="过去7天" @on-change="Task_day">
                        <Option v-for="" :value="7" :key="">过去7天</Option>
                        <Option v-for="" :value="30" :key="">过去一个月</Option>
                        <Option v-for="" :value="90" :key="">过去三个月</Option>
                    </Select>
                </div>
                <p>执行者</p>
                <Select v-model="executor" style="width:200px" placeholder="全部" @on-change="Task_zxz">
                    <Option v-for="item in executorData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <p>任务分组</p>
                <Select v-model="people" style="width:200px" placeholder="所有任务分组" @on-change="Task_rw">
                    <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <p>是否仅子任务</p>
                <RadioGroup v-model="child_task" class="redio_box" vertical @on-change="Task_child">
                    <Radio label="是"></Radio>
                    <Radio label="否"></Radio>
                </RadioGroup>
                <p>是否仅回收站任务</p>
                <RadioGroup v-model="recycle_task" class="redio_box" vertical @on-change="Task_recycle">
                    <Radio label="是"></Radio>
                    <Radio label="否"></Radio>
                </RadioGroup>
                <p>优先级</p>
                <RadioGroup v-model="priority_task" class="redio_box2" vertical @on-change="Task_priority">
                    <Radio label="普通"></Radio>
                    <Radio label="紧急"></Radio>
                    <Radio label="非常紧急"></Radio>
                </RadioGroup>
                <p>创建者</p>
                <Select v-model="creator" style="width:200px" placeholder="全部" @on-change="Task_Creator">
                    <Option v-for="item in executorData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <div class="finishi-time">
                    <p>完成时间</p>
                    <DatePicker
                            placeholder="开始时间"
                            :value="startTime"
                            type="datetime"
                            @on-change="startDate"
                            :options="options1"
                    ></DatePicker>
                    <p></p>
                    <DatePicker
                            placeholder="结束时间"
                            :value="endTime"
                            type="datetime"
                            @on-change="endDate"
                            :options="options2"
                    ></DatePicker>
                </div>
                <div class="create-time">
                    <p>创建时间</p>
                    <DatePicker
                            placeholder="开始时间"
                            :value="startTime_create"
                            type="datetime"
                            @on-change="startDate_create"
                            :options="options1"
                    ></DatePicker>
                    <p></p>
                    <DatePicker
                            placeholder="结束时间"
                            :value="endTime_create"
                            type="datetime"
                            @on-change="endDate_create"
                            :options="options2"
                    ></DatePicker>
                </div>
                <!-- <div long @click="defaultButton()" class="default">恢复默认</div> -->
                <div style="margin-top: 20px">
                    <Button type="info" long @click="filterData">确定</Button>
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
    import {
        getPieSource,
        getHistogramSource,
        getBurnoutSource,
        getAddSource,
        getCountData,
        getCountTable
    } from "../../../axios/statisticApi.js";

    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    Highmaps(Highcharts);
    export default {
        data: function () {
            return {
                show_summary: '',
                show_finish: '',
                show_finish1: '',
                time_scope: '',
                title: '',
                type: '',
                id: '',
                nowChecked: 1,
                color: ['#0DA9F5', '#8BDC76', '#FF7969', '#A0A3D6', '#FFC669'],
                summary: '按任务数',
                finished: '全部',
                finish: '已完成',
                child_task: '',
                recycle_task: '否',
                priority_task: '',
                people: 0,
                executor: 0,
                creator: 0,
                scope: 7,
                countData: [],
                executorData: [],
                peopleList: [],
                columns1: [],
                data1: [],
                startTime: "",
                endTime: '',
                startTime_create: "",
                endTime_create: '',
                options1: {},
                options2: {},
                StatisticsDTO: {
                    taskMember: '',
                    taskGroup: '',
                    taskCase: '',
                    taskDay: '',
                    taskChild: '',
                    taskRecycle: '',
                    priorityLevel: '',
                    finishTime_s: '',
                    finishTime_e: '',
                    createTime_s: '',
                    createTime_e: ''
                }
            }
        },
        mounted() {
            this.title = this.$route.query.title;
            this.type = this.$route.query.type;
            this.id = this.$route.query.id
            this.allMethods(this.type + "")
        },
        methods: {
            // 点击表格3中的某一个
            checkOne(item, index) {
                if (index !== 0) {
                    this.nowChecked = index;
                    getCountTable(this.id, item.value, JSON.stringify(this.StatisticsDTO)).then(resp => {
                        this.columns1 = resp.titleList
                        this.data1 = resp.sticsResultList;
                        this.executorData = resp.executor
                        this.peopleList = resp.taskGroup;
                    }).catch(resp => {
                        console.log('请求失败');
                    });
                }
            },
            Task_day(data) {
                this.StatisticsDTO.taskDay = data;
            },
            Task_Finish(data) {
                this.StatisticsDTO.taskCase = data;
            },
            Task_Summarize(data) {
                this.StatisticsDTO.taskCount = data;
            },
            Task_zxz(data) {
                this.StatisticsDTO.taskMember = data
            },
            Task_rw(data) {
                this.StatisticsDTO.taskGroup = data
            },
            Task_child(data) {
                this.StatisticsDTO.taskChild = data
            },
            Task_recycle(data) {
                this.StatisticsDTO.taskRecycle = data
            },
            Task_priority(data) {
                this.StatisticsDTO.priorityLevel = data
            },
            Task_Creator(data) {
                this.StatisticsDTO.taskCreator = data
            },
            startDate(date) {
                this.startTime = date;
                this.StatisticsDTO.finishTime_s = new Date(this.startTime).getTime() / 1000;
                this.options2 = {
                    disabledDate(date1) {
                        return date1.valueOf() < new Date(date).getTime();
                    }
                };
            },
            endDate(date) {
                this.endTime = date;
                this.StatisticsDTO.finishTime_e = new Date(this.endTime).getTime() / 1000;
                this.options1 = {
                    disabledDate(date1) {
                        return date1.valueOf() > new Date(date).getTime() - 86400000;
                    }
                };
            },
            startDate_create(date) {
                this.startTime_create = date;
                this.StatisticsDTO.createTime_s = new Date(this.startTime_create).getTime() / 1000;
                this.options2 = {
                    disabledDate(date1) {
                        return date1.valueOf() < new Date(date).getTime();
                    }
                };
            },
            endDate_create(date) {
                this.endTime_create = date;
                this.StatisticsDTO.createTime_e = new Date(this.endTime_create).getTime() / 1000;
                this.options1 = {
                    disabledDate(date1) {
                        return date1.valueOf() > new Date(date).getTime() - 86400000;
                    }
                };
            },
            defaultButton() {

            },
            filterData() {
                this.allMethods(this.type+"")
            },
            allMethods(n) {
                switch (n) {
                    case "1" :
                        this.show_finish = true,
                            this.show_summary = true,
                            this.time_scope = false,
                            //this.hide_div=true;
                            //this.show_div=false;
                            getPieSource(this.id, JSON.stringify(this.StatisticsDTO)).then(res => {
                                this.columns1 = res.titleList
                                this.data1 = res.pieData;
                                this.executorData = res.executor
                                this.peopleList = res.taskGroup;
                                this.initChart1(res.pieData)
                            })
                        break;
                    case "2":
                        this.show_summary = true,
                            this.show_finish1 = true,
                            this.time_scope = false
                        if (this.StatisticsDTO.taskCase == "") {
                            this.StatisticsDTO.taskCase = "已完成"
                        }
                        getHistogramSource(this.id, JSON.stringify(this.StatisticsDTO)).then(res => {
                            this.columns1 = res.titleList;
                            this.data1 = res.hisResultlist;
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                            if (res.staticHistogram.taskType == "按计划工时") {
                                this.initChart2(res.staticHistogram.nameArray, res.staticHistogram.doubleArray, "计划工时(单位:h)")
                            } else {
                                this.initChart2(res.staticHistogram.nameArray, res.staticHistogram.dataArray, "任务数")
                            }
                        })
                        break;
                    case "3":
                        getCountData(this.id, JSON.stringify(this.StatisticsDTO)).then(res => {
                            this.countData = res.countData;
                            this.columns1 = res.titleList
                            this.data1 = res.sticsResultList;
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                        })
                        break;
                    case "4" :
                        this.show_finish = false,
                            this.time_scope = true,
                            //this.hide_div=true;
                            getBurnoutSource(this.id, JSON.stringify(this.StatisticsDTO)).then(res => {
                                this.columns1 = res.titleList
                                this.executorData = res.executor
                                this.peopleList = res.taskGroup;
                                this.data1 = res.statisticsBurnout.sticResultVOS
                                this.initChart4(res.statisticsBurnout.everyDate, res.statisticsBurnout.trueTask, res.statisticsBurnout.idealTask)
                            })
                        break;
                    case "5":
                        this.show_finish = false,
                            this.time_scope = true,
                            //this.hide_div=true;
                            getAddSource(this.id, JSON.stringify(this.StatisticsDTO)).then(res => {
                                this.columns1 = res.titleList
                                this.executorData = res.executor
                                this.peopleList = res.taskGroup;
                                this.data1 = res.statisticsBurnout.sticResultVOS
                                this.initChart5(res.statisticsBurnout.everyDate, res.statisticsBurnout.cumulativeTask, res.statisticsBurnout.completionTask)
                            })
                        break;
                    default:
                        console.log(n);
                        break;
                }
            },
            initChart1(data) {
                Highcharts.chart('chart6', {
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
                        data: data
                    }]
                });
            },
            initChart2(nameArray, dataArray, text) {
                Highcharts.chart('chart7', {
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
                        categories: nameArray,
                        crosshair: false
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: text
                        }
                    },
                    tooltip: {},
                    plotOptions: {
                        column: {
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: text,
                        data: dataArray
                    }]
                });
            },
            initChart4(date1, trueTask, idealTask) {
                Highcharts.chart('chart9', {
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false     //不显示LOGO
                    },
                    xAxis: {
                        categories: date1,
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
            initChart5(date, cumulativeTask, completionTask) {
                Highcharts.chart('chart10', {
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false     //不显示LOGO
                    },
                    xAxis: {
                        categories: date,
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
            close() {
                this.$router.push(localStorage.statisticsRouter)
            }
        }
    }
</script>
<style socped lang="less">
    #chart8 {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .checked {
        border: 1px solid #e5e5e5;
    }

    .redio_box {
        columns: 2,
    }

    .redio_box2 {
        columns: 3,
    }

    .type3-chart {
        width: 532px;
        height: 224px;
        display: flex;
        flex-wrap: wrap;
        .chart3-list {
            width: 104px;
            height: 88px;
            cursor: pointer;
            padding: 12px;
            margin-right: 24px;
            margin-bottom: 24px;
            p {
                font-size: 12px;
                color: #a6a6a6;
            }
            .num {
                height: 40px;
                padding: 4px 0;
                font-size: 28px;
            }
        }
    }

    .box {
        width: 100%;
        padding: 76px 0 0 20px;
        background-color: #F5F5F4;
    }

    .top-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99;
        height: 56px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
        background-color: white;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        i {
            cursor: pointer;
            &:hover {
                color: #3da8f5;
            }
        }
    }

    .contents {
        width: 1250px;
        margin: 0 auto;
        display: flex;

        .w900 {
            width: 900px;
            padding-bottom: 20px;
            .tu {
                width: 100%;
                height: 400px;
                background-color: white;
                border: 1px solid #e5e5e5;
            }
            .biao {
                width: 100%;
                margin-top: 20px;
                background-color: white;
                border: 1px solid #e5e5e5;
                h2 {
                    width: 100%;
                    height: 48px;
                    font-size: 14px;
                    text-align: center;
                    line-height: 48px;
                }
            }
        }
        .filter-box {
            width: 320px;
            margin-left: 15px;
            padding: 15px;
            margin-bottom: 20px;
            //   height: calc(100vh - 100px) ;
            background-color: white;
            border-radius: 5px;
            // border:1px solid #e5e5e5;
            //position: fixed;
            // top: 76px;
            //right: calc((100vw - 1250px)/2) ;

            p {
                line-height: 24px;
                padding: 10px 0;
                font-size: 14px;
                color: gray;
            }
            .default {
                width: 100%;
                height: 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                color: gray;
                cursor: pointer;
                line-height: 24px;
                padding: 10px 0;

                &:hover {
                    color: #3da8f5;
                }

            }
        }
    }
</style>