<template>
  <div>
    <div class="taskfilter">
      <span>
        <Icon type="android-search"></Icon>
      </span>
      任务筛选
    </div>
    <Input placeholder="查找相关任务"
           style="margin:8px 16px;width:266px;height:36px;" />
    <div class="filterList"
         v-for="(item,index) in list"
         :key="index" v-show="item.checked">
      <header>{{item.name}}</header>
      <ul>
        <li v-for="(son,i) in item.son"
            :key="i"
            @click="son.checked=!son.checked">
          <span v-if="index==0"
                class="tag"
                :class="{'tag-none':i==0,'tag-blue':i%2==0&&i!=0,'tag-red':i%2==1&&i!=0}"></span>

          <span v-if="index==1||index==2">icon</span>
          <span class="tag-title">{{son.name}}</span>
          <svg-icon v-if="son.checked"
                    class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>
    <!-- <div class="filterList"
         v-show="propTypeList[0].checked">
      <header>标签</header>
      <ul>
        <li>
          <span class="tag tag-none"></span>
          <span class="tag-title">无标签</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag tag-blue"></span>
          <span class="tag-title">iOS</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag tag-red"></span>
          <span class="tag-title">Web</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag tag-blue"></span>
          <span class="tag-title">用标签区分产品平台</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>

    <div class="filterList"
         v-show="propTypeList[1].checked">
      <header>执行者</header>
      <ul>
        <li>
          <svg-icon name="people"
                    style="vertical-align:middle;margin-right:8px;"></svg-icon>
          <span class="tag-title">待认领</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>

    <div class="filterList"
         v-show="propTypeList[2].checked">
      <header>创建者</header>
      <ul>
        <li>
          <span class="uname">罗茜</span>
          <span class="tag-title">罗茜</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>

    <div class="filterList"
         v-show="propTypeList[3].checked">
      <header>截止时间</header>
      <ul>
        <li>
          <span class="tag-title">今天截止</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">已逾期</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">未完成</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">已完成</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">今日更新</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>

    <div class="filterList"
         v-show="propTypeList[4].checked">
      <header>开始时间</header>
      <ul>
        <li>
          <span class="tag-title">今天开始</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">已开始</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">未开始</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>

    <div class="filterList"
         v-show="propTypeList[5].checked">
      <header>创建时间</header>
      <ul>
        <li>
          <span class="tag-title">今天</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">昨天</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">过去一周</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">过去一月</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">自定义</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
      </ul>
    </div>

    <div class="filterList"
         v-show="propTypeList[6].checked">
      <header>优先级</header>
      <ul>
        <li>
          <span class="tag-title">普通</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">紧急</span>
          <svg-icon class="right"
                    name="right"></svg-icon>
        </li>
        <li>
          <span class="tag-title">非常紧急</span>
          <svg-icon class="right" name="right"></svg-icon>
        </li>
      </ul>
    </div> -->

    <div class="addFilter">
      <span @click="dropDownvisible=!dropDownvisible">
        <Icon type="plus-circled"
              style="margin-right:8px;"></Icon>添加筛选</span>
      <my-dropdown :list="list"
                   :visible.sync="dropDownvisible"></my-dropdown>
    </div>
  </div>
</template>
<script>
import myDropdown from './_Dropdown.vue'
export default {
  components: { myDropdown },
  data () {
    return {
      dropDownvisible: false,
      // propTypeList: [
      //   { name: "标签", checked: true },
      //   { name: "执行者", checked: true },
      //   { name: "创建者", checked: true },
      //   { name: "截止时间", checked: false },
      //   { name: "开始时间", checked: false },
      //   { name: "创建时间", checked: false },
      //   { name: "优先级", checked: true }
      // ],
      list: [
        {
          name: "标签",
          checked: true,
          son: [
            {
              id: 1,
              name: "无标签",
              checked: false
            },
            {
              id: 2,
              name: "iOS",
              checked: false
            },
            {
              id: 3,
              name: "Web",
              checked: false
            },
            {
              id: 4,
              name: "用标签区分产品平台",
              checked: false
            }
          ]
        },
        {
          name: "执行者",
          checked: false,
          son: [
            {
              id: 5,
              name: "待认领",
              checked: false
            }
          ]
        },
        {
          name: "创建者",
          checked: false,
          son: [
            {
              id: 6,
              name: "罗茜",
              checked: false
            }
          ]
        },
        {
          name: "截止时间",
          checked: false,
          son: [
            {
              id: 7,
              name: "今天截止",
              checked: false
            },
            {
              id: 8,
              name: "已逾期",
              checked: false
            },
            {
              id: 9,
              name: "未完成",
              checked: false
            },
            {
              id: 10,
              name: "已完成",
              checked: false
            },
            {
              id: 11,
              name: "今日更新",
              checked: false
            }
          ]
        },
        {
          name: "开始时间",
          checked: false,
          son: [
            {
              id: 12,
              name: "今天开始",
              checked: false
            },
            {
              id: 13,
              name: "已开始",
              checked: false
            },
            {
              id: 14,
              name: "未开始",
              checked: false
            }
          ]
        },
        {
          name: "创建时间",
          checked: false,
          son: [
            {
              id: 15,
              name: "今天",
              checked: false
            },
            {
              id: 16,
              name: "昨天",
              checked: false
            },
            {
              id: 17,
              name: "过去一周",
              checked: false
            },
            {
              id: 18,
              name: "过去一月",
              checked: false
            }
            
          ]
        },
        {
          name: "优先级",
          checked: false,
          son: [
            {
              id: 19,
              name: "普通",
              checked: false
            },
            {
              id: 20,
              name: "紧急",
              checked: false
            },
            {
              id: 21,
              name: "非常紧急",
              checked: false
            }
          ]
        }
      ]
    }
  },
  methods: {}
}
</script>
<style scoped lang="less">
.taskfilter {
          padding: 0 16px;
          font-size: 14px;
          span {
            margin-right: 4px;
          }
        }
        .right {
          float: right;
          vertical-align: center;
          width: 20px;
        }
        .addFilter {
          line-height: 42px;
          padding: 0 16px;
          font-size: 14px;
          color: #3da8f5;
          &:hover {
            color: blue;
          }
          span {
            cursor: pointer;
          }
          
        }
        .filterList {
          padding: 4px 0;
          border-bottom: 1px solid #eee;
          font-size: 14px;
          .uname {
            display: inline-block;
            width: 26px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border-radius: 13px;
            background: #c38acf;
            margin-right: 8px;
            vertical-align: middle;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            color: #fff;
            font-size: 10px;
          }
          header {
            line-height: 24px;
            color: #000;
            padding: 0 16px;
          }
          li {
            line-height: 38px;
            color: gray;
            cursor: pointer;
            padding: 0 16px;
            &:hover {
              background: #eee;
            }
            .tag {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 5px;
              margin-right: 6px;
            }
            .tag-none {
              background-color: lightgray;
            }
            .tag-blue {
              background-color: #ed3f14;
            }
            .tag-red {
              background-color: #389eff;
            }
          }
        }
</style>
