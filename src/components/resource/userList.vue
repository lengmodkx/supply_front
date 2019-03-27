<template>
  <div class="circled">
    <Input search enter-button placeholder="请输入关键进行查询" />
    <div class="select-people">
      <p>参与者</p>
      <ul>
        <li class="people-lsit" v-for="(item, index) in data" :key="index">
          <div class="people-info">
            <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.image" alt="">
            <p>{{item.userName}}</p>
          </div>
          <Icon class="gou" size="16" type="md-checkmark" />
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import { members } from "@/axios/api";
export default {
  name: "",
  data() {
    return {
      data: [],
      show: false,
      userinfo: this.$store.state.userInfo
    }
  },
  props: {
    id: String
  },
  mounted() {
    members(this.id).then(res => {
      console.log("members", res);
      this.data = res.data;
    });
  },
  components: {},
  methods: {
    click(i) {
      this.$emit("select", i);
      this.show = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.circled {
  min-width: 252px;
  height: 362px;
  border-radius: 5px;
}
  .select-people{
    height: 330px;
    width: 100%;
    padding-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .people-lsit{
    width: 100%;
    height: 40px;
    padding: 4px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover{
      background-color: #f5f5f5;
    }
    .people-info{
      display: flex;
      img{
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 15px;
      }
      p{
        width: 200px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
    }
    .gou{
      color: #D1D1D1;
      margin-right: 10px;
    }

  }
</style>
