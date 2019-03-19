<template>
    <div class="circled">
        <Icon type="plus-circled" @click='show=!show'></Icon>
        <div class="list" v-if="show">
            <p v-for="(i, k) in data" :key="k" @click='click(i)'>
                <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+i.defaultImage" alt="">
                {{i.userName}}
            </p>
        </div>
    </div>
</template>

<script>
import ajax from '@/axios/fetch'
import api from '@/axios/url'
export default {
  name: '',
  data() {
    return {
      data: [],
      show: false
    }
  },
  props: {
    id: String
  },
  mounted() {
    let abt = { url: api.members.replace(':projectId', this.id), method: 'GET' }
    ajax(abt).then(res => {
      console.log('members', res)
      this.data = res.data
    })
  },
  components: {},
  methods: {
    click(i) {
      this.$emit('select', i)
      this.show = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.circled {
  position: relative;
  //   overflow: hidden;
  display: inline-block;
  min-width: 200px;
  .list {
    z-index: 100;
    position: absolute;
    left: 0;
    top: 30px;
    background-color: #fff;
    border: 1px solid #eee;
    padding: 5px 0;
    border-radius: 4px;
    transform: translateX(-50%);
    margin-left: 12px;
    p {
      padding: 2px 10px;
      transition: all 0.3s;
      font-size: 12px;
      line-height: 24px;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
      }
      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>
