<template>
  <div class="layout-right" id="layout-right">
    <div class="container">
      <div class="content">
        <Tabs v-model="showValue" @on-click="checkTab">
          <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tabList" :key="index">
            <div class="table-content">
              <!-- <Loading v-show="loading"></Loading> -->
              <Table :columns="columnsList" :data="requirementsList" class="reuqire-table">
                <template slot-scope="{ row }" slot="demandName">
                  <div>{{ row.demandName }}</div>
                </template>
                <template slot-scope="{ row }" slot="createTime">
                  <div>{{ row.createTime }}</div>
                </template>
                <template slot-scope="{ row }" slot="bid">
                  <div>{{ row.bid }}</div>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                  <Button type="primary" ghost @click="goDemand(row, index)">查看</Button>
                  <Button type="error" style="margin-left: 10px" @click="showDel(row,index)">删除</Button>
                </template>
              </Table>
            </div>
            <div class="pagingContent" v-if="total!=0">
              <Page :total="total" show-total @on-change="changePage" />
            </div>
          </TabPane>
        </Tabs>

      </div>
    </div>
    <Modal v-model="delModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>确定删除这条需求吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delRequire">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  // import Loading from "../components/public/common/Loading.vue";

  import {
    demandList,
    demandRemove
  } from "@/axios/api";
  import {
    demandCheckDemand
  } from "@/axios/admin"
  export default {
    name: "",
    components: {
      // Loading,
    },
    data() {
      return {
        loading: false,
        tabList: [{
          label: '需求列表',
          name: "1"
        }, ],
        columnsList: [{
            title: "需求标题",
            slot: "demandName",
          },
          {
            title: "发布时间",
            slot: "createTime",
          },
          {
            title: "金额",
            slot: "bid",
          },
          {
            title: "审核",
            render: (h, params) => {
              return h(
                "i-switch", {
                  props: {
                    value: params.row.isCheck == "1"
                  },
                  on: {
                    'on-change': (value) => {
                      demandCheckDemand({
                        demandId: params.row.demandId
                      }).then(response => {
                        this.$Message.success('审核通过');
                        this.$set(this.requirementsList[params.index],'isCheck',"1")
                        this.$nextTick(() => {
                          this.requirementsList.splice(params.index, 1)
                        })
                      })
                    }
                  }
                }
              );
            },
          },
          {
            title: "操作",
            slot: "action",
            width: 300,
            align: "center",
          },
        ],
        flag: false,
        requirementsList: [],
        demandParam: {
          pageNum: 1,
          type: 4,
          state: 2
        },
        delModal: false,
        modal_loading: false,
        requireItem: {},
        showValue: '1',
        total: 0
      };
    },
    mounted() {
      this.loading = true;
      this.getList();
    },
    methods: {
      getList() {
        demandList(this.demandParam).then((response) => {
          this.requirementsList = response.data.records
          this.total = response.data.total
          this.loading = false
        });
      },
      editRequire(item) {
        localStorage.setItem("editRequire", JSON.stringify(item));
        this.$router.push({
          path: "/requirements",
          query: {
            type: "edit",
          },
        });
      },
      showDel(item, index) {
        this.delModal = true
        this.requireItem = item
        this.requireIndex = index
      },
      delRequire() {
        this.modal_loading = true
        demandRemove({
          demandId: this.requireItem.demandId
        }).then(response => {
          this.$Message.success('删除成功');
          this.modal_loading = false
          this.delModal = false
          this.requirementsList.splice(this.requireIndex, 1)
        })
      },
      checkTab(name) {
        this.requirementsList = []
        this.demandParam.type = name
        this.loading = true;
        this.getList();
      },
      changePage(num) {
        this.demandParam.pageNum = num
        this.getList()
      },
      //需求详情
      goDemand(row, index) {
        // this.$router.push("index/demandDetails")
        window.location.href = '/demandDetails';
        localStorage.setItem('demandInfoList', JSON.stringify(row))
      },
    },
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/css/demandList.less";
</style>