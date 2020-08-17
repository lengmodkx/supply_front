<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>成员</div>
        <div class="icon-content">
          <div>
            <Poptip v-model="memModal" placement="bottom">
              <div class="branch">
                <img src="../assets/images/systemSet/jia.png" alt />
              </div>
              <div slot="content" class="popContent">
                <p @click="showAddModel(true)">添加企业成员</p>
                <p @click="showAddModel(false)">添加外部成员</p>
                <p @click="showBatchAdd=true">批量添加成员</p>
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
            {{changeName}}·{{peopleList.length}}
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
          <Col span="5" style="cursor: pointer;">
            <Dropdown @on-click="screenEnterRole" trigger="click">
                角色
                <Icon type="ios-funnel-outline" />
              <DropdownMenu slot="list">
                <DropdownItem :name="item.roleId" v-for="item in roles" :key="item.roleId">{{item.roleName}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
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
              @click.self.native="showUserInfoModal(item)"
            >
              <Col span="9">
                <div class="group-people-con">
                  <Checkbox :label="item.memberId" :disabled="item.organizationLable==1">
                    <img :src="item.userEntity.image" alt />
                  </Checkbox>
                  <div @click="showUserInfoModal(item)" style="width:100%;">
                    <p class="userName">{{ item.userEntity.userName }}</p>
                    <div class="userPhone">{{item.userEntity.accountName}}</div>
                  </div>
                  <!-- </Checkbox> -->
                </div>
              </Col>
              <Col span="5">{{ item.deptName }}</Col>
              <Col span="5">
                <div v-if="item.memberLabel=='拥有者' ||item.memberLabel=='管理员' ">{{ item.memberLabel }}</div>
                <div v-else @click="getUserId(item)">
                  <Dropdown @on-click="screenRole" trigger="click">
                    {{ item.memberLabel }}
                    <Icon type="ios-arrow-down" v-if="item.memberLabel!=='拥有者'||item.memberLabel=='管理员'" />
                    <DropdownMenu slot="list">
                      <DropdownItem
                        v-for="item in roles"
                        :key="item.roleId"
                        :name="item.roleId"
                      >{{item.roleName}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </Col>
              <Col span="5" class-name="operation">
                <Poptip
                  placement="bottom"
                  transfer
                  width="280"
                  v-model="item.userEntity.visible"
                  popper-class="operationBubble"
                >
                  <a href="javascript:void(0)">
                    <Icon type="ios-more" size="30" color="#BFBFBF" />
                  </a>
                  <div slot="title" class="member-title">
                    <Icon
                      type="ios-arrow-back"
                      size="18"
                      class="role-arrow-back"
                      @click.native="returnBack"
                      v-show="visible || visible2||visible1||visible3"
                    />
                    <span>{{ title }}</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content" v-show="!visible&& !visible2&&!visible1&&!visible3">
                    <ul class="org-role">
                      <li @click.stop="visible = true;title = '添加至';memberId=item.memberId">
                        <span>添加至</span>
                      </li>
                      <li
                        @click="visible1 = true;title = '停用账号';"
                        v-if="item.memberLabel!='拥有者'&&item.memberLock==1"
                      >
                        <span>停用账号</span>
                      </li>
                      <li
                        style="cursor:pointer"
                        @click="visible3 = true;title = '启用账号';"
                        v-if="item.memberLabel!='拥有者'&&item.memberLock!=1"
                      >
                        <span>启用账号</span>
                      </li>
                      <li @click="visible2 = true;title = '移除成员';" v-if="item.memberLabel!='拥有者'">
                        <span style="color:red">移除成员</span>
                      </li>
                    </ul>
                  </div>
                  <div slot="content" v-show=" visible " style="padding:8px 16px;">
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
                  <div slot="content" v-show="visible2" style="padding:8px 16px;">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>确认移除企业成员吗？</span>
                    </div>
                    <Button
                      type="error"
                      long
                      @click="remove(item.userEntity.userId,item.memberId)"
                    >确定</Button>
                  </div>
                  <div slot="content" v-show="visible1" style="padding:8px 16px;">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>
                        您确定要停用当前帐号吗？
                        <br />
                      </span>
                      <span>
                        • 被停用的帐号将无法访问该企业
                        <br />• 帐号信息仍保留，方便工作交接和管理
                        <br />• 支持帐号恢复
                      </span>
                    </div>
                    <Button type="error" long @click="lock(item.userEntity.userId,0)">确定</Button>
                  </div>
                  <div slot="content" v-show="visible3" style="padding:8px 16px;">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>
                        被启用的帐号将重新加入该企业，您确定要启用吗？
                        <br />
                      </span>
                      <span>该帐号的角色将恢复之前的角色</span>
                    </div>
                    <Button type="primary" long @click="lock(item.userEntity.userId,1)">确定</Button>
                  </div>
                </Poptip>
              </Col>
            </Row>
          </CheckboxGroup>
        </div>
      </div>
    </div>
    <!-- 成员详细信息 -->
    <Modal
      v-model="showUserInfo"
      width="500"
      class-name="vertical-center-modal"
      :ok-text="textBtn"
      @on-ok="saveUserInfo"
    >
      <p slot="header" class="userInfo-head">{{userInfoList.userName}}详细信息</p>
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
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">生日</div>
            <DatePicker type="date" placeholder="请选择生日" v-model="userInfoList.birthday"></DatePicker>
          </Col>
        </Row>
        <div class="dividing">
          <img src="../icons/img/gongzuoxinxi-01.png" alt />
          <span>工作信息</span>
        </div>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">员工类型</div>
            <Select v-model="userInfoList.memberLabel">
              <Option
                v-for="item in roles"
                :value="item.roleName"
                :key="item.roleName"
              >{{ item.roleName }}</Option>
            </Select>
          </Col>
          <Col span="12">
            <div class="inpTit">入职时间</div>
            <DatePicker type="date" placeholder="请选择入职时间" v-model="userInfoList.createTime"></DatePicker>
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="24">
            <div class="inpTit">部门</div>
            <Poptip placement="bottom" transfer>
              <Input placeholder="部门" v-model="userInfoList.partment" />
              <div slot="content" style="width:438px;padding:8px 16px;">
                <div>
                  <Tree
                    :data="departmentTree"
                    ref="tree"
                    @changePartment="changePartment"
                  ></Tree>
                </div>
              </div>
            </Poptip>
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item">
          <Col span="12">
            <div class="inpTit">职位</div>
            <Input placeholder="职位" v-model="userInfoList.job" />
          </Col>
          <Col span="12">
            <div class="inpTit">上级</div>
            <Input placeholder="上级" v-model="userInfoList.parentName" disabled />
          </Col>
        </Row>
        <Row :gutter="16" class-name="userInfo-item" type="flex" align="bottom">
          <Col span="24">
            <div class="inpTit">办公地点</div>
            <Input placeholder="办公地点" v-model="userInfoList.address" />
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
    <!-- 批量添加 -->
    <Modal v-model="showBatchAdd" width="500" class-name="vertical-center-modal" transfer>
      <p slot="header" class="userInfo-head">批量添加</p>
      <div class="userInfo-con">
        <Upload
          type="drag"
          :action="actionUrl"
          :before-upload="beforeUpload"
          :data="uploadData"
          :on-success="uploadSuccess"
        >
          <div style="padding: 20px 0" class="df ac uploadContent">
            <Icon type="md-add" />
            <div>添加Excel表格</div>
          </div>
        </Upload>
      </div>
      <div slot="footer">
        <div class="DownloadTem" @click="DownloadTemplate">下载成员模板</div>
      </div>
    </Modal>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import addPeopleCompany from "@/components/public/addPeopleCompany";
import { mapActions, mapState, mapMutations } from "vuex";
import { changeUser } from "@/axios/api2.js";
import {
  initOrgMemberNew,
  addBranchPeople,
  removeBranchPeople,
  searchOrgMembers,
  lockUser
} from "@/axios/companyApi";
import { removeOrgUser, updateOrgUserRole, userOrgRoles } from "@/axios/api";
import Tree from "./checkTree.vue";
export default {
  components: {
    Loading,
    addPeopleCompany,
    Tree
  },
  computed: {
    ...mapState("company", ["departmentTree"]),
    ...mapState("app", ["activeHeaderTag"])
  },
  data() {
    return {
      peopleList: [],
      visible: false,
      visible2: false,
      visible1: false,
      visible3: false,
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
      changeName: "企业成员",
      flag: "",
      userInfoList: {},
      memberId: "",
      batchAdd: false, //批量添加弹窗
      batchRemoval: false, // 批量移除
      model5: "",
      showBatchAdd: false,
      actionUrl: "", //导入地址
      uploadData: {},
      roles: [],
      roleMemberId: "",
      textBtn: "保存"
    };
  },
  created() {
    this.getDepartmentTree({ orgId: localStorage.companyId, departmentId: "" });
    console.log(this.departmentTree);
    this.actionUrl =
      "/api/organization/members/impUser/" + localStorage.companyId;
    this.loading = true;
    this.flag = 0;
    this.getList();
    this.visibleChange();
  },
  methods: {
    ...mapActions("company", ["getDepartmentTree"]),
    ...mapMutations("company", ["initTree"]),
    getList(memberLabel) {
      initOrgMemberNew(localStorage.companyId, this.flag,memberLabel).then(res => {
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
      this.visible2 = false;
      this.visible1 = false;
      this.visible3 = false;
      this.title = "更多菜单";
    },
    showUserInfoModal(item) {
      this.showUserInfo = true;
      item.birthday == "null" ? item.birthday : "";
      item.createTime = this.$moment(item.createTime).format("YYYY-MM-DD");
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
      this.$store.commit("app/changeHeaderTag", 2);
    },
    mdClose(index) {
      this.$set(this.peopleList[index].userEntity, "visible", false);
      this.visible = false;
      this.visible2 = false;
      this.visible1 = false;
      this.visible3 = false;
    },
    changeMemberType(item) {
      this.loading = true;
      this.visible = false;
      this.visible2 = false;
      this.visible1 = false;
      this.visible3 = false;
      this.changeName = item;
      switch (item) {
        case "企业成员":
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
      removeOrgUser(this.checkAllGroup.join(","), localStorage.companyId).then(
        res => {
          if (res.result == 1) {
            this.batchRemoval = false;
            this.$Message.success("移除成功");
            this.close();
            this.getList();
          }
        }
      );
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
      } else {
        this.getList();
      }
    },
    close() {
      this.checkAllGroup = [];
      this.model5 = "";
      this.model4 = "";
    },
    DownloadTemplate() {
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      window.location.href =
        url +
        "/organization/members/expOrgMember?orgId=" +
        localStorage.companyId;
    },
    beforeUpload(file) {
      this.actionUrl =
        "/organization/members/impUser/" + localStorage.companyId;
    },
    uploadSuccess(response) {
      if (response.result == 1) {
        this.$Message.success(response.data);
      } else {
        this.$Message.error("上传失败");
      }
    },
    visibleChange() {
      userOrgRoles(localStorage.userId, localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.roles = res.data;
        }
      });
    },
    getUserId(item) {
      this.roleMemberId = item.memberId;
    },
    screenRole(roleId) {
      this.loading=true
      updateOrgUserRole(roleId, this.roleMemberId, localStorage.companyId).then(
        res => {
          if (res.result == 1) {
            this.$Message.success("设置成功");
            this.getList();
          } else {
            this.$Message.success("设置失败");
          }
        }
      );
    },
    saveUserInfo() {
      let data = {
        memberId: this.userInfoList.memberId,
        orgId: localStorage.companyId,
        userName: this.userInfoList.userName,
        entryTime: this.$moment(this.userInfoList.createTime).format(
          "YYYY-MM-DD"
        ),
        job: this.userInfoList.job,
        memberLabel: this.userInfoList.memberLabel,
        address: this.userInfoList.address,
        memberEmail: this.userInfoList.memberEmail,
        phone: this.userInfoList.phone,
        birthday: this.$moment(this.userInfoList.birthday).format("YYYY-MM-DD"),
        deptId: this.userInfoList.pId
      };
      changeUser(data).then(res => {
        if (res.result == 1) {
          this.$Message.success(res.message);
          this.getList();
        }
      });
    },
    //停用账号
    lock(userId, lock) {
      this.visible1 = false;
      this.title = "成员菜单";
      lockUser(localStorage.companyId, userId, lock).then(res => {
        if (res.result == 1) {
          this.$Message.success("停用成功");
          this.getList();
        }
      });
    },
    //移除项目成员
    remove(userId, memberId) {
      this.visible2 = false;
      this.title = "成员菜单";
      removeOrgUser(userId, localStorage.companyId, memberId).then(res => {
        if (res.result === 1) {
          this.$Message.success("移除成功");
          this.getList();
        } else {
          this.$Notice.warning({
            title: "移除失败"
          });
        }
      });
    },
    // 获取某个部门下成员
    changePartment(partmentId, partmentName) {
      console.log(partmentId, partmentName);
      this.userInfoList.partment = partmentName;
      this.userInfoList.pId = partmentId;
    },
    screenEnterRole(name){
      this.loading=true
        this.getList(name)
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/managementS";
.ivu-upload-drag {
  border-color: #1b9aee;
}
.DownloadTem {
  text-align: left;
  color: #1b9aee;
  cursor: pointer;
}
</style>
<style lang="less" >
.operationBubble .ivu-poptip-body {
  padding: 0 !important;
}
</style>