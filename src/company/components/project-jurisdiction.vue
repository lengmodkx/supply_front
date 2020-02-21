<template>
  <div class="project-permission-content">
    <header class="ppc-header">
      <span class="ppc-header-title"> 项目权限</span>
    </header>
    <div class="project-permission-content">
      <div class="pcc-operate">
        <Button type="primary" icon="md-add" @click="addRole">新增</Button>
      </div>
      <div class="per-table">
        <Table border ref="selection" :columns="columns" :data="roleList">
          <template slot-scope="{ row }" slot="roleName">
            <strong>{{ row.roleName }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 10px" @click="editRole(index)" v-if="!row.isSystemInit">编辑</Button>
            <Button type="error" size="small" style="margin-right: 10px" v-if="!row.isSystemInit" @click="romoveRole(index)">删除</Button>
            <Button type="success" size="small" v-if="row.isDefault" disabled style="margin-right: 10px">默认权限</Button>
            <Button type="success" size="small" style="margin-right: 10px" v-if="!row.isDefault && !row.isSystemInit" @click="setDefault(index)">设为默认权限</Button>
            <Button type="success" size="small" style="margin-right: 10px" v-if="!row.isDefault && row.roleKey == 'member'" @click="setDefault(index)">设为默认权限</Button>
            <Button type="success" size="small" @click="givePower(index)">分配权限</Button>
          </template>
        </Table>
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
      <Modal v-model="permissionAssign" title="权限分配" width="1200px" class="padd0" fullscreen footer-hide :z-index="1001">
        <project-permission :flag="false" :permissions="permissions" :role="nowRole" v-if="permissionAssign" ref="permission" @close="permissionAssign = false"></project-permission>
      </Modal>
    </div>
  </div>
</template>
<script>
import projectPermission from "./projectpermission.vue";
import { getAllRoles, getAllPower, addRole, deleteRole, updateRole } from "../axios/api";
export default {
  components: {
    projectPermission
  },
  data() {
    return {
      orgId: localStorage.companyId,
      resources: [],
      types: [
        { value: 1, label: "菜单" },
        { value: 2, label: "按钮" }
      ],
      roleAdd: false,
      permissionAssign: false,
      permissionAdd: false,
      roleName: "",
      roleDes: "",
      roleKey: "",
      modelTitle: "新增角色",
      tableRow: [],
      total: 10,
      roleList: [],
      role: "",
      nowRole: {},
      permissions: [],
      columns: [
        {
          title: "角色名称",
          slot: "roleName"
        },
        {
          title: "角色描述",
          key: "roleDes"
        },
        {
          title: "角色标识",
          key: "roleKey"
        },
        {
          title: "操作",
          slot: "action",
          width: 350,
          align: "center"
        }
      ]
    };
  },
  mounted() {
    this.getAllRole();
  },
  methods: {
    // 获取企业角色
    getAllRole() {
      getAllRoles(localStorage.companyId).then(res => {
        if (res.result == 1) {
          console.log(res.data);
          this.roleList = res.data;
        }
      });
    },
    // 点击单选按钮
    cahngeRole(data) {
      this.roleList.forEach(v => {
        if (v.roleId === data) {
          this.nowRole = v;
        }
      });
      console.log(this.nowRole);
    },
    // 分配权限
    givePower(index) {
      this.nowRole = this.roleList[index];
      getAllPower(this.nowRole.roleId).then(res => {
        if (res.result == 1) {
          this.permissions = res.data;
          this.permissionAssign = true;
        }
      });
    },
    // 新增角色
    addRole() {
      this.roleAdd = true;
      this.modelTitle = "新增角色";
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
      if (this.roleDes == "" || this.roleDes == null) {
        this.$Notice.warning({
          title: "请输入角色描述"
        });
        return false;
      }
      // 编辑角色
      if (this.modelTitle === "编辑角色") {
        updateRole(this.nowRole.roleId, this.roleName, this.roleDes, this.roleKey).then(res => {
          if (res.result == 1) {
            this.roleAdd = false;
            this.$Message.success("修改成功");
            this.getAllRole();
          } else {
            this.$Message.error(res.msg);
          }
        });
      } else {
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
      }
    },
    // 编辑角色
    editRole(index) {
      this.nowRole = this.roleList[index];
      this.roleAdd = true;
      this.modelTitle = "编辑角色";
      this.roleName = this.nowRole.roleName;
      this.roleKey = this.nowRole.roleKey;
      this.roleDes = this.nowRole.roleDes;
    },
    // 移除角色
    romoveRole(index) {
      var nowRole = this.roleList[index];
      deleteRole(nowRole.roleId, this.orgId).then(res => {
        if (res.result == 1) {
          this.$Message.success("删除成功");
          this.getAllRole();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    setDefault(index) {
      var nowRole = this.roleList[index];
      defaultRole(nowRole.roleKey, this.orgId).then(res => {
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
.project-permission-content {
  height: calc(100vh - 88px);
  background: #fff;
  border-radius: 4px;
  .pcc-operate {
    margin: 20px 20px;
    button {
      margin-right: 15px;
    }
  }
  .pcc-role-table {
    margin-left: 20px;
    margin-right: 20px;
  }
  .ppc-header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom: 1px solid #e5e5e5;
    .ppc-header-add-role {
      display: flex;
      align-items: center;
    }
    .add-role-title {
      font-size: 16px;
    }
    .ppc-header-title {
      font-size: 18px;
    }
  }
}
.add-role {
  padding: 20px 20px;
  height: 230px;
  .add-role-input {
    margin-bottom: 20px;
  }
}
.model-op {
  .op-btn {
    float: right;
    margin-right: 10px;
    margin-top: 6px;
  }
}
.add-resource {
  padding: 20px 20px;
  height: 380px;
  .add-role-input {
    margin-bottom: 20px;
  }
}
.padd0 {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
}
.role-li > div {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d5d5d5;
  border-right: 1px solid #d5d5d5;
}
.role-head {
  font-size: 14px;
  font-weight: 600;
  background-color: #f8f8f9;
}
.role-li:nth-of-type(2n) {
  background-color: #f8f8f9;
}
.role-li {
  width: 100%;
  height: 40px;
  display: flex;
  border-top: 1px solid #d5d5d5;
  border-left: 1px solid #d5d5d5;
  .radio-wrap {
    width: 60px;
    flex: none;
  }
  .w25 {
    width: 25%;
  }
  .w30 {
    width: 30%;
  }
}
.per-table {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
