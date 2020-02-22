<template>
    <div class="box">
        <header class="top-header">
            <span>{{title}}</span>
            <Icon @click="close" type="md-close" size="22"/>
        </header>
        <div class="contents">
            <div class="w900">
                <div class="tu" >
                    <div v-if="type==1" id="chart6"></div>
                    <div v-if="type==2" id="chart7"></div>
                    <div v-if="type==3" id="chart8">
                        <div class="type3-chart">
                            <div class="chart3-list" v-for="(item,index) in countData" :class="{checked:nowChecked==index}" :key="index" @click="checkOne(item, index)">
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
                    <Table   border :columns="columns1" :data="data1"></Table>
                </div>
            </div>
        </div>
        <!--按条件查询-->
        <div class="filter-box">
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
            <p>是否是回收站任务</p>
            <RadioGroup v-model="recycle_task" class="redio_box" vertical @on-change="Task_recycle">
                <Radio label="是"></Radio>
                <Radio label="否"></Radio>
            </RadioGroup>
            <div long @click="defaultButton()" class="default">恢复默认</div>
            <div style="margin-top: 20px">
                <Button type="info" long @click="filterData">确定</Button>
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
    import  { getPieSource,getHistogramSource,getBurnoutSource,getAddSource,getCountData,getCountTable }  from "../../../axios/statisticApi.js";
    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    Highmaps(Highcharts);
    export default {
        data: function () {
            return {
                show_finish:'',
                show_finish1:'',
                time_scope:'',
                title: '',
                type: '',
                id: '',
                nowChecked: 1,
                color:['#0DA9F5','#8BDC76','#FF7969','#A0A3D6','#FFC669'],
                finished: '全部',
                finish:'已完成',
                child_task:'',
                recycle_task:'否',
                people: 0,
                executor: 0,
                scope:7,
                countData:[],
                executorData: [],
                peopleList:[],
                columns1:[],
                data1: [],
                StatisticsDTO:{
                    taskMember:'',
                    taskGroup:'',
                    taskCase:'',
                    taskDay:'',
                    taskChild:'',
                    taskRecycle:''
                }
            }
        },
        mounted() {
            this.title=this.$route.query.title;
            this.type = this.$route.query.type;
            this.id  =  this.$route.query.id
            this.allMethods(this.type)
        },
        methods: {
            // 点击表格3中的某一个
            checkOne(item, index) {
                if (index!==0) {
                    this.nowChecked=index;
                    getCountTable(this.id, item.value,JSON.stringify(this.StatisticsDTO)).then(resp=>{
                        this.columns1 = resp.titleList
                        this.data1 = resp.sticsResultList;
                        this.executorData = resp.executor
                        this.peopleList = resp.taskGroup;
                    }).catch(resp => {
                        console.log('请求失败');
                    });
                }
            },
            Task_day(data){
               this.StatisticsDTO.taskDay=data;
            },
            Task_Finish(data) {
                this.StatisticsDTO.taskCase = data;
            },
            Task_zxz(data){
                this.StatisticsDTO.taskMember = data
            },
            Task_rw(data){
                this.StatisticsDTO.taskGroup = data
            },
            Task_child(data){
                this.StatisticsDTO.taskChild = data
            },
            Task_child(data){
                this.StatisticsDTO.taskChild = data
            },
            Task_recycle(data){
                this.StatisticsDTO.taskRecycle = data
            },
            defaultButton(){

            },
            filterData(){
                this.allMethods(this.type)
            },
            allMethods(n){
                switch(n){
                    case 1 :
                        this.show_finish = true,
                        this.time_scope = false,
                        //this.hide_div=true;
                        //this.show_div=false;
                        getPieSource(this.id,JSON.stringify(this.StatisticsDTO)).then(res => {
                            this.columns1 = res.titleList
                            this.data1 = res.pieData;
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                            this.initChart1(res.pieData)
                        })
                        break;
                    case 2:
                            this.show_finish1 = true,
                            this.time_scope = false
                            //this.hide_div=true;
                            if(this.StatisticsDTO.taskCase == ""){
                                this.StatisticsDTO.taskCase = "已完成"
                            }
                            getHistogramSource(this.id,JSON.stringify(this.StatisticsDTO)).then(res=>{
                            this.columns1   =  res.titleList;
                            this.data1=res.hisResultlist;
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                            this.initChart2(res.staticHistogram.nameArray,res.staticHistogram.dataArray)
                        })
                        break;
                    case 3:
                        getCountData(this.id,JSON.stringify(this.StatisticsDTO)).then(res=>{
                            this.countData=res.countData;
                            this.columns1 = res.titleList
                            this.data1 = res.sticsResultList;
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                        })
                        break;
                    case 4 :
                            this.show_finish = false,
                            this.time_scope = true,
                            //this.hide_div=true;
                        getBurnoutSource(this.id,JSON.stringify(this.StatisticsDTO)).then(res => {
                            this.columns1 = res.titleList
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                            this.data1 = res.statisticsBurnout.sticResultVOS
                            this.initChart4(res.statisticsBurnout.everyDate, res.statisticsBurnout.trueTask, res.statisticsBurnout.idealTask)
                        })
                        break;
                    case 5:
                            this.show_finish = false,
                            this.time_scope = true,
                            //this.hide_div=true;
                        getAddSource(this.id,JSON.stringify(this.StatisticsDTO)).then(res => {
                            this.columns1 = res.titleList
                            this.executorData = res.executor
                            this.peopleList = res.taskGroup;
                            this.data1 = res.statisticsBurnout.sticResultVOS
                            this.initChart5( res.statisticsBurnout.everyDate, res.statisticsBurnout.cumulativeTask, res.statisticsBurnout.completionTask)
                        })
                        break;
                }
            },
            initChart1(data){
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
            initChart2(nameArray,dataArray){
                Highcharts.chart('chart7',{
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
                        categories:nameArray,
                        crosshair: false
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '任务数'
                        }
                    },
                    tooltip: {
                    },
                    plotOptions: {
                        column: {
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: '任务数',
                        data: dataArray
                    }]
                });
            },
            initChart4(date1,trueTask,idealTask){
                Highcharts.chart('chart9', {
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false     //不显示LOGO
                    },
                    xAxis: {
                        categories:date1,
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
            initChart5(date,cumulativeTask,completionTask){
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
            close(){
                this.$router.push(localStorage.statisticsRouter)
            }
        }
    }
</script>
<style socped lang="less">
    #chart8{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .checked{
        border: 1px solid #e5e5e5;
    }
    .redio_box{
        columns:2,
    }
    .type3-chart{
        width: 532px;
        height: 224px;
        display: flex;
        flex-wrap: wrap;
        .chart3-list{
            width: 104px;
            height: 88px;
            cursor: pointer;
            padding: 12px;
            margin-right: 24px;
            margin-bottom: 24px;
            p{
                font-size: 12px;
                color: #a6a6a6;
            }
            .num{
                height: 40px;
                padding: 4px 0;
                font-size: 28px;
            }
        }
    }
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
    .default{
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

    &:hover{
         color: #3da8f5;
     }
    }
}
</style>