<template>
  <div class="circled">
    <Input search enter-button placeholder="请输入关键进行查询" />
    <div>
      <p>
        参与者
      </p>

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
    };
  },
  props: {
    id: String
  },
  mounted() {
    members(this.id).then(res => {
      console.log("members", res.data);
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
</style>
