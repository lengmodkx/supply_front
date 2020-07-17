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
                <p @click="showAddModel(false)">添加外部成员</p>
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
        <Input prefix="ios-search" placeholder="搜索" />
      </div>
      <div class="table-title">
        <Dropdown trigger="click">
          <div>
            企业成员·{{peopleList.length}}
            <Icon type="ios-arrow-down" color="#999999"></Icon>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem>驴打滚</DropdownItem>
            <DropdownItem>炸酱面</DropdownItem>
            <DropdownItem>豆汁儿</DropdownItem>
            <DropdownItem>冰糖葫芦</DropdownItem>
            <DropdownItem>北京烤鸭</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="table-content">
        <Row class="titleRow">
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
                  <Checkbox :label="item.userEntity.userId">
                    <img :src="item.userEntity.image" alt />
                    <div>
                      <p class="userName">{{ item.userEntity.userName }}</p>
                      <div class="userPhone">{{item.userEntity.accountName}}</div>
                    </div>
                  </Checkbox>
                </div>
              </Col>
              <Col span="5">{{ item.parentName }}</Col>
              <Col span="5">{{ item.memberLabel }}</Col>
              <Col span="5" class-name="operation">
                <Poptip placement="bottom" transfer width="280" v-model="item.visible">
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
                      <li style="cursor:pointer">
                        <span>批量任务交接</span>
                      </li>
                      <li style="cursor:pointer" @click="visible = true;title = '添加至';">
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
                    <Button type="primary" long>确定</Button>
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
            <Input placeholder="姓名" />
          </Col>
          <Col span="12">
            <div class="inpTit">邮箱</div>
            <Input placeholder="邮箱" />
          </Col>
        </Row>
        <Row :gutter="16" type="flex" justify="center" align="bottom" class-name="userInfo-item">
          <Col span="8">
            <div class="inpTit">联系电话</div>
            <Select>
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="16">
            <Input>
              <span slot="prepend">+86</span>
            </Input>
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">生日</div>
            <DatePicker type="date" placeholder="请选择生日"></DatePicker>
          </Col>
        </Row>
        <div class="dividing">
          <img src="../icons/img/gongzuoxinxi-01.png" alt />
          <span>工作信息</span>
        </div>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">员工类型</div>
            <Input placeholder="请选择员工类型" />
          </Col>
          <Col span="12">
            <div class="inpTit">入职时间</div>
            <DatePicker type="date" placeholder="请选择入职时间"></DatePicker>
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="24">
            <div class="inpTit">部门</div>
            <Input placeholder="请选择" />
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">职位</div>
            <Input placeholder="职位" />
          </Col>
          <Col span="12">
            <div class="inpTit">上级</div>
            <Input placeholder="上级" />
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item" type="flex" justify="center" align="bottom">
          <Col span="6">
            <div class="inpTit">办公地点</div>
            <Input placeholder="办公地点" />
          </Col>
          <Col span="8">
            <Input placeholder="省份(直辖市)" />
          </Col>
          <Col span="8">
            <Input placeholder="省份(直辖市)" />
          </Col>
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
import { initOrgMemberNew } from "@/axios/companyApi";
// import { getTeamInfo } from "@/axios/api";

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
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model4: "",
      indeterminate: true,
      checkAll: false,
      checkAllGroup: [],
      memModal: false,
      showUserInfo: false, //成员详细信息弹窗
      loading: false,
      tabOneShow: "",
      showAddPeople: false,
      departmentTreeNew:[]
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      initOrgMemberNew(localStorage.companyId, 1).then(res => {
        if (res.result == 1) {
          res.data.members.forEach(i => {
            i.isChecked = false;
          });
          this.peopleList = res.data.members;
          // this.allOrgPeople = res.data.members;
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
        this.checkAllGroup = ["1", "2", "3"];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 3) {
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
      this.showUserInfo = true;
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
      // initOrgMemberNew(localStorage.companyId, 1).then(res => {
      //   if (res.result == 1) {
      //     res.data.members.forEach(i => {
      //       i.isChecked = false;
      //     });
      //     this.peopleList = res.data.members;
      //     this.allOrgPeople = res.data.members;
      //     this.departmentTreeNew = res.data.partment;
      //   }
      //   this.loading = false;
      // });
    },
    goMember() {
      this.$router.push("/members");
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/managementS";
</style>