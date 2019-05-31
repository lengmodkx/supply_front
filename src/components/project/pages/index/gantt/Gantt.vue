<template>
  <div ref="gantt"></div>
</template>

<script>
  import 'dhtmlx-gantt'
  import {
        initGantt,
        updateProjectInfo
  } from '@/axios/api2'

  export default {
    name: 'gantt',
    data () {
      return {
        tasks: {
          data: [],
          links:[],
        },
        selectedTask: null,
        messages: []
      }
    },

    methods: {
      $_initGanttEvents: function () {
        if(gantt.$_eventsInitialized)
          return;
        gantt.attachEvent('onTaskSelected', (id) => {
          let task = gantt.getTask(id)
          this.$emit('task-selected', task)
        })

        gantt.attachEvent('onAfterTaskAdd', (id, task) => {
          this.$emit('task-updated', id, 'inserted', task)
          task.progress = task.progress || 0
          if(gantt.getSelectedId() == id) {
            this.$emit('task-selected', task)
          }
        })

        //更新甘特图
        gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
          let itemId=task.publicId;
          let text=task.text;
          let start=(task.start_date).getTime();
          let end=(task.end_date).getTime();
          updateProjectInfo(itemId,text,start,end).then(res=>{
            if(res.result==1){
                this.getData();//从新获取的数据
            }else{
             this.$Message.error("修改失败!")
            }
          })      
         this.$emit('task-updated', id, 'updated', task)
        })

       //删除甘特图
        gantt.attachEvent('onAfterTaskDelete', (id, item) => {
          this.$emit('task-updated', id, 'deleted', item)
          if(!gantt.getSelectedId()) {
            this.$emit('task-selected', null)
          }
        })

        //增加link
        gantt.attachEvent('onAfterLinkAdd', (id, link) => {
          this.$emit('link-updated', id, 'inserted', link)
        })
        //更新link
        gantt.attachEvent('onAfterLinkUpdate', (id, link) => {
          this.$emit('link-updated', id, 'updated', link)
        })
        //册除link
        gantt.attachEvent('onAfterLinkDelete', (id, link) => {
          this.$emit('link-updated', id, 'deleted')
        })
        gantt.$_eventsInitialized = true;
      },

      //初始化列
      columnsInit:function(){
        gantt.config.columns = [
          {name:"text",       label:"任务名称",  width:"*", tree:true },
          {name:"start_date", label:"开始时间", align:"center", width:90 },
          {name:"end_date",   label:"结束时间",  align:"center" , width:90},
          // {name:"add",        label:"",           width:44 }
        ];
      },

      //初始化语言--汉化
      localeInit:function(){
        gantt.locale = {
          date:{
            month_full:["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月",
              "十月", "十一月", "十二月"],
            month_short:["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月",
              "十月", "十一月", "十二月"],
            day_full:["星期日", "星期一", "星期二", "星期三", "星期四", "星期五",
              "星期六"],
            day_short:["日", "一", "二", "三", "四", "五", "六"]
          },
          labels:{
            icon_save:"保存",
            icon_cancel:"取消",
            icon_details:"详情",
            icon_edit:"Edit",
            icon_delete:"册除",
            section_description:"任务名称：",
            section_time:"任务时间：",
            minutes: "分",
            hours: "小时",
            days: "日",
            weeks: "周",
            months: "月",
            years: "年"
          },
            
        };
        gantt.config.lightbox.sections=[ 
            {name:"description", height:40, map_to:"text", type:"textarea",focus:true},
            {name:"period",      height:40, map_to:"auto", type:"time"}, 
        ];
        gantt.locale.labels.section_period = "任务时间：";
        gantt.config.buttons_right = [];


      },

      //获取数据
      getData:function(){
        initGantt(this.$route.params.id).then(res => {
          console.log(res)
          let listData=res.data.map(item=>{
            let cur={
              id: item.id,
              publicId:item.publicId,
              text: item.text,
              user: item.user,
              type: item.type,
              start_date:item.start_date ? new Date(item.start_date):new Date(),
              end_date: item.start_date ? new Date(item.end_date):new Date(),
              parent:item.parent,
              open:item.open ,
              progress:0
            }
            return cur;
          })
          this.tasks.data = listData
            gantt.parse(this.tasks);
                gantt.eachTask(function(task){
                task.$open = true;
            });
            gantt.render();
        })
      },

    },

    mounted () {
      this.getData();
      this.$_initGanttEvents();
      gantt.init(this.$refs.gantt);
      gantt.parse(this.tasks);
    },
    created:function(){
      this.columnsInit(); //初始化
      this.localeInit(); //汉化
    }
  }
</script>

<style>
  @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
  /* .gantt_task_line {
      border-radius: 30px !important;
  } */

  .gantt_section_time{
     display: flex !important;
  }
  .gantt_cal_light select{
    height: 25px !important;
  }
  /* .gantt_section_time .gantt_time_selects{
    border-radius: 4px !important;
    overflow: hidden
  }
  .gantt_section_time .gantt_time_selects select:first-child{
    border-top-left-radius: 4px !important;
    border-bottom-left-radius:4px !important;
   }
  .gantt_section_time .gantt_time_selects select:last-child{
    border-top-right-radius: 4px !important;
    border-bottom-right-radius:4px !important;
   }
   .gantt_duration .gantt_duration_dec, .gantt_duration .gantt_duration_inc{
     padding:0px !important;
   } */
   
</style>
