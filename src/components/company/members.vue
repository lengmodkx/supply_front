<template>
  <div class="member-box">
    <div class="member-wrap">
      <div class="members">
        <!--左侧筛选成员-->
        <div class="member-left">
          <Input
            prefix="ios-search"
            class="search"
            @on-change="searchOrgProple"
            placeholder="搜索成员和部门"
          />
          <Tabs value="成员和部门" @on-click="clickTabs">
            <TabPane label="成员和部门" name="成员和部门">
              <div class="zzjg">
                <h3>成员</h3>
                <div
                  class="filter-member"
                  @click="changeMemberType(item)"
                  :class="{ checked: memberType == item }"
                  v-for="(item, index) in allMemberType"
                  :key="index"
                >
                  <img src="../../icons/img/chengyuan-01.png" alt v-if="index==0" />
                  <img src="../../icons/img/waibuchengyuan-01.png" alt v-else />
                  <span class="filter-title">{{ item }}</span>
                </div>
                <div class="line"></div>
                <h3 style="margin-top: 15px;color:#000">部门</h3>

                <div>
                  <div
                    class="organization-title"
                    v-if="departmentTreeNew.length>0"
                    @click="changeMemberType('所有成员')"
                  >
                    <img src="../../icons/img/qiye-apply-01.png" alt />
                    <span
                      class="organization-name"
                    >{{departmentTreeNew.length>0?departmentTreeNew[0].organizationName:''}}</span>
                  </div>
                  <div class="department-content">
                    <Tree
                      :data="departmentTree"
                      ref="tree"
                      @changePartment="changePartment"
                      @reSetPartment="reSetPartment"
                    ></Tree>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane label="企业群组" name="企业群组">
              <ul class="group-ul">
                <li
                  :class="{ checked: nowGroup.id === item.groupId }"
                  class="group-list"
                  v-for="(item, n) in groupData"
                  :key="n"
                  @click="changeNowGroup(item)"
                >
                  <Icon type="ios-contacts" size="30" />
                  <Tooltip style="margin-top: 5px" transfer :content="item.groupName">
                    <p class="w225">{{ item.groupName }}</p>
                  </Tooltip>
                </li>
              </ul>
            </TabPane>
          </Tabs>
          <!-- <div class="addBtn" v-if="tabType === '成员和部门'" @click="showCreateDep=true">
            创建部门
          </div>-->
          <div
            class="addBtn"
            @click="groupStep1 = true;groupStep2 = false;direct = true"
            v-if="tabType === '企业群组'"
          >创建群组</div>
        </div>
        <!--右侧显示成员-->
        <!--组织架构显示-->

        <div v-if="tabType === '成员和部门'" class="member-right">
          <header class="member-right-head">
            <div
              style="font-size: 16px"
            >{{ memberType }} · {{ peopleList.length ? peopleList.length : "0" }}</div>
            <div class="header-right">
              <!--添加成员 按钮-->
              <div class="branch branchs" @click="bmAdd" v-if="this.nowType == '部门'">
                <Icon type="md-add" />添加成员
              </div>
              <Poptip v-model="memModal" placement="bottom" v-else>
                <div class="branch">
                  <Icon type="md-add" />添加成员
                </div>
                <div slot="content">
                  <p @click="showAddModel(true)">添加企业成员</p>
                  <p @click="showAddModel(false)">添加外部成员</p>
                </div>
              </Poptip>

              <div class="branch" @click="management">
                <Icon type="ios-settings" />成员管理
              </div>
            </div>
          </header>
          <div v-if="showPrise" class="scroll-box-title">
            <Row class="titleRow" v-if="nowType === '成员'">
              <Col span="10" class-name="member-name">姓名</Col>
              <Col span="9">部门</Col>
              <Col span="5">角色</Col>
            </Row>
          </div>
          <div v-if="nowType === '部门'" class="scroll-box-title">
            <Row class="titleRow">
              <Col span="5" class-name="member-name">姓名</Col>
              <Col span="5">手机号</Col>
              <Col span="5">部门</Col>
              <Col span="5">职位</Col>
              <Col span="4">
                <Dropdown @on-click="screenRole">
                  <a href="javascript:void(0)">
                    角色
                    <Icon type="md-arrow-dropdown" />
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="1">成员</DropdownItem>
                    <DropdownItem name="3">管理员</DropdownItem>
                    <DropdownItem name="2">拥有者</DropdownItem>
                    <DropdownItem name="4">外部成员</DropdownItem>
                    <DropdownItem name="5">全部成员</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </div>
          <div class="scroll-box" v-if="showPrise">
            <Loading v-if="loading"></Loading>
            <!--点击成员显示-->
            <div v-if="nowType === '成员' && peopleList.length">
              <Row class="one-member" v-for="(item, index) in peopleList" :key="index">
                <Col span="10">
                  <div class="df" @click="showUserInfo(item)">
                    <img :src="item.image" alt />
                    <div>
                      <div class="one-member-name">{{item.userName }}</div>
                      <div class="member-phone">{{item.phone}}</div>
                    </div>
                  </div>
                </Col>
                <Col span="9">
                  <div @click="showUserInfo(item)">{{item.deptName?item.deptName:'-'}}</div>
                </Col>
                <Col span="5">
                  <span v-if="item.organizationLable == 1">拥有者</span>
                  <span v-else>{{item.memberLabel}}</span>
                </Col>
              </Row>
            </div>
            <!--点击部门显示-->
            <div v-else-if="nowType === '部门' && peopleList.length" class="branch-show">
              <Row class="branch-list" v-for="(i, n) in peopleList" :key="n">
                <Col span="5" class-name="member-name">
                  <div class="df">
                    <img :src="i.organizationMember.userEntity.image" alt />
                    <!-- <div> -->
                    <div class="one-member-name">{{i.organizationMember.userEntity.userName }}</div>
                    <!-- <div class="member-phone">{{item.accountName}}</div> -->
                    <!-- </div> -->
                  </div>
                </Col>
                <Col span="5">{{i.organizationMember.userEntity.accountName}}</Col>
                <Col span="5">{{i.organizationMember.deptName}}</Col>
                <Col span="5">{{i.organizationMember.job}}</Col>
                <Col span="4">
                  <span v-if="i.organizationMember.organizationLable == 1">拥有者</span>
                  <span v-else>{{i.organizationMember.memberLabel}}</span>
                  <!-- <div class="operation">
                    <Poptip placement="bottom"  v-model="i.userEntity.visible">
                      <div class="operation-title">
                        <Icon type="ios-arrow-down" size="20" />
                      </div>
                      <div slot="content">
                        <div class="operation-body-title">
                          部门成员菜单
                          <Icon type="md-close" @click="mdClose(n)" />
                        </div>
                        <div class="operation-list" @click="removePP(i.userEntity.userId)">从部门移除成员</div>
                        <div class="operation-list">
                          <Poptip class="delete-alert" confirm title="确定从企业中移除成员？" @on-ok="remove(i.userEntity.userId)">
                            <div style="color: #ff4f3e">从企业移除成员</div>
                          </Poptip>
                        </div>
                      </div>
                    </Poptip>
                  </div>-->
                </Col>
              </Row>
            </div>
            <div v-else class="no-memebers">
              <img src="../../icons/img/no-list.png" alt />
            </div>
          </div>
        </div>
        <!--企业群组显示-->
        <div v-if="tabType === '企业群组'" class="member-right">
          <header class="member-right-head">
            <div
              style="font-size: 16px"
            >{{ nowGroup.name }} · {{ groupPeople.length ? groupPeople.length : "0" }}</div>
            <div class="header-right">
              <!--添加成员 按钮-->
              <div class="branch" @click="showAddGroupPeople">
                <Icon type="md-add" />添加成员
              </div>
              <!-- 更多 按钮-->
              <div class="more-bumen-opearte">
                <img
                  :src="checkIconType=='message'?messageA:message"
                  @mouseover="checkIcon('message')"
                  @mouseleave="leaveIcon"
                />

                <Poptip v-model="branchMenu">
                  <!-- <Icon type="ios-more" /> -->
                  <img
                    :src="checkIconType=='more'?moreA:more"
                    @mouseover="checkIcon('more')"
                    @mouseleave="leaveIcon"
                  />
                  <div slot="content">
                    <div class="branch-title">
                      <span>
                        <Icon
                          @click="branchMenuTitle = '群组菜单'"
                          v-show="branchMenuTitle !== '群组菜单'"
                          type="ios-arrow-back"
                          size="20"
                        />
                      </span>
                      {{ branchMenuTitle }}
                      <Icon @click="branchMenu = false" type="md-close" size="20" />
                    </div>
                    <div class="branch-menu-con">
                      <ul class="bmcd" v-show="branchMenuTitle === '群组菜单'">
                        <li @click="branchMenuTitle = '编辑群组'">编辑群组</li>
                        <li style="color: #ff4f3e" @click="branchMenuTitle = '删除群组'">删除群组</li>
                      </ul>
                      <div class="bjbm" v-show="branchMenuTitle === '编辑群组'">
                        <input type="text" v-model="nowGroup.name" />
                        <Button
                          long
                          type="info"
                          :loading="isCreateBranch"
                          @click="changeGroupName"
                        >保存</Button>
                      </div>
                      <div class="scbm" v-show="branchMenuTitle === '删除群组'">
                        <span>您确定要删除当前群组吗？</span>
                        <Button
                          long
                          type="error"
                          :loading="isCreateBranch"
                          @click="deleteGroupOk"
                        >确定</Button>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </div>
            </div>
          </header>
          <div class="scroll-box-title">
            <Row class="titleRow" type="flex" justify="space-between">
              <Col span="10" class-name="member-name">姓名</Col>
              <Col span="5">操作</Col>
            </Row>
          </div>
          <div class="scroll-box">
            <Loading v-if="loading"></Loading>
            <Row
              type="flex"
              justify="space-between"
              class="group-people"
              v-for="(item, index) in groupPeople"
              :key="index"
            >
              <Col span="10" class-name="member-name">
                <div class="group-people-con">
                  <img :src="item.image" alt />
                  <div>
                    <p class="userName">{{ item.userName }}</p>
                    <div class="userPhone">{{item.phone}}</div>
                  </div>
                </div>
              </Col>
              <Col span="5">
                <Poptip placement="bottom" transfer width="280" v-model="item.userEntity.visible">
                  <span v-if="isOwnerCom">{{ item.isOwner ? "退出" : "移除企业" }}</span>
                  <span v-else-if="item.memberId==userId">退出</span>
                  <div slot="title" class="member-title">
                    <span>{{ item.isOwner ? "退出群组" : "移除企业" }}</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.self="closeExit(index)"
                    />
                  </div>
                  <div slot="content">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span v-if="item.isOwner">退出群组后，拥有者将移交给下一位成员</span>
                      <span v-else>你确定把 {{item.userName}} 从群组中移除吗？</span>
                    </div>
                    <Button type="error" long @click="groupExit(item)">确定</Button>
                  </div>
                </Poptip>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <!--添加人员至企业-->

    <Modal v-model="showAddPeople" width="450" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span v-if="tabOneShow">邀请您的团队成员加入企业</span>
        <span v-else>邀请加入企业外部人员</span>
      </p>
      <addPeopleCompany :tabOneShow="tabOneShow" @successInv="successInv" v-if="showAddPeople"></addPeopleCompany>
    </Modal>
    <!--添加人员至部门-->
    <Modal v-model="showAddPeople1" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>添加成员至部门</span>
      </p>
      <addPeople
        @addPeople1="addPeople1"
        v-if="showAddPeople1"
        :invitUsers="allOrgPeople"
        :type="nowType"
        :partmentId="partmentId"
      ></addPeople>
    </Modal>
    <!--创建群组 框1 输入群组名称-->
    <Modal v-model="groupStep1" width="360" class-name="vertical-center-modal">
      <p slot="header" class="craete-group-head">创建群组</p>
      <div class="craete-group-con">
        <div class="craete-group-con-text">群组名称</div>
        <Input v-model="groupName" placeholder="请输入群组名称" />
        <div class="craete-group-con-text">所属企业</div>
        <div
          class="craete-group-depName"
        >{{departmentTreeNew.length>0?departmentTreeNew[0].organizationName:'0'}}</div>
      </div>
      <div slot="footer">
        <Button type="info" size="large" :disabled="!groupName" long @click="addGroupNext">下一步</Button>
      </div>
    </Modal>
    <!--创建群组 框2 添加、选择人员-->
    <Modal v-model="groupStep2" width="400" class-name="vertical-center-modal">
      <p slot="header" class="craete-group-head">
        <Icon v-if="!againAdd" type="ios-arrow-back" @click="groupStep2 = false" />选择企业成员
      </p>
      <div class="craete-group-con">
        <Input search @on-search="searchOrgPeople" placeholder="搜索企业成员.." />
        <Row type="flex" justify="space-between" class="code-row-bg" v-if="direct">
          <Col span="11">
            <Select v-model="changeSRole" placeholder="角色" @on-change="modalChange" clearable>
              <Icon type="md-person" slot="prefix" color="#0077FF" />
              <Option
                v-for="item in roleList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="11">
            <Select v-model="changeDep" placeholder="部门" @on-change="selectDep" clearable>
              <Icon type="md-git-branch" slot="prefix" color="#0077FF" />
              <Option
                v-for="item in departmentTreeNew"
                :value="item.partmentId"
                :key="item.partmentId"
              >{{ item.partmentName }}</Option>
            </Select>
          </Col>
        </Row>
        <Loading v-if="loadings"></Loading>
        <div class="people-title">成员</div>
        <ul class="people-ul">
          <CheckboxGroup v-model="social" @on-change="peopleCheck">
            <li v-for="(item, index) in allOrgPeople" :key="index" @click="checkedPeople(index)">
              <div>
                <Checkbox :label="item.userEntity.userId" class="df people-check">
                  <div class="df">
                    <img :src="item.userEntity.image" alt />
                    <p>{{ item.userEntity.userName }}</p>
                  </div>
                </Checkbox>
              </div>
            </li>
          </CheckboxGroup>
        </ul>
      </div>
      <div slot="footer" class="df ac craete-group-foot">
        <div class="selected">已选{{social.length}}</div>
        <Button
          type="info"
          :loading="isCreateBranch"
          size="large"
          @click="createGroup"
          :disabled="social.length==0"
        >完成</Button>
      </div>
    </Modal>
    <!-- 成员详细信息 -->
    <Modal v-model="groupStepInfo" width="500" class-name="vertical-center-modal" footer-hide>
      <p slot="header" class="craete-group-head">成员详细信息</p>
      <div class="craete-group-con">
        <div class="df con-content">
          <img src="../../icons/img/jichuxinxi-01.png" class="iconImg" />
          <div class="con-content-text">基础信息</div>
          <div class="line"></div>
        </div>
        <div class="df con-content">
          <img :src="userInfoList.image" class="userHeader" />
          <div>{{userInfoList.userName==null?'----':userInfoList.userName }}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">邮箱</div>
          <div>{{userInfoList.memberEmail==null?'----':userInfoList.memberEmail}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">联系电话</div>
          <div>{{userInfoList.phone==null?'----':userInfoList.phone}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">生日</div>
          <div>{{userInfoList.birthday=='null'?'----':userInfoList.birthday}}</div>
        </div>
        <div class="df con-content">
          <img src="../../icons/img/gongzuoxinxi-01.png" class="iconImg" />
          <div class="con-content-text">工作信息</div>
          <div class="line"></div>
        </div>
        <div class="df con-content">
          <div class="content-title">员工类型</div>
          <div>{{userInfoList.memberType==null?'----':userInfoList.memberType}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">司龄</div>
          <div>{{userInfoList.stayComDate==null?'----':userInfoList.stayComDate}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">部门</div>
          <div>{{userInfoList.deptName==null?'----':userInfoList.deptName}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">职位</div>
          <div>{{userInfoList.job==null?'----':userInfoList.job}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">上级</div>
          <div>{{userInfoList.parentName==null?'----':userInfoList.parentName}}</div>
        </div>
        <div class="df con-content">
          <div class="content-title">办公地点</div>
          <div>{{userInfoList.address==null?'----':userInfoList.address}}</div>
        </div>
      </div>
    </Modal>
    <!-- 创建部门 -->
    <Modal v-model="showCreateDep" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>创建部门</span>
      </p>
      <Input v-model="branchName" placeholder="部门名称" class="branch-name" />
      <Button
        long
        type="info"
        :loading="isCreateBranch"
        :disabled="branchName == ''"
        @click="createBranch"
      >创建</Button>
    </Modal>
  </div>
</template>

<script>
import addPeople from "@/components/public/addPeople";
import addPeopleCompany from "@/components/public/addPeopleCompany";
import branch from "./branch";
import { mapState, mapActions, mapMutations } from "vuex";
import Tree from "@/components/company/Tree.vue";
import {
  userOrgRoles,
  updateOrgUserRole,
  removeOrgUser
} from "../../axios/api.js";
import {
  initOrgMember,
  createBranchs,
  getBranch,
  getBranchpeople,
  changeBranchNames,
  deleteBranch,
  addGroup,
  getGroups,
  getGroupPeople,
  addGroupPeople,
  changeGroupsname,
  deleteGroup,
  lockUser,
  removeBranchPeople,
  searchOrgMembers,
  initOrgMemberNew,
  getOrgPartmentByMemberLebel,
  groupRemoval
} from "@/axios/companyApi";

export default {
  name: "members",
  computed: {
    ...mapState("company", ["departmentTree"]),
    ...mapState("app", ["activeHeaderTag"])
  },
  data() {
    return {
      branch: false,
      memberType: "所有成员",
      branchName: "",
      groupStep1: false,
      groupStep2: false,
      groupName: "",
      showAddPeople: false, //显示添加企业成员
      showAddPeople1: false,
      showPrise: true,
      peopleList: [],
      memModal: false,
      loading: true,
      isCreateBranch: false,
      allMemberType: ["所有成员", "外部成员"],
      operationMenu: false,
      isdown: true,
      nowType: "成员",
      nowBranch: {
        id: "",
        name: ""
      },
      partmentId: "",
      bumenChecked: "",
      isCreateGroup: false,
      sonBranchName: "",
      sonBranch: false,
      branchMenu: false,
      branchMenuTitle: "部门菜单",
      allOrgPeople: [],
      groupData: [],
      tabType: "成员和部门",
      nowGroup: {
        name: "",
        id: ""
      },
      groupPeople: [],
      againAdd: false,
      visible: false,
      visible1: false,
      title: "成员菜单",
      roles: [],
      user: {},
      flag: 0,
      departmentTreeNew: [],
      checkId: "",
      groupStepInfo: false,
      userInfoList: [],
      roleList: [
        {
          value: "1",
          label: "成员"
        },
        {
          value: "3",
          label: "管理者"
        },
        {
          value: "2",
          label: "拥有者"
        },
        {
          value: "4",
          label: "外部成员"
        }
      ],
      changeSRole: "",
      changeDep: "",
      tabOneShow: true, //是不是邀请内部部成员
      showCreateDep: false, //创建部门弹窗
      loadings: false,
      direct: true, //群组直接点击添加成员
      social: [],
      checkIconType: "",
      messageA: require("../../icons/img/liaotianA.png"),
      message: require("../../icons/img/liaotian-01.png"),
      more: require("../../icons/img/gengduo-01.png"),
      moreA: require("../../icons/img/gengduoA.png"),
      userId: localStorage.userId,
      isOwnerCom: false
    };
  },
  mounted() {},
  components: { Tree, addPeople, branch, addPeopleCompany },
  methods: {
    ...mapActions("company", ["getDepartmentTree"]),
    ...mapMutations("company", ["initTree"]),
    mdClose(index) {
      this.$set(this.peopleList[index].userEntity, "visible", false);
    },
    returnBack() {
      this.visible = false;
      this.visible1 = false;
      this.title = "成员菜单";
    },
    lock(userId, lock) {
      this.visible1 = false;
      this.title = "成员菜单";
      lockUser(localStorage.companyId, userId, lock).then(res => {
        if (res.result == 1) {
          initOrgMember(localStorage.companyId, this.flag).then(res => {
            if (res.result === 1) {
              this.peopleList = res.data;
            }
          });
        }
      });
    },
    // tab切换
    clickTabs(value) {
      if (value === "成员和部门") {
        this.tabType = "成员和部门";
        this.branchMenuTitle = "部门菜单";
      } else if (value === "企业群组") {
        //this.showgetGroups();
        this.tabType = "企业群组";
        this.branchMenuTitle = "群组菜单";
      }
    },
    // 页面初始化
    initMember() {
      // 获取成员信息
      initOrgMemberNew(localStorage.companyId, 0).then(res => {
        if (res.result == 1) {
          res.data.members.forEach(i => {
            i.isChecked = false;
          });
          this.peopleList = res.data.members;
          this.allOrgPeople = res.data.members;
          this.departmentTreeNew = res.data.partment;
          if(this.$route.query.from=='home'){
               this.peopleList.forEach(i => {
                  if(i.memberId==this.$route.query.id){
                    this.showUserInfo(i)
                  }
                })
          }
        }
        this.loading = false;
      });
      //获取群组信息
      getGroups(localStorage.companyId).then(res => {
        this.groupData = res.data;
        this.nowGroup.name = this.groupData[0].groupName;
        this.nowGroup.id = this.groupData[0].groupId;
        getGroupPeople(this.groupData[0].groupId).then(res => {
          this.groupPeople = res.data;
          this.groupPeople.map(p => {
            if (p.isOwner && p.memberId == this.userId) {
              this.isOwnerCom = true;
            }
          });
        });
      });
    },
    // 显示添加人员匡
    showAddModel(num) {
      this.tabOneShow = num;
      this.showAddPeople = true;
      // if ([0, 1, 2, 3].indexOf(this.flag) != -1) {
      //   this.showAddPeople = true;
      // } else {
      //   this.showAddPeople1 = true;
      // }
      this.memModal = false;
    },
    bmAdd() {
      this.showAddPeople1 = true;
    },
    // 添加成员 回调
    addPeople1(data) {
      this.changePartment(data.partmentId, data.partmentName);
    },
    // 点击左侧 成员类型
    changeMemberType(item) {
      this.nowType = "成员";
      this.memberType = item;
      this.loading = true;
      switch (item) {
        case "外部成员":
          this.flag = 5;
          break;
        case "所有成员":
          this.flag = 0;
          break;
      }
      initOrgMemberNew(localStorage.companyId, this.flag).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.peopleList = res.data.members;
        }
      });
    },
    // 创建部门
    createBranch() {
      this.isCreateBranch = true;

      let data = {
        partmentName: this.branchName
      };
      createBranchs(localStorage.companyId, data).then(res => {
        if (res.result == 1) {
          // this.getDepartmentTree({ orgId: localStorage.companyId, departmentId: "" });
          // 获取成员信息
          initOrgMemberNew(localStorage.companyId, 0).then(res => {
            if (res.result == 1) {
              res.data.members.forEach(i => {
                i.isChecked = false;
              });
              this.peopleList = res.data.members;
              this.allOrgPeople = res.data.members;
              this.departmentTreeNew = res.data.partment;
            }
            this.loading = false;
          });
        }
        this.isCreateBranch = false;
        this.branch = false;
        this.showCreateDep = false;
        this.branchName = "";
      });
    },

    // 获取某个部门下成员
    changePartment(partmentId, partmentName) {
      // this.flag = -1;
      this.nowType = "部门";
      this.partmentId = partmentId;
      this.memberType = partmentName;
      this.nowBranch.id = partmentId;
      this.nowBranch.name = partmentName;
      this.loading = true;

      getBranchpeople(partmentId).then(res => {
        if (res.result == 1) {
          this.peopleList = res.data;
          this.loading = false;
        }
      });
    },
    // 改变部门名称
    changeBranchName() {
      this.isCreateBranch = true;
      let data = {
        partmentName: this.nowBranch.name
      };
      changeBranchNames(this.nowBranch.id, data).then(res => {
        if (res.result == 1) {
          this.isCreateBranch = false;
          this.$Message.success("修改成功");
          this.branchMenu = false;
          this.memberType = this.nowBranch.name;
          this.branchMenuTitle = "部门菜单";
          this.$refs.tree.updateNodeName(
            this.nowBranch.id,
            this.nowBranch.name
          );
        }
      });
    },
    // 删除部门
    deleteIt() {
      this.isCreateBranch = true;
      deleteBranch(this.nowBranch.id).then(res => {
        if (res.result == 1) {
          this.$Message.success("删除成功");
          this.isCreateBranch = false;
          this.branchMenu = false;
          this.branchMenuTitle = "部门菜单";
          this.$refs.tree.removeNode(this.nowBranch.id);
        }
      });
    },
    // 从企业部门移除成员 确定
    removePP(userId) {
      var data = { orgId: localStorage.companyId, memberId: userId };
      removeBranchPeople(this.partmentId, data).then(res => {
        if (res.result == 1) {
          this.changePartment(res.data.partmentId, res.data.partmentName);
        }
      });
    },
    createGroup() {
      this.isCreateBranch = true;
      if (this.direct) {
        let data = {
          groupName: this.groupName,
          memberIds: this.social.join(",")
        };
        addGroup(localStorage.companyId, data).then(res => {
          if (res.result) {
            this.isCreateBranch = false;
            this.groupStep1 = false;
            this.groupStep2 = false;
            this.social = [];
            this.groupData.push(res.data);
          }
        });
      } else {
        addGroupPeople(this.nowGroup.id, this.social.join(",")).then(res => {
          if (res.result) {
            this.isCreateBranch = false;
            this.groupStep1 = false;
            this.groupStep2 = false;
            this.direct = true;
            this.social = [];
            this.$Message.success("添加成功");
            getGroupPeople(this.nowGroup.id).then(res => {
              this.groupPeople = res.data;
              this.groupPeople.map(p => {
                if (p.isOwner && p.memberId == this.userId) {
                  this.isOwnerCom = true;
                }
              });
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    // 创建群组的下一步
    addGroupNext() {
      this.groupStep2 = true;
      this.loadings = true;
      initOrgMember(localStorage.companyId).then(res => {
        if (res.result) {
          if (res.data === "无数据") {
            console.log("企业并没有成员");
          } else {
            res.data.forEach(i => {
              i.isChecked = false;
            });
            this.allOrgPeople = res.data;
            this.loadings = false;
          }
        }
      });
    },
    // 选中成员
    checkedPeople(n) {
      this.allOrgPeople[n].isChecked = !this.allOrgPeople[n].isChecked;
    },
    // 搜索企业内成员  直接搜索
    searchOrgProple(event) {
      this.loading = true;
      if (event.currentTarget.value === "") {
        this.memberType = "所有成员";
        initOrgMember(localStorage.companyId).then(res => {
          if (res.result === 1) {
            res.data.forEach(i => {
              i.isChecked = false;
            });
            this.peopleList = res.data;
            this.allOrgPeople = res.data;
          }
          this.showPrise = true;
          this.loading = false;
        });
      } else {
        this.memberType = "企业成员";
        searchOrgMembers(
          event.currentTarget.value,
          localStorage.companyId
        ).then(res => {
          if (res.result === 1) {
            this.showPrise = true;
            this.peopleList = res.data;
          } else {
            this.showPrise = false;
            this.peopleList.length = 0;
            this.$Message.error("未搜索到成员");
          }
          this.loading = false;
        });
      }
    },
    // 搜索企业内成员   创建群组时使用
    searchOrgPeople(event) {
      this.loadings = true;
      searchOrgMembers(event, localStorage.companyId).then(res => {
        if (res.result === 1) {
          this.allOrgPeople = res.data;
        } else {
          this.showPrise = false;
          this.allOrgPeople.length = 0;
          this.$Message.error("未搜索到成员");
        }
        this.loadings = false;
      });
    },
    // 点击某个群组
    changeNowGroup(item) {
      this.nowGroup.name = item.groupName;
      this.nowGroup.id = item.groupId;
      getGroupPeople(item.groupId).then(res => {
        this.groupPeople = res.data;
        this.groupPeople.map(p => {
          if (p.isOwner && p.memberId == this.userId) {
            this.isOwnerCom = true;
          }
        });
      });
    },
    // 点击群组的添加成员 按钮
    showAddGroupPeople() {
      this.direct = false;
      this.groupStep2 = true;
      this.againAdd = true;
      this.allOrgPeople.forEach((i, n) => {
        this.groupPeople.forEach(j => {
          if (i.groupId === j.groupId) {
            this.allOrgPeople.splice(n, 1);
          }
        });
      });
    },
    // 改变群组名称
    changeGroupName() {
      this.isCreateBranch = true;
      changeGroupsname(this.nowGroup.id, this.nowGroup.name).then(res => {
        this.groupData.forEach(i => {
          if (i.groupId === this.nowGroup.id) {
            i.groupName = this.nowGroup.name;
          }
        });
        this.branchMenu = false;
        this.$Message.success("修改成功");
        this.isCreateBranch = false;
      });
    },
    // 删除群组
    deleteGroupOk() {
      this.isCreateBranch = true;
      deleteGroup(this.nowGroup.id).then(res => {
        this.branchMenu = false;
        this.$Message.success("删除成功");
        this.isCreateBranch = false;
        this.groupData.forEach((i, n) => {
          if (i.groupId === this.nowGroup.id) {
            this.groupData.splice(n, 1);
          }
        });
        if (this.groupData.length) {
          this.changeNowGroup(this.groupData[0]);
        } else {
          this.nowGroup.name = "";
          this.nowGroup.id = "";
          this.groupPeople = [];
        }
      });
    },
    visibleChange(user) {
      this.user = user;
      userOrgRoles(user.userId, localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.roles = res.data;
        }
      });
    },
    changeRole(roleId) {
      updateOrgUserRole(roleId, this.user.userId, localStorage.companyId).then(
        res => {
          if (res.result == 1) {
            this.$Message.success("设置成功");
            this.user.visible = false;
          } else {
            this.$Message.success("设置失败");
          }
        }
      );
    },
    //移除项目成员
    remove(userId, memberId) {
      this.visible = false;
      this.title = "成员菜单";
      removeOrgUser(userId, localStorage.companyId, memberId).then(res => {
        if (res.result === 1) {
          // wjwjwj
          initOrgMemberNew(localStorage.companyId, 0).then(res => {
            if (res.result == 1) {
              res.data.members.forEach(i => {
                i.isChecked = false;
              });
              this.memberType = "所有成员";
              this.checkId = "";
              this.peopleList = res.data.members;
              this.allOrgPeople = res.data.members;
              this.departmentTreeNew = res.data.partment;
            }
            this.loading = false;
          });
        } else {
          this.$Notice.warning({
            title: "移除失败"
          });
        }
      });
    },
    //点击部门显示部门成员
    DepMembers(item, index) {
      // this.flag = -1;
      this.nowType = "部门";
      this.partmentId = item.partmentId;
      this.checkId = item.partmentId;
      this.memberType = item.partmentName;
      this.nowBranch.id = item.partmentId;
      this.nowBranch.name = item.partmentName;
      this.partmentId = item.partmentId; //部门id
      this.loading = true;
      getBranchpeople(item.partmentId).then(res => {
        if (res.result == 1) {
          this.peopleList = res.data;
          this.loading = false;
        }
      });
    },
    //部门列表筛选角色
    screenRole(name) {
      this.loading = true;
      if (name == 1 || name == 2 || name == 3) {
        getOrgPartmentByMemberLebel(
          localStorage.companyId,
          this.partmentId,
          "",
          name
        ).then(res => {
          this.loading = false;
          if (res.result === 1) {
            this.peopleList = res.data;
          }
        });
      } else if (name == 4) {
        getOrgPartmentByMemberLebel(
          localStorage.companyId,
          this.partmentId,
          0
        ).then(res => {
          this.loading = false;
          if (res.result === 1) {
            this.peopleList = res.data;
          }
        });
      } else {
        getOrgPartmentByMemberLebel(
          localStorage.companyId,
          this.partmentId,
          1
        ).then(res => {
          this.loading = false;
          if (res.result === 1) {
            this.peopleList = res.data;
          }
        });
      }
    },
    showUserInfo(item) {
      this.userInfoList = item;
      this.groupStepInfo = true;
    },
    selectDep(value) {
      if (value == undefined) {
        this.changeDep = "";
      } else {
        this.changeDep = value;
      }
      this.getMemberLebel();
    },
    //新建群组 筛选角色和部门添加成员
    modalChange(value) {
      if (value == undefined) {
        this.changeSRole = "5";
      } else {
        this.changeSRole = value;
      }
      this.getMemberLebel();
    },

    getMemberLebel() {
      this.loadings = true;
      if (
        this.changeSRole == 1 ||
        this.changeSRole == 2 ||
        this.changeSRole == 3
      ) {
        getOrgPartmentByMemberLebel(
          localStorage.companyId,
          this.changeDep,
          "",
          this.changeSRole
        ).then(res => {
          this.loadings = false;
          if (res.result === 1) {
            this.allOrgPeople = res.data;
          }
        });
      } else if (this.changeSRole == 4) {
        getOrgPartmentByMemberLebel(
          localStorage.companyId,
          this.changeDep,
          0
        ).then(res => {
          this.loadings = false;
          if (res.result === 1) {
            this.allOrgPeople = res.data;
          }
        });
      } else {
        getOrgPartmentByMemberLebel(
          localStorage.companyId,
          this.changeDep,
          1
        ).then(res => {
          this.loadings = false;
          if (res.result === 1) {
            this.allOrgPeople = res.data;
          }
        });
      }
    },
    successInv() {
      this.showAddPeople = false;
      // 获取成员信息
      initOrgMemberNew(localStorage.companyId, 0).then(res => {
        if (res.result == 1) {
          res.data.members.forEach(i => {
            i.isChecked = false;
          });
          this.peopleList = res.data.members;
          this.allOrgPeople = res.data.members;
          this.departmentTreeNew = res.data.partment;
        }
        this.loading = false;
      });
    },
    peopleCheck() {},
    checkIcon(type) {
      this.checkIconType = type;
    },
    leaveIcon() {
      this.checkIconType = "";
    },
    //群组退出或者移除
    groupExit(item) {
      groupRemoval(this.nowGroup.id, item.memberId).then(res => {
        if (res.result == 1) {
          this.$Message.success("移除成功");
          //获取群组信息
          getGroups(localStorage.companyId).then(res => {
            this.groupData = res.data;
            this.nowGroup.name = this.groupData[0].groupName;
            this.nowGroup.id = this.groupData[0].groupId;
            getGroupPeople(this.groupData[0].groupId).then(res => {
              this.groupPeople = res.data;
              this.groupPeople.map(p => {
                if (p.isOwner && p.memberId == this.userId) {
                  this.isOwnerCom = true;
                }
              });
            });
          });
        }
      });
    },
    closeExit(index) {
      this.$set(this.groupPeople[index].userEntity, "visible", false);
    },
    reSetPartment() {
      this.memberType = "所有成员";
      this.loading = true;
      this.nowType = "成员";
      initOrgMember(localStorage.companyId, this.flag).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.peopleList = res.data;
        }
      });
    },
    //成员管理
    management() {
      this.$router.push({ name: "systemSettings", query: { from: "members" } });
      this.$store.commit("app/changeHeaderTag", 3);
    }
  },
  created() {
    this.initMember();
    this.getDepartmentTree({ orgId: localStorage.companyId, departmentId: "" });
  }
};
</script>

<style scoped lang="less">
@import "./css/members.less";

.title {
  text-align: center;

  i {
    position: absolute;
    left: 5px;
  }
}

.org-role {
  li {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: #e5e5e5;
    }
  }
}

.member-title {
  position: relative;
  text-align: center;

  .role-md-close {
    position: absolute;
    right: 0px;
  }

  .role-arrow-back {
    position: absolute;
    left: 0px;
  }
}

/deep/.member-left .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
  border-color: #0d253f !important;
}

/deep/.member-left .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #0d253f;
}

/deep/.member-left .ivu-tabs-nav .ivu-tabs-tab-active {
  color: #0d253f;
}

/deep/.member-left .ivu-tabs-ink-bar {
  background-color: #0d253f;
}
</style>