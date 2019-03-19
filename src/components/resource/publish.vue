<template>
  <div class="publish">
    <div class="wrap">
      <div class="top">
        <div class="box">
          <div class="input">{{data}}</div>
          <textarea v-model="data" placeholder="@提及他人，按 Enter 快速发布"></textarea>
        </div>
        <div class="zd"></div>
      </div>
      <div class="bottom">
        <Icon type="android-attach"></Icon>
        <Icon type="happy-outline"></Icon>
        <Button class="fr" type="info">发布</Button>
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      data: ''
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.publish {
  background-color: #e5e5e5;
  border-top: 1px solid #d9d9d9;
  width: 100%;
  .wrap {
    position: relative;
    min-height: 40px;
    margin: 14px 20px 13px 15px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    overflow: hidden;
    .bottom {
      padding: 3px 10px;
      overflow: hidden;
      .ivu-icon {
        margin-top: 6px;
        margin-right: 10px;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .top {
      position: relative;
      z-index: 1;
      padding: 10px;
      /*border-color: #d9d9d9;*/
      border-bottom: 1px solid #d9d9d9;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      overflow: hidden;
      .input {
        min-height: 20px;
        width: 100%;
        visibility: hidden;
        position: relative;
        word-break: break-word;
        white-space: pre-wrap;
        font-size: 13px;
      }
      .box {
        min-height: 20px;
        width: 100%;
        position: relative;
        max-height: 290px;
        overflow: hidden;
      }
      .zd {
        position: absolute;
        z-index: 100;
        width: 20px;
        height: 100%;
        right: 0;
        top: 0;
        background-color: #fff;
      }
      textarea {
        width: 100%;
        height: 100%;
        line-height: 20px;
        font-size: 13px;
        border: 0;
        position: absolute;
        top: 0;
        z-index: 99;
        left: 0;
      }
    }
  }
}
</style>
