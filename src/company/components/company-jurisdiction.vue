<template>
  <div class="project-permission-content">
    <header class="ppc-header">
      <span class="ppc-header-title"> 企业权限</span>
    </header>
    <div class="pcc-operate">
      <Button type="primary" icon="md-add" @click="addRole">新增</Button>
      <Button type="warning" icon="ios-create-outline" @click="editRole" :disabled="nowRole.isSystemInit">编辑</Button>
      <Button type="error" icon="ios-trash-outline" @click="showRomoveRole=true" :disabled="nowRole.isSystemInit">删除</Button>
      <Button type="success" icon="ios-filing-outline" @click="givePower">分配权限</Button>
      <!--<Button type="info" icon="ios-man-outline" >设为企业默认角色</Button>-->
      <!--<Button type="success" icon="ios-plus-outline" @click="resourceAdd">添加资源</Button>-->
    </div>
    <div class="pcc-role-table">
      <div class="role-li role-head">
        <div class="radio-wrap"></div>
        <div class="w25">角色名称</div>
        <div class="w25">角色描述</div>
        <div class="w25">企业默认角色</div>
        <div class="w30">创建时间</div>
        <div class="w30">更新时间</div>
      </div>
      <RadioGroup v-model="roleId" style="width: 100%" @on-change="changeRole">
        <div class="role-li" v-for="(item, index) in roleList" :key="index">
          <div class="radio-wrap">
            <Radio :label="item.roleId">
              <span></span>
            </Radio>
          </div>
          <div class="w25">{{ item.roleName }}</div>
          <div class="w25">{{ item.roleDes }}</div>
          <div class="w25">{{ item.isDefault ? "企业默认角色" : "-" }}</div>
          <div class="w30">{{ item.createTime | timeFilter }}</div>
          <div class="w30">{{ item.updateTime | timeFilter }}</div>
        </div>
      </RadioGroup>
    </div>
    <Modal v-model="roleAdd" :title="modelTitle" transfer footer-hide>
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
    <Modal v-model="permissionAssign" title="企业权限分配" width="850px" class="padd0" footer-hide>
      <project-permission :flag="true" :permissions="permissions" :role="nowRole" v-if="permissionAssign" ref="permission" @close="permissionAssign = false"></project-permission>
    </Modal>
    <!-- 删除 -->
      <Modal v-model="showRomoveRole" :width="350" :footer-hide="true" >             
                    <div class="rublish">您确定要执行删除吗</div>
                    <Button long type="error" @click="romoveRole()">确定</Button>
            
      </Modal>
  </div>
</template>
<script>
import projectPermission from "./projectpermission.vue";
import { getRole, getAllPower, addRole, deleteRole, updateRole } from "../axios/backendManagementApi";
export default {
  components: {
    projectPermission
  },
  data() {
    return {
      showRomoveRole:false,
      resourceType: "",
      resourceId: 0,
      resourceName: "",
      resourceKey: "",
      resourceUrl: "",
      resourceDes: "",
      resources: [],
      types: [
        { value: 1, label: "菜单" },
        { value: 2, label: "按钮" }
      ],
      roleAdd: false,
      permissionAssign: false,
      permissionAdd: false,
      roleName: "",
      roleKey: "",
      roleDes: "",
      modelTitle: "新增角色",
      tableRow: [],
      total: 10,
      roleList: [],
      roleId: "",
      nowRole: {},
      permissions: []
    };
  },
  mounted() {
    this.getAllRole();
  },
  methods: {
    // 获取企业角色
    getAllRole() {
      getRole(localStorage.companyId).then(res => {
        
        if (res.result) {
          this.roleList = res.data.records;
          console.log(this.roleList);
        }
      });
    },
    // 点击单选按钮
    changeRole(data) {
      this.roleList.forEach(v => {
        if (v.roleId === data) {
          this.nowRole = v;
        }
      });
    },
    // 分配权限
    givePower() {
      if (this.nowRole == null) {
        this.$Notice.warning({
          title: "请选择一个角色进行分配"
        });
      } else {
        getAllPower(this.nowRole.roleId).then(res => {
          console.log(res);
          this.permissions = res.data;
          this.permissionAssign = true;
        });
      }
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
            this.getAllRole();
            this.roleList.forEach((i, n) => {
              if (i.roleId === this.nowRole.roleId) {
                this.roleList[n].roleName = this.roleName;
                this.roleList[n].roleDes = this.roleDes;
                this.roleList[n].roleKey = this.roleKey;
              }
            });
            this.roleAdd = false;
            this.$Message.success("修改成功");
          } else {
            this.$Message.error("修改失败");
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
            this.$Message.error("添加失败");
          }
        });
      }
    },
    // 编辑角色
    editRole() {
      if (this.nowRole == null) {
        this.$Notice.warning({
          title: "请选择一个角色进行编辑"
        });
      } else {
        this.roleAdd = true;
        this.modelTitle = "编辑角色";
        this.roleName = this.nowRole.roleName;
        this.roleKey = this.nowRole.roleKey;
        this.roleDes = this.nowRole.roleDes;
      }
    },
    // 移除角色
    romoveRole() {
      if (this.nowRole == null) {
        this.$Notice.warning({
          title: "请选择角色进行删除"
        });
      } else {
        deleteRole(this.nowRole.roleId, localStorage.companyId).then(res => {
          if (res.result == 1) {
            this.getAllRole();
            this.nowRole = {};
            // this.role = "";
            this.$Message.success("删除成功");
            this.showRomoveRole=false;
         
            
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    changePage() {}
  }
};
</script>

<style lang="less">
.rublish{  
       margin:10px auto;
  }
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
</style>
