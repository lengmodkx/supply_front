<template>
  <div class="member-box">
    <div class="member-wrap">
      <div class="members">
        <!--左侧筛选成员-->
        <div class="member-left">
          <Input  class="search"  @on-change="searchOrgProple"   placeholder="搜索企业内成员..." />
          <Tabs value="组织架构" @on-click="clickTabs">
            <TabPane label="组织架构" name="组织架构">
              <div class="zzjg">
                <h3 style="color:#000">成员</h3>
                <div class="filter-member" @click="changeMemberType(item)" :class="{ checked: memberType == item }" v-for="(item, index) in allMemberType" :key="index">
                  {{ item }}
                </div>
                <h3 style="margin-top: 15px;color:#000">部门</h3>
                <div class="branch-head">
                  <Poptip v-model="branch" transfer>
                    <div class="branch">
                      <Icon @click="branch = false" type="md-add-circle" />
                      创建部门
                    </div>
                    <div slot="content">
                      <div class="branch-title">
                        <span></span>创建部门
                        <Icon @click="branch = false" type="md-close" size="20" />
                      </div>
                      <Input v-model="branchName" placeholder="部门名称" class="branch-name" />
                      <Button long type="info" :loading="isCreateBranch" :disabled="branchName == ''" @click="createBranch">创建 </Button>
                    </div>
                  </Poptip>
                  <!--<div class="bsort"><Icon type="md-swap" />部门排序</div>-->
                </div>
                <Tree :data="departmentTree" ref="tree" @changePartment="changePartment" @reSetPartment="reSetPartment"></Tree>
                <!-- <branch @getBranchMember="getBranchMember" :branchData="branchData"></branch> -->
              </div>
            </TabPane>
            <TabPane label="企业群组" name="企业群组">
              <div
                class="branch"
                @click="
                  groupStep1 = true;
                  groupStep2 = false;
                "
              >
                <Icon type="md-add-circle" />
                创建群组
              </div>
              <ul class="group-ul">
                <li :class="{ checked: nowGroup.id === item.groupId }" class="group-list" v-for="(item, n) in groupData" :key="n" @click="changeNowGroup(item)">
                  <Icon type="ios-contacts" />
                  <Tooltip style="margin-top: 5px" transfer :content="item.groupName">
                    <p class="w225">{{ item.groupName }}</p>
                  </Tooltip>
                </li>
              </ul>
            </TabPane>
          </Tabs>
        </div>
        <!--右侧显示成员-->
        <!--组织架构显示-->
        <div v-if="tabType === '组织架构'" class="member-right">
          <header class="member-right-head">
            <div style="font-size: 16px">{{ memberType }} · {{ peopleList.length ? peopleList.length : "0" }}</div>
            <div class="header-right">
              <!--添加成员 按钮-->
              <!-- <Poptip v-model="memModal">
                <div class="branch">
                  <Icon type="md-add-circle" />
                  添加成员
                </div>
                <div slot="content">
                  <p @click="showAddModel">添加企业成员</p>
                  <p @click="showAddModel(true)">添加企业外部成员</p>
                </div>
              </Poptip> -->
                <div class="branch" @click="showAddModel">
                  <Icon type="md-add-circle" />
                  添加成员
                </div>
              
              <!--创建子部门 按钮-->
              <div v-if="nowType === '部门'" class="createZBM">
                <Poptip v-model="sonBranch" transfer>
                  <Icon type="md-add-circle" />
                  创建子部门
                  <div slot="content">
                    <div class="branch-title">
                      <span></span>创建子部门
                      <Icon @click="sonBranch = false" type="md-close" size="20" />
                    </div>
                    <Input v-model="sonBranchName" placeholder="子部门名称" class="branch-name" />
                    <p style="margin-bottom: 10px;color: gray;font-size: 14px">隶属于：{{ nowBranch.name }}</p>
                    <Button long type="info" :loading="isCreateBranch" :disabled="sonBranchName == ''" @click="createBranch('子部门')">创建 </Button>
                  </div>
                </Poptip>
              </div>
              <!--部门 更多 按钮-->
              <div v-if="nowType === '部门'" class="more-bumen-opearte">
                <Poptip v-model="branchMenu">
                  <Icon type="ios-more" />
                  更多
                  <div slot="content">
                    <div class="branch-title">
                      <span><Icon @click="branchMenuTitle = '部门菜单'" v-show="branchMenuTitle !== '部门菜单'" type="ios-arrow-back" size="20"/></span>
                      {{ branchMenuTitle }}
                      <Icon @click="branchMenu = false" type="md-close" size="20" />
                    </div>
                    <div class="branch-menu-con">
                      <ul class="bmcd" v-show="branchMenuTitle === '部门菜单'">
                        <li @click="branchMenuTitle = '编辑部门'">编辑部门</li>
                        <li style="color: #ff4f3e" @click="branchMenuTitle = '删除部门'">删除部门</li>
                      </ul>
                      <div class="bjbm" v-show="branchMenuTitle === '编辑部门'">
                        <input type="text" v-model="nowBranch.name" />
                        <Button long type="info" :loading="isCreateBranch" @click="changeBranchName">保存 </Button>
                      </div>
                      <div class="scbm" v-show="branchMenuTitle === '删除部门'">
                        <span>删除部门会同时删除其子部门，部门中的成员不会被移出企业。</span>
                        <Button long type="error" :loading="isCreateBranch" @click="deleteIt">
                          确定
                        </Button>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </div>
            </div>
          </header>
          <div class="scroll-box" v-if="showPrise">
            <Loading v-if="loading"></Loading>
            <!--点击成员显示-->
            <ul v-if="nowType === '成员' && peopleList.length">
              <li class="one-member" v-for="(item, index) in peopleList" :key="index">
                <img :src="item.userEntity.image" alt="" />
                <div class="one-member-name">
                  <span>{{ item.userEntity.userName }}</span>
                  <span v-if="item.partment!=null">{{item.partment.partmentName}}</span>
                </div>
                <span v-if="item.organizationLable == 1">拥有者</span>
                <Poptip v-if="item.memberLock==1" placement="bottom" transfer width="280" @on-popper-show="visibleChange(item.userEntity)" v-model="item.userEntity.visible">
                  <a href="javascript:void(0)" v-if="item.organizationLable != 1">
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <div slot="title" class="member-title">
                    <Icon type="ios-arrow-back" size="18" class="role-arrow-back" @click.native="returnBack" v-show="visible||visible1"/>
                    <span>{{ title }}</span>
                    <Icon type="md-close" size="18" class="role-md-close" @click="mdClose(index)"/>
                  </div>
                  <div slot="content" class="content" v-show="!visible&&!visible1">
                    <ul class="org-role">
                      <li style="cursor:pointer" v-for="(role, index) in roles" :key="role.roleId" @click="changeRole(role.roleId)">
                        <span>{{ role.roleName }}</span>
                        <Icon type="md-checkmark" v-if="role.currentCheck" />
                      </li>
                      <li style="cursor:pointer;border-top:1px solid #e5e5e5" @click="visible1 = true;title = '停用账号';">
                          <span >停用账号</span>
                      </li>
                      <li  style="cursor:pointer" @click="visible = true;title = '移除成员';">
                          <span style="color:red">删除成员</span>
                      </li>
                    </ul>
                  </div>
                  <div slot="content" v-show="visible">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>确认移除项目成员吗？</span>
                    </div>
                    <Button type="error" long @click="remove(item.userEntity.userId)">确定</Button>
                  </div>
                  
                  <div slot="content" v-show="visible1">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>您确定要停用当前帐号吗？<br></span>
                      <span>• 被停用的帐号将无法访问该企业<br>
                            • 帐号信息仍保留，方便工作交接和管理<br>
                            • 支持帐号恢复</span>
                    </div>
                    <Button type="error" long @click="lock(item.userEntity.userId,0)">确定</Button>
                  </div>
                </Poptip>

                <Poptip v-else placement="bottom" transfer width="280" v-model="item.userEntity.visible">
                  <a href="javascript:void(0)" v-if="item.organizationLable != 1">
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <div slot="title" class="member-title">
                    <Icon type="ios-arrow-back" size="18" class="role-arrow-back" @click.native="returnBack" v-show="visible||visible1"/>
                    <span>{{ title }}</span>
                    <Icon type="md-close" size="18" class="role-md-close" @click="mdClose(index)"/>
                  </div>
                  <div slot="content" class="content" v-show="!visible&&!visible1">
                    <ul class="org-role">
                      <li style="cursor:pointer" @click="visible1 = true;title = '启用账号';">
                          <span>启用账号</span>
                      </li>
                      <li  style="cursor:pointer" @click="visible = true;title = '移除成员';">
                          <span style="color:red">删除成员</span>
                      </li>
                    </ul>
                  </div>
                  <div slot="content" v-show="visible">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>确认移除企业成员吗？</span>
                    </div>
                    <Button type="error" long @click="remove(item.userEntity.userId)">确定</Button>
                  </div>
                  
                  <div slot="content" v-show="visible1">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>被启用的帐号将重新加入该企业，您确定要启用吗？<br></span>
                      <span>该帐号的角色将恢复之前的角色</span>
                    </div>
                    <Button type="primary" long @click="lock(item.userEntity.userId,1)">确定</Button>
                  </div>
                </Poptip>
              </li>
            </ul>
            <!--点击部门显示-->
            <ul v-else-if="nowType === '部门' && peopleList.length" class="branch-show">
              <div class="branch-header">
                <div class="branch-people">部门成员</div>
                <div class="position">职位</div>
                <div class="operation">操作</div>
              </div>
              <li class="branch-list" v-for="(i, n) in peopleList" :key="n">
                <div class="branch-people">
                  <img :src="i.userEntity.image" alt="" />
                  <div>
                    <p>{{ i.userEntity.userName }}</p>
                    <!--<span>243967393qq.com</span>-->
                  </div>
                </div>
                <div class="position">-</div>
                <div class="operation">
                  <Poptip placement="bottom"  v-model="i.userEntity.visible">
                    <div class="operation-title">
                      <!-- {{ i.peopleList ? "管理员" : "成员" }} -->
                      <Icon type="ios-arrow-down" size="20" />
                    </div>
                    <div slot="content">
                      <div class="operation-body-title">
                        部门成员菜单
                        <Icon type="md-close" @click="mdClose(n)" />
                      </div>
                      <!-- <div class="operation-list">
                        成员
                        <Icon v-if="!i.peopleList" type="md-checkmark" size="18" />
                      </div>
                      <div class="operation-list">
                        管理员
                        <Icon v-if="i.peopleList" type="md-checkmark" size="18" />
                      </div> -->
                      <div class="operation-list" @click="removePP(i.userEntity.userId)">从部门移除成员</div>
                      <div class="operation-list">
                        <Poptip class="delete-alert" confirm title="确定从企业中移除成员？" @on-ok="remove(i.userEntity.userId)">
                          <div style="color: #ff4f3e">从企业移除成员</div>
                        </Poptip>
                      </div>
                    </div>
                  </Poptip>
                </div>
              </li>
            </ul>
            <div v-else class="no-memebers">
              <Icon type="ios-contacts" />
              <p>暂无成员</p>
            </div>
          </div>
        </div>
        <!--企业群组显示-->
        <div v-if="tabType === '企业群组'" class="member-right">
          <header class="member-right-head">
            <div style="font-size: 16px">{{ nowGroup.name }} · {{ groupPeople.length ? groupPeople.length : "0" }}</div>
            <div class="header-right">
              <!--添加成员 按钮-->
              <div class="branch" @click="showAddGroupPeople">
                <Icon type="md-add-circle" />
                添加成员
              </div>
              <!-- 更多 按钮-->
              <div class="more-bumen-opearte">
                <Poptip v-model="branchMenu">
                  <Icon type="ios-more" />
                  更多
                  <div slot="content">
                    <div class="branch-title">
                      <span><Icon @click="branchMenuTitle = '群组菜单'" v-show="branchMenuTitle !== '群组菜单'" type="ios-arrow-back" size="20"/></span>
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
                        <Button long type="info" :loading="isCreateBranch" @click="changeGroupName">保存 </Button>
                      </div>
                      <div class="scbm" v-show="branchMenuTitle === '删除群组'">
                        <span>您确定要删除当前群组吗？</span>
                        <Button long type="error" :loading="isCreateBranch" @click="deleteGroupOk">确定 </Button>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </div>
            </div>
          </header>
          <div class="scroll-box">
            <Loading v-if="loading"></Loading>
            <ul>
              <li class="group-people" v-for="(item, index) in groupPeople" :key="index">
                <div class="group-people-con">
                  <img :src="item.image" alt="" />
                  <p>{{ item.userName }} {{ item.isOwner ? "（拥有者）" : "" }}</p>
                </div>
                <span>{{ item.isOwner ? "退出" : "移除" }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--添加人员至企业-->
    <Modal v-model="showAddPeople" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>添加成员至企业</span>
      </p>
      <addPeople @addPeople="addPeople" v-if="showAddPeople" :type="nowType" :partmentId="partmentId"></addPeople>
    </Modal>
    <!--添加人员至部门-->
    <Modal v-model="showAddPeople1" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>添加成员至部门</span>
      </p>
      <addPeople @addPeople1="addPeople1" v-if="showAddPeople1" :invitUsers="allOrgPeople" :type="nowType" :partmentId="partmentId"></addPeople>
    </Modal>
    <!--创建群组 框1 输入群组名称-->
    <Modal v-model="groupStep1" width="360" class-name="vertical-center-modal">
      <p slot="header" class="craete-group-head">
        创建群组
      </p>
      <div class="craete-group-con">
        <Input v-model="groupName" placeholder="请输入群组名称" />
      </div>
      <div slot="footer">
        <Button type="info" size="large" :disabled="!groupName" long @click="addGroupNext">下一步</Button>
      </div>
    </Modal>
    <!--创建群组 框2 添加、选择人员-->
    <Modal v-model="groupStep2" width="360" class-name="vertical-center-modal">
      <p slot="header" class="craete-group-head">
        <Icon v-if="!againAdd" type="ios-arrow-back" @click="groupStep2 = false" />
        选择企业成员
      </p>
      <div class="craete-group-con">
        <Input search @on-search="searchOrgPeople" placeholder="搜索企业成员.." />
        <Loading v-if="loading"></Loading>
        <ul class="people-ul">
          <li v-for="(item, index) in allOrgPeople" :key="index" @click="checkedPeople(index)">
            <div>
              <img :src="item.userEntity.image" alt="" />
              <p>{{ item.userEntity.userName }}</p>
            </div>
            <Icon v-show="item.isChecked" type="md-checkmark" />
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="info" :loading="isCreateBranch" size="large" long @click="createGroup">完成</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import addPeople from "@/components/public/addPeople";
import branch from "./branch";
import { mapState, mapActions, mapMutations } from "vuex";
import Tree from "@/components/company/Tree.vue";
import { userOrgRoles, updateOrgUserRole, removeOrgUser } from "../../axios/api.js";
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
    searchOrgMembers
} from "@/axios/companyApi";

