<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>成员</div>
        <div class="icon-content">
          <!-- <div>
            <img src="../assets/images/systemSet/piliang.png" alt />
          </div>-->
          <div>
            <Poptip v-model="memModal" placement="bottom">
              <div class="branch">
                <img src="../assets/images/systemSet/jia.png" alt />
              </div>
              <div slot="content" class="popContent">
                <p @click="showAddModel(true)">添加企业成员</p>
                <p @click="showAddModel(false)">添加外部成员</p>
                <!-- <p @click="showAddModel(false)">添加外部成员</p> -->
              </div>
            </Poptip>
          </div>
          <div class="r-jump" @click="goMember">
            <img src="../assets/images/systemSet/chengyuang.png" alt />
            <span>成员</span>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="search">
        <Input prefix="ios-search" placeholder="搜索" @on-change="searchOrgProple" />
      </div>
      <div class="table-title">
        <Dropdown trigger="click" @on-click="changeMemberType">
          <div>
            企业成员·{{peopleList.length}}
            <Icon type="ios-arrow-down" color="#999999"></Icon>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in allMemberType" :key="index" :name="item">{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="table-content">
        <Row class="titleRow" v-if="checkAllGroup.length==0">
          <Col span="9">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll"
            >&nbsp;&nbsp;姓名</Checkbox>
          </Col>
          <Col span="5">部门</Col>
          <Col span="5">角色</Col>
          <Col span="4">操作</Col>
        </Row>
        <Row class="titleRow" v-else>
          <Col span="24">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll"
            >
              <span class="mr20">已选择{{checkAllGroup.length}}项</span>
            </Checkbox>

            <span>
              <Poptip placement="bottom" transfer width="280" v-model="batchAdd">
                <a href="javascript:void(0)" class="mr20">添加到</a>
                <div slot="title" class="member-title">
                  <span>添加至</span>
                  <Icon
                    type="md-close"
                    size="18"
                    class="role-md-close"
                    @click.native="batchAdd=false"
                  />
                </div>
                <div slot="content">
                  <div style="margin-top:10px;margin-bottom:10px">
                    <span>
                      添加至
                      <br />
                    </span>
                    <Select v-model="model5">
                      <Option
                        v-for="item in departmentTreeNew"
                        :value="item.partmentId"
                        :key="item.partmentId"
                      >{{ item.partmentName }}</Option>
                    </Select>
                  </div>
                  <Button type="primary" long @click="batchAddDep">确定</Button>
                </div>
              </Poptip>
            </span>
            <span>
              <Poptip placement="bottom" transfer width="280" v-model="batchRemoval">
                <a href="javascript:void(0)">移除</a>
                <div slot="title" class="member-title">
                  <span>移除成员</span>
                  <Icon
                    type="md-close"
                    size="18"
                    class="role-md-close"
                    @click.native="batchRemoval=false"
                  />
                </div>
                <div slot="content">
                  <div style="margin-top:10px;margin-bottom:10px">
                    <span>你确定把已选中的成员从企业中移除吗？</span>
                  </div>
                  <Button type="error" long @click="removePP">确定</Button>
                </div>
              </Poptip>
            </span>
          </Col>
        </Row>
        <div class="scroll-box">
          <Loading v-if="loading"></Loading>
          <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Row
              type="flex"
              justify="space-between"
              class-name="group-people"
              v-for="(item, index) in peopleList"
              :key="index"
              @click="showUserInfoModal(item)"
            >
              <Col span="9">
                <div class="group-people-con">
                  <Checkbox :label="item.memberId" :disabled="item.organizationLable==1">
                    <img :src="item.userEntity.image" alt />
                    <div>
                      <p class="userName">{{ item.userEntity.userName }}</p>
                      <div class="userPhone">{{item.userEntity.accountName}}</div>
                    </div>
                  </Checkbox>
                </div>
              </Col>
              <Col span="5">{{ item.deptName }}</Col>
              <Col span="5">{{ item.memberLabel }}</Col>
              <Col span="5" class-name="operation">
                <Poptip placement="bottom" transfer width="280" v-model="item.userEntity.visible">
                  <a href="javascript:void(0)">
                    <Icon type="ios-more" size="30" color="#BFBFBF" />
                  </a>
                  <div slot="title" class="member-title">
                    <Icon
                      type="ios-arrow-back"
                      size="18"
                      class="role-arrow-back"
                      @click.native="returnBack"
                      v-show="visible"
                    />
                    <span>{{ title }}</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content" v-show="!visible">
                    <ul class="org-role">
                      <!-- <li style="cursor:pointer">
                        <span>批量任务交接</span>
                      </li>-->
                      <li
                        style="cursor:pointer"
                        @click.stop="visible = true;title = '添加至';memberId=item.memberId"
                      >
                        <span>添加至</span>
                      </li>
                    </ul>
                  </div>
                  <div slot="content" v-show="visible">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>
                        添加至
                        <br />
                      </span>
                      <Select v-model="model4">
                        <Option
                          v-for="item in departmentTreeNew"
                          :value="item.partmentId"
                          :key="item.partmentId"
                        >{{ item.partmentName }}</Option>
                      </Select>
                    </div>
                    <Button type="primary" long @click="addToDep(item,index)">确定</Button>
                  </div>
                </Poptip>
              </Col>
            </Row>
          </CheckboxGroup>
        </div>
      </div>
    </div>
    <!-- 成员详细信息 -->
    <Modal v-model="showUserInfo" width="500" class-name="vertical-center-modal" footer-hide>
      <p slot="header" class="userInfo-head">张三详细信息</p>
      <div class="userInfo-con">
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">
              姓名
              <span class="required">*</span>
            </div>
            <Input placeholder="姓名" v-model="userInfoList.userName" />
          </Col>
          <Col span="12">
            <div class="inpTit">邮箱</div>
            <Input placeholder="邮箱" v-model="userInfoList.memberEmail" />
          </Col>
        </Row>
        <Row :gutter="16" type="flex" align="bottom" class-name="userInfo-item">
          <Col span="24">
            <div class="inpTit">联系电话</div>
            <Input placeholder="联系电话" v-model="userInfoList.phone" />

            <!-- <Select>
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>-->
          </Col>
          <!-- <Col span="16">
            <Input>
              <span slot="prepend">+86</span>
            </Input>
          </Col>-->
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">生日</div>
            <DatePicker type="date" placeholder="请选择生日" :value="userInfoList.birthday"></DatePicker>
          </Col>
        </Row>
        <div class="dividing">
          <img src="../icons/img/gongzuoxinxi-01.png" alt />
          <span>工作信息</span>
        </div>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">员工类型</div>
            <Input placeholder="请选择员工类型" v-model="userInfoList.memberLabel" />
          </Col>
          <Col span="12">
            <div class="inpTit">入职时间</div>
            <DatePicker type="date" placeholder="请选择入职时间" :value="userInfoList.createTime"></DatePicker>
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="24">
            <div class="inpTit">部门</div>
            <Input placeholder="请选择" v-model="userInfoList.partment" />
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">职位</div>
            <Input placeholder="职位" v-model="userInfoList.job" />
          </Col>
          <Col span="12">
            <div class="inpTit">上级</div>
            <Input placeholder="上级" v-model="userInfoList.partment" />
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item" type="flex" align="bottom">
          <Col span="24">
            <div class="inpTit">办公地点</div>
            <Input placeholder="办公地点" v-model="userInfoList.address" />
          </Col>
          <!-- <Col span="8">
            <Input placeholder="省份(直辖市)" v-model="userInfoList.phone"/>
          </Col>
          <Col span="8">
            <Input placeholder="省份(直辖市)" />
          </Col>-->
        </Row>
      </div>
    </Modal>
    <!--添加人员至企业-->
    <Modal v-model="showAddPeople" width="450" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span v-if="tabOneShow">邀请您的团队成员加入企业</span>
        <span v-else>邀请加入企业外部人员</span>
      </p>
      <addPeopleCompany :tabOneShow="tabOneShow" @successInv="successInv" v-if="showAddPeople"></addPeopleCompany>
    </Modal>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import addPeopleCompany from "@/components/public/addPeopleCompany";
