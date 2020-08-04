<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>{{messageType==0?'全部项目':'系统公告'}}</div>
        <div class="line"></div>
      </div>
      <div class="searchContent">
        <Row :gutter="10">
          <Col span="5">
            <div class="df ac">
              <div class="wsn">关键字：</div>
              <Input prefix="ios-search" placeholder="搜索" v-model="keyword" />
            </div>
          </Col>
          <Col span="6">
            <div class="df ac">
              <div class="wsn">日期：</div>
              <DatePicker
                v-model="value2"
                format="yyyy/MM/dd"
                type="daterange"
                placement="bottom-end"
                placeholder="开始时间 - 结束时间"
                style="width:100%;"
              ></DatePicker>
            </div>
          </Col>
          <Col span="4">
            <div class="df ac">
              <div class="wsn">类型：</div>
              <Select v-model="messageTypes">
                <Option :value="1">已读</Option>
                <Option :value="0">未读</Option>
              </Select>
            </div>
          </Col>
          <Col span="9">
            <div class="df ac btnContent">
              <Button type="primary" icon="ios-search" @click="searchOrgProple">搜索</Button>
              <Button type="primary" :disabled="checkAllGroup.length==0" @click="batchRead">批量标记已读</Button>
              <Button type="primary" :disabled="checkAllGroup.length==0" @click="batchDeletion">批量删除</Button>
            </div>
          </Col>
        </Row>
      </div>
      <div class="table-content">
        <Row class="titleRow">
          <Col span="9">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll"
            >&nbsp;&nbsp;公告标题</Checkbox>
          </Col>
          <Col span="5">时间</Col>
          <Col span="10">操作</Col>
        </Row>
        <div class="scroll-box">
          <Loading v-if="loading"></Loading>
          <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Row
              type="flex"
              justify="space-between"
              class-name="group-people"
              v-for="(item, index) in dataList"
              :key="index"
            >
              <Col span="9">
                <div class="group-people-con">
                  <Checkbox :label="item.newsId">
                    <div>
                      <p class="userName">{{ item.newsName }}</p>
                    </div>
                  </Checkbox>
                </div>
              </Col>
              <Col span="5">{{ $moment(item.createTime).format("YYYY年MM月DD日") }}</Col>
              <Col span="10">{{ item.newsContent }}</Col>
            </Row>
          </CheckboxGroup>
          <div class="pagingContent" v-if="dataList.length !=0">
            <Page :total="total" show-total @on-change="changePage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import {} from "@/axios/companyApi";
import { userMessage, batchReads, batchDel } from "@/axios/api";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  props: ["messageType"],
  components: {
    Loading
  },
  data() {
    return {
      dataList: [],
      visible: false,
      value2: ["", ""],
      keyword: "",
      checkAllGroup: [],
      indeterminate: true,
      checkAll: false,
      loading: false,
      total: 0,
      messageTypes: 0
    };
  },
  computed: {},
  mounted() {
    this.loading = true;
    this.getList(this.keyword);
  },
  methods: {
    getList(keyword, startTime, endTime, pageNum, messageTypes) {
      let data = {
        keyword: keyword,
        pageNum: pageNum,
        startTime: startTime,
        endTime: endTime,
        param: messageTypes
      };
      userMessage(data).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.dataList.map(p => {
          this.checkAllGroup.push(p.newsId);
        });
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.dataList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    searchOrgProple(event) {
      this.loading = true;
      if (this.value2[0] == "" && this.value2[1] == "") {
        this.getList(this.keyword, "", "", "", this.messageTypes);
      } else {
        this.getList(
          this.keyword,
          this.value2[0].getTime(),
          this.value2[1].getTime(),
          this.messageTypes
        );
      }
    },
    batchRead() {
      batchReads(this.checkAllGroup.join(",")).then(res => {
        if (res.result == 1) {
          this.$Message.success("批量已读成功!");
          this.close();
          this.$store.commit("news/getNewsCount", res.data);
          this.getList(this.keyword);
        }
      });
    },
    batchDeletion() {
      batchDel(this.checkAllGroup.join(",")).then(res => {
        if (res.result == 1) {
          this.$Message.success("删除成功!");
          this.close();
          this.getList(
            this.keyword,
            new Date().getTime(),
            new Date().getTime()
          );
        }
      });
    },
    close() {
      this.checkAllGroup = [];
      this.indeterminate = true;
      this.checkAll = false;
    },
    changePage(num) {
      if (this.value2[0] == "" && this.value2[1] == "") {
        this.getList(this.keyword, "", "", num, this.messageTypes);
      } else {
        this.getList(
          this.keyword,
          this.value2[0].getTime(),
          this.value2[1].getTime(),
          this.messageTypes
        );
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/managementS";
.line {
  width: 56px !important;
}
.searchContent {
  padding: 24px 32px;
}
.wsn {
  white-space: nowrap;
}
.btnContent {
  button {
    margin-right: 10px;
  }
}
.userName {
  padding-left: 10px;
  font-size: 14px !important;
}
.group-people {
  min-height: 70px !important;
  height: auto !important;
}
</style>