export default {
  name: "members",
  computed: { ...mapState("company", ["departmentTree"]) },
  data() {
    return {
      branch: false,
      memberType: "所有成员",
      branchName: "",
      groupStep1: false,
      groupStep2: false,
      groupName: "",
      showAddPeople: false,
      showAddPeople1:false,
      showPrise:true,
      peopleList: [],
      memModal: false,
      loading: true,
      isCreateBranch: false,
      allMemberType: ["所有成员", "新加入的成员", "未分配部门的成员", "停用的成员"],
      operationMenu: false,
      branchData: [],
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
      tabType: "组织架构",
      nowGroup: {
        name: "",
        id: ""
      },
      groupPeople: [],
      againAdd: false,
      visible: false,
      visible1:false,
      title: "成员菜单",
      roles: [],
      user: {},
      flag: 0
    };
  },
  mounted() {
    this.initMember();
  },
  components: { Tree, addPeople, branch },
  methods: {
    ...mapActions("company", ["getDepartmentTree"]),
    ...mapMutations("company", ["initTree"]),
    mdClose(index){
        console.log("xxxxxxx")
        this.$set(this.peopleList[index].userEntity,"visible",false)
    },
    returnBack(){
        this.visible = false
        this.visible1 = false
        this.title = '成员菜单'
    },
    lock(userId,lock){
        this.visible1 = false
        this.title = '成员菜单'
        lockUser(localStorage.companyId,userId,lock).then(res=>{
            if(res.result==1){
                initOrgMember(localStorage.companyId, this.flag).then(res => {
                  if (res.result === 1) {
                      this.peopleList = res.data;
                  }
                });
            }
        })
    },
    // tab切换
    clickTabs(value) {
      console.log(value);
      if (value === "组织架构") {
        this.tabType = "组织架构";
        this.branchMenuTitle = "部门菜单";
      } else if (value === "企业群组") {
        this.tabType = "企业群组";
        this.branchMenuTitle = "群组菜单";

      }
    },
    // 页面初始化
    initMember() {
      // 获取成员信息
      initOrgMember(localStorage.companyId).then(res => {
        if (res.result == 1) {
          res.data.forEach(i => {
            i.isChecked = false;
          });
          this.peopleList = res.data;
          this.allOrgPeople = res.data;
        }
        this.loading = false;
      });
      // 获取群组信息
      getGroups(localStorage.companyId).then(res => {
        if (res.result) {
          this.groupData = res.data;
          this.nowGroup.name = this.groupData[0].groupName;
          this.nowGroup.id = this.groupData[0].groupId;
          getGroupPeople(this.groupData[0].groupId).then(res => {
            this.groupPeople = res.data;
          });
        }
      });
    },
    // 显示添加人员匡
    showAddModel() {
      if([0,1,2,3].indexOf(this.flag)!=-1){
          this.showAddPeople = true;
      }else{
          this.showAddPeople1 = true;
      }
      // this.memModal = false;
      
    },
    // 添加成员 回调
    addPeople(data) {
     initOrgMember(localStorage.companyId, this.flag).then(res => {
        if (res.result === 1) {
          this.peopleList = res.data;
        }else {

        }
      });
    },
    // 添加成员 回调
    addPeople1(data) {
      this.changePartment(data.partmentId,data.partmentName);
      initOrgMember(localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.allOrgPeople = res.data;
        }
      });
    },
    // 点击左侧 成员类型
    changeMemberType(item) {
      this.nowType = "成员";
      this.memberType = item;
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
      initOrgMember(localStorage.companyId, this.flag).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.peopleList = res.data;
        }
      });
    },
    // 创建部门
    createBranch(v) {
      this.isCreateBranch = true;
      if (v === "子部门") {
        let data = {
          partmentName: this.sonBranchName,
          parentId: this.nowBranch.id
        };
        createBranchs(localStorage.companyId, data).then(res => {
          this.$refs.tree.asyncRefresh(this.nowBranch.id);
          this.isCreateBranch = false;
          this.sonBranch = false;
        });
      } else {
        let data = {
          partmentName: this.branchName
        };
        createBranchs(localStorage.companyId, data).then(res => {
          if (res.result == 1) {
            this.getDepartmentTree({ orgId: localStorage.companyId, departmentId: "" });
          }
          this.isCreateBranch = false;
          this.branch = false;
          this.branchName=''
        });
      }
    },
    
    // 获取某个部门下成员
    changePartment(partmentId,partmentName) {
      this.flag = -1;
        console.log("changePartment>>>>>>",partmentId,partmentName)
      this.nowType = "部门";
      this.partmentId = partmentId;
      this.memberType = partmentName;
      this.nowBranch.id = partmentId;
      this.nowBranch.name = partmentName;
      this.loading = true;
      getBranchpeople(partmentId).then(res => {
        if (res.result==1) {
          this.peopleList = res.data;
          this.loading = false;
        }
      });
    },
    reSetPartment(){
        this.memberType='所有成员';
        this.loading = true;
        this.nowType = '成员';
        initOrgMember(localStorage.companyId, this.flag).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.peopleList = res.data;
        }
      });
    },
    // 改变部门名称
    changeBranchName() {
      this.isCreateBranch = true;
      let data = {
        "partmentName": this.nowBranch.name
      };
      changeBranchNames(this.nowBranch.id,data).then(res => {
        if (res.result==1) {
          this.isCreateBranch = false;
          this.$Message.success("修改成功");
          this.branchMenu = false;
          this.memberType = this.nowBranch.name;
          this.branchMenuTitle = '部门菜单';
          this.$refs.tree.updateNodeName(this.nowBranch.id,this.nowBranch.name)
        }
      });
    },
    // 删除部门
    deleteIt() {
      this.isCreateBranch = true;
      deleteBranch(this.nowBranch.id).then(res => {
        if (res.result==1) {
          this.$Message.success("删除成功");
          this.isCreateBranch = false;
          this.branchMenu = false;
          this.branchMenuTitle = '部门菜单';
          this.$refs.tree.removeNode(this.nowBranch.id)
        }
      });
    },
    // 从企业部门移除成员 确定
    removePP(userId) {
      console.log('removePP')
      var data = {orgId:localStorage.companyId,memberId:userId}
      removeBranchPeople(this.partmentId,data).then(res=>{
        if(res.result==1){
            this.changePartment(res.data.partmentId,res.data.partmentName);
        }
      })
    },
    createGroup() {
      this.isCreateBranch = true;
      if (this.againAdd) {
        // 添加群组成员
        // addGroupPeople()
      } else {
        // 创建群组
        let ids = this.allOrgPeople
          .map(i => {
            if (i.isChecked) {
              return i.userEntity.userId;
            }
          })
          .join(",");
        let data = {
          groupName: this.groupName,
          memberIds: ids
        };
        addGroup(localStorage.companyId, data).then(res => {
          if (res.result) {
            this.isCreateBranch = false;
            this.groupStep1 = false;
            this.groupStep2 = false;
            this.groupData.push(res.data);
          }
        });
      }
    },
    // 创建群组的下一步
    addGroupNext() {
      this.groupStep2 = true;
      this.loading = true;
      initOrgMember(localStorage.companyId).then(res => {
        if (res.result) {
          if (res.data === "无数据") {
            console.log("企业并没有成员");
          } else {
            res.data.forEach(i => {
              i.isChecked = false;
            });
            this.allOrgPeople = res.data;
            this.loading = false;
            console.log(this.allOrgPeople);
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
        if (event.currentTarget.value==='') {
            this.memberType='所有成员';
            initOrgMember(localStorage.companyId).then(res => {
                if (res.result === 1) {
                    res.data.forEach(i => {
                        i.isChecked = false;
                    });
                    this.peopleList = res.data;
                    this.allOrgPeople = res.data;
                }
                this.showPrise=true;
                this.loading = false;
            });
        }else{
            this.memberType='企业成员';
            searchOrgMembers(event.currentTarget.value, localStorage.companyId).then(res => {
                if(res.result===1){
                    this.showPrise=true;
                    this.peopleList = res.data;
                }else{
                    this.showPrise=false;
                    this.peopleList.length=0;
                    this.$Message.error('未搜索到成员');
                }
                this.loading = false;
            })
        }
    },
      // 搜索企业内成员   创建群组时使用
      searchOrgPeople(event) {
          this.loading = true;
          searchOrgMembers(event, localStorage.companyId).then(res => {
              if(res.result===1){
                  console.log(11)
                  this.peopleList = res.data;
              }else{
                  this.showPrise=false;
                  this.peopleList.length=0;
                  this.$Message.error('未搜索到成员');
              }
              this.loading = false;
          })

      },
    // 点击某个群组
    changeNowGroup(item) {
      this.nowGroup.name = item.groupName;
      this.nowGroup.id = item.groupId;
      getGroupPeople(item.groupId).then(res => {
        this.groupPeople = res.data;
      });
    },
    // 点击群组的添加成员 按钮
    showAddGroupPeople() {

      this.groupStep2 = true;
      this.againAdd = true;
      this.allOrgPeople.forEach((i, n) => {
        this.groupPeople.forEach(j => {
          if (i.groupId === j.groupId) {
            this.allOrgPeople.splice(n, 1);
          }
        });
      });
      console.log(this.allOrgPeople);
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
      updateOrgUserRole(roleId, this.user.userId, localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.$Message.success("设置成功");
          this.user.visible = false;
        } else {
          this.$Message.success("设置失败");
        }
      });
    },
    //移除项目成员
    remove(userId) {
      this.visible = false;
      this.title = '成员菜单'
      removeOrgUser(userId, localStorage.companyId).then(res => {
        if (res.result === 1) {
          initOrgMember(localStorage.companyId, this.flag).then(res => {
            this.loading = false;
            if (res.result === 1) {
              this.peopleList = res.data;
            }
          });
        } else {
          this.$Notice.warning({
            title: "移除失败"
          });
        }
      });
    }
  },
  created() {
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
.member-title{
    position: relative;
    text-align: center;
    .role-md-close{
        position: absolute;
        right: 0px;
    }
    .role-arrow-back{
        position: absolute;
        left: 0px;
    }
}
</style>
