<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>组织架构</div>
        <div class="icon-content">
          <div class="r-jump" @click="goMember">
            <img src="../assets/images/systemSet/chengyuang.png" alt />
            <span>成员</span>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="search">
        <Input prefix="ios-search" placeholder="搜索" @on-change="searchDep" />
      </div>
      <div class="orgContent">
        <div class="org-title">
          <div>
            <img src="../icons/img/qiye-apply-01.png" alt />
            <span>{{organizationName}}</span>
          </div>
          <Poptip placement="left" transfer width="280" v-model="depPop">
            <a href="javascript:void(0)">
              <div class="addDep">
                <Icon type="md-add" color="#979797" size="20" />
              </div>
            </a>
            <div slot="title" class="member-title">
              <span>新建部门</span>
              <Icon type="md-close" size="18" class="role-md-close" @click.native="depPop=false" />
            </div>
            <div slot="content">
              <div class="dep-pop">
                <div class="dep-pop-tit">部门名称</div>
                <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                <div class="dep-pop-tit">上级部门</div>
                <Input placeholder="部门名称" v-model="depName" disabled />
              </div>
              <div class="mb10">设置部门负责人</div>
              <Poptip placement="left" transfer width="280" v-model="personPop">
                <a href="javascript:void(0)">
                  <div class="addDep mb10" v-if="!social">
                    <Icon type="md-add" color="#2B85E4" size="20" />
                  </div>
                  <div v-else class="userInfo">
                    <div class="df ac">
                      <img :src="userImg" />
                      <p>{{userName}}</p>
                    </div>
                  </div>
                </a>
                <div slot="title" class="member-title">
                  <span>选择负责人</span>
                  <Icon
                    type="md-close"
                    size="18"
                    class="role-md-close"
                    @click.stop="personPop=false;"
                  />
                </div>
                <div slot="content">
                  <div class="dep-pop">
                    <Input
                      prefix="ios-search"
                      placeholder="请输入关键字"
                      class="mt10"
                      @on-change="searchOrgProple"
                    />
                    <ul class="people-ul">
                      <RadioGroup v-model="social" @on-change="peopleCheck">
                        <li v-for="(item, index) in allOrgPeople" :key="index">
                          <Radio :label="item.memberId" class="df people-check ac">
                            <div class="df">
                              <img :src="item.image" alt />
                              <p>{{ item.userName }}</p>
                            </div>
                          </Radio>
                        </li>
                      </RadioGroup>
                    </ul>
                  </div>
                </div>
              </Poptip>
              <div class="mb10">部门icon</div>
              <Row class="iconList">
                <Col span="6">
                  <img src="../icons/img/bumen-01.png" alt />
                </Col>
              </Row>

              <Button
                type="primary"
                long
                class="determine"
                @click="createBranch"
                :disabled="!branchName"
              >确定</Button>
            </div>
          </Poptip>
        </div>
        <Loading v-if="loading"></Loading>

        <div class="org-container">
          <div v-for="(item, index) in departmentTreeNew" :key="index">
            <div class="content-item">
              <div class="left-item df ac">
                <div class="foldICon">
                  <Icon
                    type="md-arrow-dropright"
                    size="20"
                    color="#979797"
                    v-show="item.isParent"
                    @click="getChilder(item,index)"
                  />
                </div>
                <img src="../icons/img/bumen-01.png" alt />
                <span>{{item.name}}</span>
              </div>
              <div class="right-item">
                <!-- <Poptip placement="left" transfer width="280" v-model="item.visible1">
                  <a href="javascript:void(0)">
                    <Tooltip content="编辑">
                      <Icon
                        type="md-create"
                        size="20"
                        color="#979797"
                        @click="editDep(index,item)"
                      />
                    </Tooltip>
                  </a>
                  <div slot="title" class="member-title">
                    <span>编辑部门</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content">
                    <div class="dep-pop">
                      <div class="dep-pop-tit">部门名称</div>
                      <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                      <div class="dep-pop-tit">上级部门</div>
                      <Input placeholder="部门名称" v-model="depName" disabled />
                    </div>
                    <div class="mb10">设置部门负责人</div>
                    <Poptip placement="left" width="280" v-model="item.visible2">
                      <a href="javascript:void(0)">
                        <div class="addDep mb10" v-if="!social2">
                          <Icon type="md-add" color="#2B85E4" size="20" />
                        </div>
                        <div v-else class="userInfo">
                          <img :src="userImg" />
                          <p>{{userName}}</p>
                        </div>
                      </a>
                      <div slot="title" class="member-title">
                        <span>选择负责人</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.stop="aditClose(index)"
                        />
                      </div>
                      <div slot="content">
                        <div class="dep-pop">
                          <Input
                            prefix="ios-search"
                            placeholder="请输入关键字"
                            class="mt10"
                            @on-change="searchOrgProple"
                          />
                          <ul class="people-ul">
                            <RadioGroup v-model="social2" @on-change="peopleCheck2">
                              <li v-for="(item, index) in allOrgPeople" :key="index">
                                <Radio :label="item.memberId" class="df people-check ac">
                                  <div class="df">
                                    <img :src="item.image" alt />
                                    <p>{{ item.userName }}</p>
                                  </div>
                                </Radio>
                              </li>
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </Poptip>
                    <div class="mb10">部门icon</div>
                    <Row class="iconList">
                      <Col span="6">
                        <img src="../icons/img/bumen-01.png" alt />
                      </Col>
                    </Row>

                    <Button
                      type="primary"
                      long
                      class="determine"
                      @click="changeBranchName"
                      :disabled="!branchName"
                    >保存</Button>
                  </div>
                </Poptip>-->
                <Poptip placement="left" transfer width="280" v-model="item.visible3">
                  <a href="javascript:void(0)">
                    <Tooltip content="新建子部门">
                      <Icon type="md-add" size="20" color="#979797" @click="newlyBuild(index,item)" />
                    </Tooltip>
                  </a>
                  <div slot="title" class="member-title">
                    <span>新建子部门</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content">
                    <div class="dep-pop">
                      <div class="dep-pop-tit">部门名称</div>
                      <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                      <div class="dep-pop-tit">上级部门</div>
                      <Input placeholder="部门名称" v-model="item.name" disabled />
                    </div>
                    <div class="mb10">设置部门负责人</div>
                    <Poptip placement="left" width="280" v-model="item.visible4">
                      <a href="javascript:void(0)">
                        <div class="addDep mb10" v-if="!social2">
                          <Icon type="md-add" color="#2B85E4" size="20" />
                        </div>
                        <div v-else class="userInfo">
                          <img :src="userImg" />
                          <p>{{userName}}</p>
                        </div>
                      </a>
                      <div slot="title" class="member-title">
                        <span>选择负责人</span>
                        <Icon
                          type="md-close"
                          size="18"
                          class="role-md-close"
                          @click.stop="aditClose(index)"
                        />
                      </div>
                      <div slot="content">
                        <div class="dep-pop">
                          <Input
                            prefix="ios-search"
                            placeholder="请输入关键字"
                            class="mt10"
                            @on-change="searchOrgProple"
                          />
                          <ul class="people-ul">
                            <RadioGroup v-model="social2" @on-change="peopleCheck2">
                              <li v-for="(item, index) in allOrgPeople" :key="index">
                                <Radio :label="item.memberId" class="df people-check ac">
                                  <div class="df">
                                    <img :src="item.image" alt />
                                    <p>{{ item.userName }}</p>
                                  </div>
                                </Radio>
                              </li>
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </Poptip>
                    <div class="mb10">部门icon</div>
                    <Row class="iconList">
                      <Col span="6">
                        <img src="../icons/img/bumen-01.png" alt />
                      </Col>
                    </Row>

                    <Button
                      type="primary"
                      long
                      class="determine"
                      @click="createSub(item)"
                      :disabled="!branchName"
                    >保存</Button>
                  </div>
                </Poptip>

                <!-- <Poptip placement="bottom" transfer width="280" v-model="item.visible">
                  <Tooltip content="删除">
                    <Icon type="ios-trash-outline" size="20" color="#979797" />
                  </Tooltip>
                  <div slot="title" class="member-title">
                    <span>移除部门</span>
                    <Icon
                      type="md-close"
                      size="18"
                      class="role-md-close"
                      @click.native="mdClose(index)"
                    />
                  </div>
                  <div slot="content">
                    <div style="margin-top:10px;margin-bottom:10px">
                      <span>你确定把「{{item.name}}」部门移除吗？移除部门时该部门下的子部门会被同时移除，该部门的成员将会移至未分配部门。</span>
                    </div>
                    <Button type="error" long @click="deleteIt(item)">确定</Button>
                  </div>
                </Poptip>-->
              </div>
            </div>
            <div v-if="item.childen">
              <div
                class="content-item-childer content-item"
                v-for="(v, i) in item.childer"
                :key="i"
              >
                <div class="left-item df ac">
                  <div class="foldICon">
                    <Icon type="md-arrow-dropright" size="20" color="#979797" v-show="v.isParent" />
                  </div>
                  <img src="../icons/img/bumen-01.png" alt />
                  <span>{{v.name}}</span>
                </div>
                <div class="right-item">
                  <Poptip placement="left" transfer width="280" v-model="v.visible1">
                    <a href="javascript:void(0)">
                      <Tooltip content="编辑">
                        <Icon type="md-create" size="20" color="#979797" @click="editDep(i,v)" />
                      </Tooltip>
                    </a>
                    <div slot="title" class="member-title">
                      <span>编辑部门</span>
                      <Icon
                        type="md-close"
                        size="18"
                        class="role-md-close"
                        @click.native="mdClose(i)"
                      />
                    </div>
                    <div slot="content">
                      <div class="dep-pop">
                        <div class="dep-pop-tit">部门名称</div>
                        <Input prefix="ios-search" placeholder="部门名称" v-model="branchName" />
                        <div class="dep-pop-tit">上级部门</div>
                        <Input placeholder="部门名称" v-model="depName" disabled />
                      </div>
                      <div class="mb10">设置部门负责人</div>
                      <Poptip placement="left" width="280" v-model="v.visible2">
                        <a href="javascript:void(0)">
                          <div class="addDep mb10" v-if="!social2">
                            <Icon type="md-add" color="#2B85E4" size="20" />
                          </div>
                          <div v-else class="userInfo">
                            <img :src="userImg" />
                            <p>{{userName}}</p>
                          </div>
                        </a>
                        <div slot="title" class="member-title">
                          <span>选择负责人</span>
                          <Icon
                            type="md-close"
                            size="18"
                            class="role-md-close"
                            @click.stop="aditClose(i)"
                          />
                        </div>
                        <div slot="content">
                          <div class="dep-pop">
                            <Input
                              prefix="ios-search"
                              placeholder="请输入关键字"
                              class="mt10"
                              @on-change="searchOrgProple"
                            />
                            <ul class="people-ul">
                              <RadioGroup v-model="social2" @on-change="peopleCheck2">
                                <li v-for="(itemp, indexp) in allOrgPeople" :key="indexp">
                                  <Radio :label="itemp.memberId" class="df people-check ac">
                                    <div class="df">
                                      <img :src="itemp.image" alt />
                                      <p>{{ itemp.userName }}</p>
                                    </div>
                                  </Radio>
                                </li>
                              </RadioGroup>
                            </ul>
                          </div>
                        </div>
                      </Poptip>
                      <div class="mb10">部门icon</div>
                      <Row class="iconList">
                        <Col span="6">
                          <img src="../icons/img/bumen-01.png" alt />
                        </Col>
                      </Row>

                      <Button
                        type="primary"
                        long
                        class="determine"
                        @click="changeBranchName"
                        :disabled="!branchName"
                      >保存</Button>
                    </div>
                  </Poptip>
                  <Tooltip content="新建子部门">
                    <Icon type="md-add" size="20" color="#979797" />
                  </Tooltip>
                  <Poptip placement="bottom" transfer width="280" v-model="v.visible">
                    <Tooltip content="删除">
                      <Icon type="ios-trash-outline" size="20" color="#979797" />
                    </Tooltip>
                    <div slot="title" class="member-title">
                      <span>移除部门</span>
                      <Icon
                        type="md-close"
                        size="18"
                        class="role-md-close"
                        @click.native="mdClose(i)"
                      />
                    </div>
                    <div slot="content">
                      <div style="margin-top:10px;margin-bottom:10px">
                        <span>你确定把「{{v.name}}」部门移除吗？移除部门时该部门下的子部门会被同时移除，该部门的成员将会移至未分配部门。</span>
                      </div>
                      <Button type="error" long @click="deleteIt(v)">确定</Button>
                    </div>
                  </Poptip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import {
  initOrgMemberNew,
  searchDepartment,
  createBranchs,
  deleteBranch,
  searchOrgMembers,
  changeBranchNames,
  getDepartmentTree
} from "@/axios/companyApi";
export default {
  components: {
    Loading
  },
  data() {
    return {
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
      depName: "",
      allOrgPeople: [],
      social: "",
      social2: "",

      personPop: false,
      personPop2: false,
      depPop: false,
      departmentTreeNew: [],
      loading: false,
      branchName: "",
      batchAdd: false,
      organizationName: localStorage.organizationName, //当前企业名称
      userName: "",
      userImg: "",
      editIndex: "",
      allOrgPeopleCopy: [],
      depId: "", //编辑部门时拿到部门id
      departmentTreeNewCopy: []
    };
  },
  computed: {},
  mounted() {
    this.depName = localStorage.organizationName;
    this.loading = true;
    this.getList();
  },
  methods: {
    getList() {
      initOrgMemberNew(localStorage.companyId, 0).then(res => {
        if (res.result == 1) {
          this.allOrgPeople = res.data.members;
          this.allOrgPeopleCopy = res.data.members;
        }
        this.loading = false;
      });
      getDepartmentTree(localStorage.companyId).then(res => {
        res.data.forEach(i => {
          i.visible = false;
          i.visible1 = false;
          i.visible2 = false;
          i.visible3 = false;
          i.visible4 = false;
        });
        this.departmentTreeNew = res.data;
        this.departmentTreeNewCopy = res.data;
      });
      this.branchName=''
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
            this.allOrgPeople = res.data;
          } else {
            this.allOrgPeople.length = 0;
            this.$Message.error("未搜索到成员");
          }
          this.loading = false;
        });
      } else {
        this.allOrgPeople = this.allOrgPeopleCopy;
      }
    },
    searchDep(event) {
      this.loading = true;
      if (event.currentTarget.value != "") {
        searchDepartment(
          event.currentTarget.value,
          localStorage.companyId
        ).then(res => {
          if (res.result === 1) {
            this.departmentTreeNew = res.data;
          } else {
            this.departmentTreeNew.length = 0;
            this.$Message.error("未搜索到部门");
          }
          this.loading = false;
        });
      } else {
        this.getList();
      }
    },
    peopleCheck() {
      this.allOrgPeople.forEach(i => {
        if (i.memberId == this.social) {
          this.userName = i.userName;
          this.userImg = i.image;
        }
      });
      this.personPop = false;
      this.depPop = true;
    },
    peopleCheck2() {
      this.allOrgPeople.forEach(i => {
        if (i.memberId == this.social2) {
          this.userName = i.userName;
          this.userImg = i.image;
        }
      });
      this.aditClose(this.editIndex);
    },
    // 创建部门
    createBranch() {
      this.loading = true;
      let data = {
        partmentName: this.branchName,
        memberId: this.social
      };
      createBranchs(localStorage.companyId, data).then(res => {
        if (res.result == 1) {
          this.getList();
        }
        this.depPop = false;
        this.branchName = "";
      });
    },
    createSub(item) {
      this.loading = true;
      let data = {
        partmentName: this.branchName,
        parentId: item.id
      };
      createBranchs(localStorage.companyId, data).then(res => {
        if (res.result == 1) {
          this.getList();
        }
        this.branchName = "";
      });
    },
    mdClose(index) {
      this.$set(this.departmentTreeNew[index], "visible", false);
      this.$set(this.departmentTreeNew[index], "visible1", false);
      this.$set(this.departmentTreeNew[index], "visible3", false);
    },
    aditClose(index) {
      this.$set(this.departmentTreeNew[index], "visible2", false);
      this.$set(this.departmentTreeNew[index], "visible4", false);
    },
    editDep(index, item) {
      this.editIndex = index;
      this.branchName = item.name;
      this.depId = item.id;
      if (item.userEntity) {
        this.social2 = item.userEntity.userId;
        this.userName = item.userEntity.userName;
        this.userImg = item.userEntity.defaultImage;
      }
    },
    // 部门新建子部门
    newlyBuild(index, item) {
      this.editIndex = index;
      this.depId = item.id;
      if (item.userEntity) {
        this.social2 = item.userEntity.userId;
        this.userName = item.userEntity.userName;
        this.userImg = item.userEntity.defaultImage;
      }
    },
    // 删除部门
    deleteIt(item) {
      this.loading = true;
      deleteBranch(item.id).then(res => {
        if (res.result == 1) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    // 编辑部门后保存
    changeBranchName() {
      // this.isCreateBranch = true;
      let data = {
        partmentName: this.branchName,
        memberId: this.social2
      };
      changeBranchNames(this.depId, data).then(res => {
        if (res.result == 1) {
          // this.isCreateBranch = false;
          this.$Message.success("修改成功");
          this.getList();
        }
      });
    },
    goMember() {
      this.$router.push("/members");
    },
    // 获取子部门
    getChilder(item, index) {
      getDepartmentTree("", item.id).then(res => {
        this.departmentTreeNewCopy[index].childer = res.data;
        this.departmentTreeNewCopy[index].childen = true;
        this.departmentTreeNew = [];
        this.departmentTreeNew = this.departmentTreeNewCopy;
        console.log(this.departmentTreeNew);
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/managementS";
.line {
  width: 56px !important;
}
</style>