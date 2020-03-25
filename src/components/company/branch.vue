<template>
  <div class="go-right">
    <div style="width: 100%" v-for="(item, index) in branchData" :key="item.partmentId">
      <div :class="{ checked: branchId == item.partmentId }" class="yiji-bumen" @click="sendPeople(item, index)">
        <span style="display:flex;align-items:center"><Icon type="ios-home" color="#3da8f5" size="18"/>{{ item.partmentName }}</span>
        <div v-if="item.hasPartment">
          <Icon @click.stop="showSon(item, index)" v-if="item.isdown" type="ios-arrow-dropdown-circle" color="#3da8f5" size="20" />
          <Icon v-else @click.stop="closeSon(item, index)" type="ios-arrow-dropup-circle" color="#3da8f5" size="20" />
        </div>
      </div>
      <div style="width: 100%" v-if="item.hasPartment">
        <branch ref="branch" @getBranchMember="getBranchMember" :branchData="item.children"></branch>
      </div>
    </div>
  </div>
</template>

<script>
import branch from "./branch";
import { getSonBranchs } from "@/axios/companyApi";
import { mapMutations, mapState } from "vuex";
export default {
  props: ["branchData"],
  name: "branch",
  data() {
    return {
      bumenChecked: "",
      nn: -1
    };
  },
  components: { branch },
  computed: {
    ...mapState("company", ["branchId"])
  },
  methods: {
    ...mapMutations("company", ["setBranchId"]),
    delPartment(id){
      console.log('>>>>>>>>>>>>>>>>>>>>>>>',this.branchData)
      for(let i in this.branchData) {
        
          if(this.branchData[i].partmentId == id){
              console.log('xxxxxxxxxxxxxxxxxxxxxxx')
              this.branchData.splice(i,1);
          }
      }
    },
    sendPeople(item, n) {
      this.setBranchId(item.partmentId);
      this.$emit("getBranchMember", item,n);
    },
    getBranchMember(item) {
      this.clearChecked(item);
      this.$emit("getBranchMember", item);
    },
    showSon(item, n) {
      item.isdown = false;
      
      getSonBranchs(item.partmentId).then(res => {
        res.data.forEach(i => {
          i.isdown = true;
        });
        this.$set(this.branchData[n], "children", res.data);
      });
    },
    closeSon(item, n) {
      item.isdown = true;
      this.branchData[n].children = [];
    },
    // 清除checked
    clearChecked(item) {
      this.bumenChecked = "";
      if (item.isExistSubPartment) {
        this.$refs.branch.clearChecked();
      }
    }
  }
};
</script>

<style scoped lang="less">
.checked {
  background-color: #f5f5f5;
}
.yiji-bumen {
  width: 100%;
  height: 44px;
  padding: 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: #f5f5f5;
  }
}
.go-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /deep/ .go-right > div {
    width: calc(100% - 20px) !important;
    
  }
}
</style>
