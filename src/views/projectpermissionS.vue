<template>
  <div>
      <Loading v-if="loading"></Loading>
    <div class="modal-per-content" v-for="(permission, index) in pers" :key="index">
      <div class="checke-title">
        <Checkbox
          :disabled="disabled"
          :indeterminate="permission.indeterminate"
          v-model="permission.checkAll"
          @click.prevent.native="handleCheckAll(permission)"
        >{{ permission.group }}</Checkbox>
      </div>
      <CheckboxGroup
        v-model="permission.checkAllGroup"
        @on-change="checkAllGroupChange(permission)"
      >
        <Row>
          <Col span="6" v-for="(resource, index) in permission.resources" :key="index">
            <Checkbox
              :disabled="disabled"
              :label="resource.id"
              ref="resource"
            >{{ resource.resourceName }}</Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
    </div>
    <!-- <div class="footer-btn">
      <Button type="primary" class="close-btn" @click="closePower">关闭</Button>
      <Button type="primary" @click="savePower">保存</Button>
    </div> -->
  </div>
</template>
<script>
import { changePower, changeOrgPower } from "@/axios/api";
import Loading from "../components/public/common/Loading.vue";
export default {
  props: ["flag", "permissions", "role"],
  components: {
    Loading,
  },
  data() {
    return {
      disabled:
        this.role.roleKey === "administrator" || this.role.roleKey === "admin",
      pers: this.permissions.map(p => {
        if (p.checkAllGroup.length == p.resources.length) {
          p.indeterminate = false;
          p.checkAll = true;
        } else {
          p.indeterminate = true;
          p.checkAll = false;
        }
        return p;
      }),
      resources: [],
      loading:false
    };
  },
  mounted(){
    this.loading = true;
    setTimeout(()=>{
      this.loading = false;
    },500)
  },
  methods: {
    handleCheckAll(permission) {
      console.log(permission)
      if (permission.indeterminate) {
        permission.checkAll = false;
      } else {
        permission.checkAll = !permission.checkAll;
      }
      permission.indeterminate = false;
      if (permission.checkAll) {
        permission.indeterminate = false;
        permission.resources.forEach(p => {
          this.resources.push(p.id);
        });
        permission.checkAllGroup = this.resources;
      } else {
        permission.indeterminate = false;
        (permission.checkAllGroup = []), (this.resources = []);
      }
       setTimeout(()=>{
          this.savePower()
       },0)

    },
    checkAllGroupChange(permission) {
      if (permission.checkAllGroup.length === permission.resources.length) {
        permission.indeterminate = false;
        permission.checkAll = true;
      } else if (permission.checkAllGroup.length > 0) {
        permission.indeterminate = true;
        permission.checkAll = false;
      } else {
        permission.indeterminate = false;
        permission.checkAll = false;
      }
      this.savePower()
    },
    closePower() {
      this.$emit("close");
    },
    // 保存 按钮
    savePower() {
      let resourcesArr = [];
      this.$refs.resource.forEach(res => {
        if (res.currentValue) {
          resourcesArr.push(res.label);
        }
      });
      console.log(resourcesArr);
      if (this.flag) {
        changeOrgPower(this.role.roleId, resourcesArr.join(",")).then(res => {
          if (res.result === 1) {
            // this.$emit("close");
            this.$Message.success("设置成功");
          } else {
            this.$Message.error("设置失败");
          }
        });
      } else {
        changePower(this.role.roleId, resourcesArr.join(",")).then(res => {
          if (res.result === 1) {
            // this.$emit("close");
            this.$Message.success("设置成功");
          } else {
            this.$Message.error("设置失败");
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.footer-btn {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}
.close-btn {
  margin-right: 10px;
}
.modal-per-content {
  /* display: flex; */
  border-bottom: 1px solid #e9e9e9;
  margin-top: 15px;
  padding: 0 16px;
}
// .modal-per-content:nth-last-child(1) {
//   border-bottom: 0 none;
// }

.checke-title {
  display: flex;
  height: 36px;
  align-items: center;
}
.ivu-checkbox-group {
  color: #999999;
  padding-bottom: 12px;
}
.ivu-checkbox-group-item {
  line-height: 36px;
}
.mb15 {
  margin-bottom: 15px;
}
</style>
