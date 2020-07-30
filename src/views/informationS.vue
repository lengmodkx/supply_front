<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>基础信息</div>
        <div class="line"></div>
      </div>
      <div class="content-item">
        <div class="item-left">企业头像</div>
        <img :src="img" alt class="headPortrait" />
        <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="getFile" />
        <Button type="primary" ghost @click="onPickFile">更换头像</Button>
      </div>
      <div class="content-item">
        <div class="item-left">企业名称</div>
        <div class="input-container">
          <Input size="large" placeholder="企业名称" v-model="orgName" />
        </div>
      </div>
      <div class="content-item">
        <div class="item-left">企业简介</div>
        <div class="input-container">
          <Input
            size="large"
            placeholder="企业简介"
            type="textarea"
            v-model="orgDes"
            :autosize="{minRows: 3,maxRows: 5}"
          />
        </div>
      </div>
      <div class="btn-container">
        <Button type="primary" class="determine-btn" size="large" @click="saveOrg">确定</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div>付费信息</div>
        <div class="line"></div>
      </div>
      <div class="content-item">
        <div class="item-left">版本信息</div>
        <div>专业版</div>
      </div>
      <div class="content-item">
        <div class="item-left">企业I D</div>
        <div>3dncre4354nvnfk45n443n</div>
      </div>
      <div class="content-item">
        <div class="item-left">成员数量</div>
        <div>1位成员使用名额，共10个名额</div>
      </div>
      <div class="content-item">
        <div class="item-left">创建时间</div>
        <div>2019年1月12日</div>
      </div>
      <div class="content-item">
        <div class="item-left">到期时间</div>
        <div>随10人以下企业长期免费</div>
      </div>
      <div class="content-item">
        <div class="item-left">企业状态</div>
        <div>正常使用</div>
      </div>
      <!-- <div class="btn-container">
        <Button type="primary" ghost>试用旗舰版</Button>
        <Button type="primary" ghost>立即购买</Button>
        <Button type="primary" ghost>查看订单</Button>
      </div> -->
    </div>
    <div class="content">
      <div class="title">
        <div>更多操作</div>
        <div class="line"></div>
      </div>
      <div class="content-item">
        <div class="item-left">企业归属</div>
        <img :src="userImg" alt class="headPortrait" />
        <span class="belonger">{{contact}}</span>
        <Button type="primary" ghost @click="getTransfer">移交</Button>
      </div>
      <div class="content-item">
        <div class="item-left">删除企业</div>
        <div class="input-container">
          <div>一旦你删除了企业，企业内所有项目、部门、成员，项目中所有内容以及所关联的所思文档都将会被永久删除。这是一个不可恢复的操作，请谨慎对待！</div>
        </div>
      </div>
      <div class="btn-container">
        <Button type="error" ghost @click="showDel=true">删除企业</Button>
      </div>
    </div>
    <Modal v-model="showTransfer" class="transfer" title="移交企业" :width="500" transfer footer-hide>
      <span>选择一个企业成员作为新的企业拥有者，移交后你的角色将变为成员</span>
      <Select v-model="transferId" clearable style="width:470px;margin-bottom:20px">
        <Option
          v-for="item in transferList"
          :value="item.userId"
          :key="item.userId"
        >{{item.userName }}</Option>
      </Select>
      <Button type="error" long @click="surTransfer">确认移交</Button>
    </Modal>
    <Modal v-model="showDel" class="transfer" title="删除企业" :width="500" transfer footer-hide>
      <span>一旦你删除了企业，企业内所有项目、部门、成员，项目中所有内容等都将会被永久删除。这是一个不可恢复的操作，请谨慎对待！</span>
      <Button type="error" long @click="sureDel">确认删除</Button>
    </Modal>
  </div>
</template>
<script>
import {
  orgInfo,
  updateOrg,
  delOrg,
  getAllTransfer,
  postTransfer
} from "../company/axios/api";
import OSS from "ali-oss";
let client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: "LTAIP4MyTAbONGJx",
  accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
  bucket: "art1001-bim-5d"
});
export default {
  name: "enterpriseInformation",
  data() {
    return {
      orgId: localStorage.companyId,
      img: "",
      userImg: "",
      postUrl: "",
      pic_show: true,
      pic_hide: false,
      orgName: "",
      orgDes: "",
      orgPublick: "0",
      contact: "",
      ownerId: "", //拥有者id
      //删除
      showDel: false,
      //移交
      showTransfer: false,
      transferId: "",
      transferList: []
    };
  },
  mounted() {
    this.getOrgInfo();
  },
  methods: {
    get_suffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    random_string(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    getFile(event) {
      var that = this;
      const files = event.target.files;
      this.filename = files[0].name; //只有一个文件
      if (this.filename.lastIndexOf(".") <= 0) {
        return alert("Please add a valid image!"); //判断图片是否有效
      }
      const fileReader = new FileReader(); //内置方法new FileReader()   读取文件
      fileReader.addEventListener("load", () => {
        (this.pic_show = false),
          (this.pic_hide = true),
          (this.img = fileReader.result);
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
      //到这里后, 选择图片就可以显示出来了
      this.fileName =
        this.dirName + this.random_string(10) + this.get_suffix(this.filename);

      if (this.filename) {
        client
          .multipartUpload("/orgImg/" + this.fileName, this.image, {
            progress: function(p) {}
          })
          .then(function(result) {});
      }
      let params = {
        orgImg:
          "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/orgImg/" +
          this.fileName
      };
      updateOrg(localStorage.companyId, params).then(res => {
        if (res.result === 1) {
          this.$Message.success("修改成功");
        } else {
          this.$Message.eror("修改失败");
        }
      });
    },
    getOrgInfo() {
      orgInfo(localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.img = res.data.organizationImage;
          this.orgName = res.data.organizationName;
          this.orgDes = res.data.organizationIntro;
          this.orgPublick = res.data.isPublic + "";
          this.contact = res.data.contact;
          this.ownerId = res.data.organizationMember;
          this.userImg = res.data.userImg;
        }
      });
    },
    //移交
    surTransfer() {
      postTransfer(localStorage.companyId, this.ownerId, this.transferId).then(
        res => {
          if (res.result == 1) {
            this.$Message.success("移交成功");
            this.$router.push("/");
          } else {
            this.$Message.error("移交失败");
          }
        }
      );
    },
    //获取移交成员
    getTransfer() {
      this.showTransfer = true;
      getAllTransfer(localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.transferList = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //删除企业
    sureDel() {
      this.showDel = false;

      delOrg(localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.$Message.success("删除企业成功");
          this.$router.push("/delOrg");
        } else {
          this.$Message.error("删除企业失败");
        }
      });
    },

    saveOrg() {
      let params = {
        orgImg: this.img,
        orgName: this.orgName,
        orgIntro: this.orgDes,
        isPublic: this.orgPublick,
        memberId: localStorage.userId
      };
      updateOrg(localStorage.companyId, params).then(res => {
        if (res.result == 1) {
          this.$Message.success("修改成功");
        } else {
          this.$Message.eror("修改失败");
        }
      });
    }
  },
  created() {}
};
</script>
<style lang="less" scoped  >
@import "../assets/css/information";
.container {
  background: #f4f3f4;
}
</style>