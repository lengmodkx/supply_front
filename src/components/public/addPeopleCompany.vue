<template>
  <div class="addCompanyWrap">
    <div class="banner">
      <img src="../../assets/images/addCompany.png" alt="" />
    </div>

    <Tabs active-key="key1">
      <Tab-pane label="分享链接/申请码邀请" key="key1" v-if="tabOneShow" index="1">
        <div class="share df">
          <Icon type="ios-link" color="#1379FF" size="19" class="link" />
          <div>
            <div class="share-text">邀请链接</div>
            <div class="small">
              访问链接的用户可以
            </div>
            <Radio :checked.sync="single">自动加入企业</Radio>
            <div class="next-input">
              <div class="link-name tasklink">{{shareWebsite}}</div>
              <!-- <div class="icon-warp"> -->
                <!-- <Icon type="ios-refresh" size='22' /> -->
                <!-- <Icon type="ios-copy-outline" size='20'
                  class="btn" /> -->
              <!-- </div> -->
            </div>
            <!-- <div class="small">
              链接有效期至：2020-05-28 16:29
            </div> -->
          </div>
        </div>
        <Button class="shareButton btn" type="primary"  @click="copylink" data-clipboard-target=".tasklink">复制邀请信息</Button>
      </Tab-pane>
      <Tab-pane label="手机/邮箱邀请" key="key2" index="2">
        <div class="iphone">
          <Input v-model="iphoneModel1" placeholder="请输入手机号和邮箱" />
          <div class="tip">
            <Icon type="md-close-circle" color="#e62412" v-if="exiPhone||illegalPhone" />
            <div class="tip-text" v-if="exiPhone">该成员已加入企业，请勿重复邀请</div>
            <div class="tip-text" v-if="illegalPhone">请输入正确的手机号或邮箱,或其未注册</div>
          </div>
          <Input v-model="iphoneModel2" placeholder="请输入手机号和邮箱" style="margin-top:15px" />
          <div class="tip">
            <Icon type="md-close-circle" color="#e62412" v-if="exiPhone2||illegalPhone2" />
            <div class="tip-text" v-if="exiPhone2">该成员已加入企业，请勿重复邀请</div>
            <div class="tip-text" v-if="illegalPhone2">请输入正确的手机号或邮箱,或其未注册</div>
          </div>
          <Input v-model="iphoneModel3" placeholder="请输入手机号和邮箱" style="margin-top:15px" />
          <div class="tip">
            <Icon type="md-close-circle" color="#e62412" v-if="exiPhone3||illegalPhone3" />
            <div class="tip-text" v-if="exiPhone3">该成员已加入企业，请勿重复邀请</div>
            <div class="tip-text" v-if="illegalPhone3">请输入正确的手机号或邮箱,或其未注册</div>
          </div>
        </div>
        <Button class="shareButton" type="primary"
          :disabled="exiPhone || illegalPhone ||exiPhone2 || illegalPhone2||exiPhone3 || illegalPhone3"
          @click="sendInv">邀请成员</Button>

      </Tab-pane>
    </Tabs>

  </div>
</template>

