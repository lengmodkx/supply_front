<template>
  <Dropdown trigger="click" style="width:160px;">
    <span class="typeBtn" :class="{normal:(newName=='普通'),high:(newName=='紧急'),urgent:(newName=='非常紧急')}">{{newName}}</span>
    <DropdownMenu slot="list">
      <DropdownItem style="line-height:30px;" v-for="(item,index) in urgentList" :key="index" @click.native="choose(item.id,item.name)">
        <span class="typeBtn" :class="{normal:(item.name=='普通'),high:(item.name=='紧急'),urgent:(item.name=='非常紧急')}">{{item.name}}</span>
        <svg-icon class="right" name="right" v-if="item.id==checkedId"></svg-icon>
      </DropdownItem>

    </DropdownMenu>
  </Dropdown>
</template>
<script>
export default {
  data() {
    return {
      data: "",
      checkedId: null, //到时候要通过Props取
      newName: this.checkedName,
      urgentList: [
        {
          id: 1,
          name: "普通"
        },
        {
          id: 2,
          name: "紧急"
        },
        {
          id: 3,
          name: "非常紧急"
        }
      ]
    };
  },
  props: ["checkedName"],
  methods: {
    choose(id, name) {
      this.checkedId = id;
      this.newName = name;
      this.$emit("priority", name);
    }
  }
};
</script>
<style scoped lang="less">
.right {
  float: right;
  vertical-align: center;
  width: 20px;
}
.typeBtn {
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
}
.typeBtn {
  &:hover {
    border-color: #3da8f5;
    color: #3da8f5;
  }
}
.normal {
  border: 1px solid #87d2ff;
  color: #1b9aee;
}
.high {
  border: 1px solid #ffaf38;
  color: #ffaf38;
}
.urgent {
  border: 1px solid #ff4f3e;
  color: #ff4f3e;
}
</style>

