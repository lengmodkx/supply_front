<template>
  <div>
    <ul v-if="tags!=null">
      <li v-for="(tag,index) in tags" :key="index" class="tag-li">
        <div>
          <i :style="{height:'10px',width:'10px',background:tag.bgColor}"></i>
          <p>{{tag.tagName}}</p>
        </div>
        <Icon type="ios-arrow-forward"/>
      </li>
    </ul>
    <div v-else>暂无标签</div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getTags(this.$route.params.id);
  },
  computed: {
    ...mapState("tag", ["tags"])
  },
  methods: {
    ...mapActions("tag", ["getTags"])
  }
};
</script>

<style scoped lang="less">
.tag-li {
  height: 40px;
  &:hover {
    background-color: #e5e5e5;
  }
}
</style>