import {
  initOrgMemberNew,
  addBranchPeople,
  removeBranchPeople,
  searchOrgMembers
} from "@/axios/companyApi";
import { removeOrgUser } from "@/axios/api";

export default {
  components: {
    Loading,
    addPeopleCompany
  },
  data() {
    return {
      peopleList: [],
      visible: false,
      title: "更多菜单",
      model4: "",
      indeterminate: true,
      checkAll: false,
      checkAllGroup: [],
      memModal: false,
      showUserInfo: false, //成员详细信息弹窗
      loading: false,
      tabOneShow: "",
      showAddPeople: false,
      departmentTreeNew: [],
      allMemberType: [
        "企业成员",
        "新加入的成员",
        "未分配部门的成员",
        "停用的成员",
        "外部成员"
      ],
      flag: "",
      userInfoList: {},
      memberId: "",
      batchAdd: false, //批量添加弹窗
      batchRemoval: false, // 批量移除
      model5: ""
    };
  },
  computed: {},
  mounted() {
    this.loading = true;

    this.flag = 0;
    this.getList();
  },
  methods: {
    getList() {
      initOrgMemberNew(localStorage.companyId, this.flag).then(res => {
        if (res.result == 1) {
          this.peopleList = res.data.members;
          this.departmentTreeNew = res.data.partment;
        }
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
        this.peopleList.map(p => {
          this.checkAllGroup.push(p.memberId);
        });
        // this.checkAllGroup = ["1", "2", "3"];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.peopleList.length) {
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
    returnBack() {
      this.visible = false;
      this.title = "成员菜单";
    },
    showUserInfoModal(item) {
      console.log("详细");
      this.showUserInfo = true;
      this.userInfoList = item;
    },
    // 显示添加人员匡
    showAddModel(num) {
      this.tabOneShow = num;
      this.showAddPeople = true;
      this.memModal = false;
    },
    successInv() {
      this.showAddPeople = false;
      // 获取成员信息
      this.getList();
    },
    goMember() {
      this.$router.push("/members");
    },
    mdClose(index) {
      console.log("xxxxxxx");
      this.$set(this.peopleList[index].userEntity, "visible", false);
    },
    changeMemberType(item) {
      this.loading = true;
      switch (item) {
        case "所有成员":
          this.flag = 0;
          break;
        case "未分配部门的成员":
          this.flag = 1;
          break;
        case "停用的成员":
          this.flag = 2;
          break;
        case "新加入的成员":
          this.flag = 3;
          break;
        case "外部成员":
          this.flag = 5;
          break;
      }
      this.getList();
    },
    //添加到
    addToDep(item, index) {
      this.loading = true;

      let data = {
        memberId: item.memberId,
        orgId: localStorage.companyId
      };
      addBranchPeople(this.model4, data).then(res => {
        if (res.result == 1) {
          this.loading = true;
          this.$Message.success("添加成功");
          this.close();
          this.getList();
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    batchAddDep() {
      this.loading = true;
      let data = {
        memberId: this.checkAllGroup.join(","),
        orgId: localStorage.companyId
      };
      addBranchPeople(this.model5, data).then(res => {
        if (res.result == 1) {
          this.batchAdd = false;
          this.$Message.success("添加成功");
          this.close();
          this.getList();
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    // 从企业部门移除成员 确定
    removePP() {
      this.loading = true;
      removeOrgUser(this.checkAllGroup.join(","), localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.batchRemoval=false
          this.$Message.success("移除成功");
          this.close();
          this.getList();
        }
      });
    },
    // 搜索企业内成员  直接搜索
    searchOrgProple(event) {
      this.loading = true;
      if (event.currentTarget.value != "") {
        searchOrgMembers(
          event.currentTarget.value,
          localStorage.companyId
        ).then(res => {
          if (res.result === 1) {
            this.peopleList = res.data;
          } else {
            this.peopleList.length = 0;
            this.$Message.error("未搜索到成员");
          }
          this.loading = false;
        });
      }else {
        this.getList()
      }
    },
    close() {
      this.checkAllGroup = [];
      this.model5 = "";
      this.model4 = "";
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/managementS";
</style>