<script>
  import Clipboard from "clipboard";
  import {
    verifyPhone,
    invitation
  } from "@/axios/companyApi";
  export default {
    props: ['tabOneShow'],
    name: "addPeople",
    data() {
      return {
        single: true,
        iphoneModel1: '',
        iphoneModel2: '',
        iphoneModel3: '',
        shareWebsite: '',
        illegalPhone: false, //手机号违法提示
        exiPhone: false,  //手机号已存在提示
        illegalPhone2: false, //手机号违法提示
        exiPhone2: false,  //手机号已存在提示
        illegalPhone3: false, //手机号违法提示
        exiPhone3: false,  //手机号已存在提示
        phoneList: [],
        emailList: [],
      };
    },
    mounted() {
      this.shareWebsite = window.location.host + '/loginCompany/' + localStorage.companyId+ '?memerId='+localStorage.userId+'&from=members'
    },
    methods: {
      copylink() {
        var clipboard = new Clipboard(".btn");
        clipboard.on("success", e => {
          this.$Message.info('复制成功');
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on("error", e => {
          // 不支持复制
          console.log("该浏览器不支持自动复制");
          clipboard.destroy();
        });
      },
      evaluatePhoneNumber(phone) {
        let tempReg = /^1[0-9]{10}$/
        return tempReg.test(phone)
      },
      verifyMailbox(email) {
        var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        return reg.test(email)
      },
      sendInv() {
        if (this.evaluatePhoneNumber(this.iphoneModel1)) {
          this.phoneList.push(this.iphoneModel1)
        } else if (this.verifyMailbox(this.iphoneModel1)) {
          this.emailList.push(this.iphoneModel1)
        }
        if (this.evaluatePhoneNumber(this.iphoneModel2)) {
          this.phoneList.push(this.iphoneModel2)
        } else if (this.verifyMailbox(this.iphoneModel2)) {
          this.emailList.push(this.iphoneModel2)
        }
        if (this.evaluatePhoneNumber(this.iphoneModel3)) {
          this.phoneList.push(this.iphoneModel3)
        } else if (this.verifyMailbox(this.iphoneModel3)) {
          this.emailList.push(this.iphoneModel3)
        }
        let data = {
          phone: this.phoneList.join(','),
          memberEmail: this.emailList.join(',')
        }
        invitation(localStorage.companyId, data).then(res => {
          if (res.result == 1) {
            this.$Message.info('邀请成功');
            this.iphoneModel1 = ''
            this.iphoneModel2 = ''
            this.illegalPhone = false
            this.exiPhone = false
            this.illegalPhone2 = false
            this.exiPhone2 = false
            this.$emit("successInv");
          }
        });
      },
      getverifyPhone(data, num) {
        verifyPhone(localStorage.companyId, data).then(res => {
          if (res.data == '0') {
            if (num == 1) {
              this.exiPhone = false
              this.illegalPhone = false
            } else if (num == 2) {
              this.exiPhone2 = false
              this.illegalPhone2 = false
            } else {
              this.exiPhone3 = false
              this.illegalPhone3 = false
            }
          } else if (res.data == '1') {
            if (num == 1) {
              this.exiPhone = true
              this.illegalPhone = false
            } else if (num == 2) {
              this.exiPhone2 = true
              this.illegalPhone2 = false
            } else {
              this.exiPhone3 = true
              this.illegalPhone3 = false
            }
          } else {
            if (num == 1) {
              this.exiPhone = false
              this.illegalPhone = true
            } else if (num == 2) {
              this.exiPhone2 = false
              this.illegalPhone2 = true
            } else {
              this.exiPhone3 = false
              this.illegalPhone3 = true
            }
          }
        });
      },
    },
    watch: {
      'iphoneModel1': function (val) {
        if (this.evaluatePhoneNumber(val)) {
          this.getverifyPhone({ phone: val }, 1)
        } else if (this.verifyMailbox(val)) {
          this.getverifyPhone({ memberEmail: val }, 1)
        } else {
          this.illegalPhone = true
          this.exiPhone = false
        }
        if (val == '') {
          this.illegalPhone = false
          this.exiPhone = false
        }
      },
      'iphoneModel2': function (val) {

        if (this.evaluatePhoneNumber(val)) {
          this.getverifyPhone({ phone: val }, 2)
        } else if (this.verifyMailbox(val)) {
          this.getverifyPhone({ memberEmail: val }, 2)
        } else {
          this.illegalPhone2 = true
          this.exiPhone2 = false
        }
        if (val == '') {
          this.illegalPhone2 = false
          this.exiPhone2 = false
        }
      },
      'iphoneModel3': function (val) {

        if (this.evaluatePhoneNumber(val)) {
          this.getverifyPhone({ phone: val }, 3)
        } else if (this.verifyMailbox(val)) {
          this.getverifyPhone({ memberEmail: val }, 3)
        } else {
          this.illegalPhone3 = true
          this.exiPhone3 = false
        }
        if (val == '') {
          this.illegalPhone3 = false
          this.exiPhone3 = false
        }
      },
    }
  };
</script>

<style scoped lang="less">
  .addCompanyWrap {
    .banner {
      width: 90%;
      margin: 10px auto 20px;

      img {
        width: 100%;
      }
    }

    .share {
      /* border-bottom: 1px solid #d9d9d9; */
      color: #595959;
      font-size: 14px;
      padding-bottom: 10px;

      .link {
        margin-right: 10px;
      }

      .share-text {
        font-size: 14px;
        color: #333333;
      }

      .small {
        font-size: 12px;
        margin: 10px 0 0;
        color: #8c8c8c;
      }

      label {
        margin: 10px 0 0;
      }

      .next-input {
        margin: 10px 0 0;
        width: 380px;
        height: 36px;
        line-height: 36px;
        text-indent: 10px;
        border-radius: 3px;
        transition: border-color .3s ease-out;
        border: 1px solid #d9d9d9;
        background-color: #fff;
        display: flex;

        .link-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .icon-warp {
          /* float: right; */
          margin-right: 10px;

          i {
            cursor: pointer;
          }
        }
      }
    }

    .shareButton {
      float: right;
      margin-top: 20px;
    }

    .iphone {
      .tip {
        display: flex;
        align-items: center;
        margin-top: 10px;
        color: #e62412;
      }
    }

  }
</style>