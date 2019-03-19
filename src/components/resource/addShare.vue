<template>
  <div class="addShare" :class="active" v-if="data">
    <div class="title">
      创建分享至
      BIM5D 任务管理
      <i class="fr ivu-icon ivu-icon-close-round" @click="close"></i>
    </div>
    <div class="context">
      <div class="input">
        <input type="text" placeholder="输入文档标题" maxlength="70" value="">
      </div>
      <div class="html">
        <Simditor></Simditor>
      </div>
    </div>
    <div class="footer">
      <a href="javascript:;" class="fl" v-if="type===1" @click="type=2">
        <p class="skt"><i class="ivu-icon ivu-icon-unlocked"></i> 隐私模式</p>
        <p class="ig">所有成员可见</p>
      </a>
      <a href="javascript:;" class="fl" v-if="type===2" @click="type=1">
        <p class="skt"><i class="ivu-icon ivu-icon-locked"></i> 隐私模式</p>
        <p class="ig">仅参与者可见</p>
      </a>
      <button type="button" class="fr ivu-btn ivu-btn-info ivu-btn-large"><!----> <!----> <span>立即发布</span></button>
    </div>
  </div>
</template>

<script>
import Simditor from './Simditor.vue'
export default {
  name: '',
  data() {
    return {
      type: 1,
      active: '',
      data: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log(this.value)
    this.watchValue(this.value)
  },
  components: { Simditor },
  methods: {
    watchValue(value) {
      if (value) {
        this.data = value
        setTimeout(() => {
          this.active = 'active'
        }, 100)
      } else {
        this.active = ''
        setTimeout(() => {
          this.data = value
        }, 500)
      }
    },
    close() {
      this.watchValue(false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.addShare {
  position: fixed;
  background-color: #fff;
  z-index: 20180910;
  left: 0;
  right: 0;
  bottom: 0;
  top: -50%;
  opacity: 0;
  transition: all 0.5s;
  overflow-y: scroll;
  padding-bottom: 70px;
  &.active {
    opacity: 1;
    top: 0;
  }
  .context {
    width: 965px;
    margin: 0 auto;
    .input input {
      width: 100%;
      font-size: 18px;
      border: none;
      height: 40px;
      line-height: 26px;
      margin-top: 20px;
    }
    .html {
      padding-top: 20px;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    padding: 16px;
    border-top: 1px solid rgb(226, 226, 226);
    z-index: 99;
    background-color: #fff;
    .fl {
      color: gray;
      &:hover {
        .skt {
          color: #2d8cf0;
        }
      }
    }
  }
  .title {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    padding: 0 16px;
    border-bottom: 1px solid rgb(226, 226, 226);
    .fr {
      margin-top: 16px;
      cursor: pointer;
    }
  }
}
</style>
