<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div v-if="!checkFlag">项目权限</div>
        <div v-else class="routerNav">
          <Icon type="md-arrow-back" color="#2B85E4" size="20" style="margin-right:10px;cursor: pointer;" @click="checkFlag=false;permissionAssign=false"/>
          <span class="backBtn" >项目权限 ></span>
          <span>{{nowRole.roleName}}</span>
        </div>
        <div class="icon-content" v-if="!checkFlag">
          <div class="r-jump" @click="addRole">
            <Icon type="md-add" size="20"/>
            <span>添加权限组</span>
          </div>
        </div>
        <div class="line" v-if="!checkFlag"></div>
        <div class="lines" v-else></div>
      </div>
      <Loading v-if="loading"></Loading>
      <div class="jur-content" v-if="!checkFlag">
        <div
          class="jur-item"
          v-for="(item, index) in roleList"
          :key="index"
          @click="givePower(item)"
        >
          <div>{{ item.roleName }}</div>
          <div class="df ac">
            <div class="default" v-if="item.isDefault">项目默认权限组</div>
            <div
              class="default-seeting"
              v-else-if="!item.isSystemInit||item.roleKey == 'member'"
              @click.stop="setDefault(item)"
            >设置项目默认角色</div>
            <Icon type="ios-arrow-forward" color="#999999" size="15" />
          </div>
        </div>
      </div>
      <div class="jur-checkContent" v-else>
        <project-permission
          :flag="false"
          :permissions="permissions"
          :role="nowRole"
          v-if="permissionAssign"
          ref="permission"
          @close="permissionAssign = false"
        ></project-permission>
      </div>
    </div>
    <Modal v-model="roleAdd" :title="modelTitle" transfer footer-hide :z-index="1001">
      <div class="add-role">
        <Input v-model="roleName" class="add-role-input" placeholder="管理员">
          <span slot="prepend">角色名称</span>
        </Input>
        <Input v-model="roleKey" class="add-role-input" placeholder="admin">
          <span slot="prepend">角色标识</span>
        </Input>
        <Input v-model="roleDes" class="add-role-input" placeholder="管理员">
          <span slot="prepend">角色描述</span>
        </Input>
        <div class="model-op">
          <Button type="primary" @click="commitRole" class="op-btn">确定</Button>
          <Button type="default" @click="roleAdd = false" class="op-btn">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import projectPermission from "./projectpermissionS.vue";
import {
  getAllRoles,
  getAllPower,
  addRole,
  deleteRole,
  updateRole,
  defaultRole
} from "../../src/company/axios/api";

export default {
  components: {
    Loading,
    projectPermission
  },
  data() {
    return {
      permissionAssign: false,
      roleList: [],
      nowRole: {},
      permissions: [],
      checkFlag: false,
      roleAdd: false,
      roleName: "",
      roleKey: "",
      roleDes: "",
      modelTitle: "添加权限组",
      loading: false
    };
  },
  computed: {},
  mounted() {
    this.loading = true;
    this.getAllRole();
  },
  methods: {
    // 获取企业角色
    getAllRole() {
      getAllRoles(localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.roleList = res.data;
          this.loading = false;
        }
      });
    },
    // 分配权限
    givePower(item) {
      this.checkFlag = true;
      this.nowRole = item;
      getAllPower(item.roleId).then(res => {
        if (res.result == 1) {
          this.permissions = res.data;
          this.permissionAssign = true;
        }
      });
    },
    // 新增角色
    addRole() {
      this.roleAdd = true;
      this.modelTitle = "添加权限组";
      this.roleName = "";
      this.roleKey = "";
      this.roleDes = "";
    },
    commitRole() {
      if (this.roleName == "" || this.roleName == null) {
        this.$Notice.warning({
          title: "请输入角色名称"
        });
        return false;
      }
      if (this.roleKey == "" || this.roleKey == null) {
        this.$Notice.warning({
          title: "请输入角色标识"
        });
        return false;
      }
      if (this.roleKey == "admin" || this.roleKey == "administrator") {
        this.$Notice.warning({
          title: "角色标识不可用"
        });
        return false;
      }
      if (this.roleDes == "" || this.roleDes == null) {
        this.$Notice.warning({
          title: "请输入角色描述"
        });
        return false;
      }

      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].roleName === this.roleName) {
          this.$Notice.warning({
            title: "角色名称重复，请更换角色名称"
          });
          return false;
        }
        if (this.roleList[i].roleKey === this.roleKey) {
          this.$Notice.warning({
            title: "角色标识重复，请更换角色标识"
          });
          return false;
        }
      }
      let data = {
        orgId: localStorage.companyId,
        roleName: this.roleName,
        roleDes: this.roleDes,
        roleKey: this.roleKey
      };
      // 添加角色
      addRole(data).then(res => {
        if (res.result == 1) {
          this.roleAdd = false;
          this.$Message.success("添加成功");
          this.getAllRole();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    setDefault(item) {
      defaultRole(item.roleKey, localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.$Message.success("设置成功");
          this.getAllRole();
        } else {
          this.$Message.error("设置失败");
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/enterpriseAuthority";
</style>