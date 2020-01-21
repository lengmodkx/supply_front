<template>
  <div class="file-header">
      <div class="left">
            <button  class="move"  @click="move"></button>
            <button  class="back"   ></button>
      </div>
      <div class="middle">
           <span><img src="../../../assets/images/03.png" alt=""  @click="home"></span>
              <ul class="crumbs">
                <li v-for="(item,index) in crumbs" :key='index'>  
                   <img :src="item.src" alt="" >               
                  {{item.name}}
                  <a > </a>
                </li>
              </ul>
           <!-- <span><img src="../../../assets/images/04.png" alt=""></span> -->
           <span><img src="../../../assets/images/05.png" alt=""></span>
      </div>
      <div class="right">
           <Input search enter-button   v-model="searched"  @on-search="search" />
      </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  components: {},
  data () {
    return {
      movehover:false,
      crumbs:[
        {name:'文件',src:require('../../../assets/images/tree1.png')},
        {name:'md文件',src:require('../../../assets/images/tree2.png')}
      ],
      searched: "",
       projectId: this.$route.params.id,
       fileId: this.$route.params.fileId,
    }
  },
  methods: {
       ...mapActions("file", ["initFile", "initFolders", "searchFile", "initTag"]),
        move(){
            this.movehover=!this.movehover;
        },
         // 搜索文件
          search(value) {
            if (value !== "") {
              var data = { fileName: value, projectId: this.projectId };
                this.searchFile(data).then(res => {
                  this.loading = false;
                });
            } else {
              let params = { fileId: this.fileId };
              this.initFile(params).then(res => {
          
              });
            }
          },
          //回到首页
          home(){
              this.initFile(this.fileId).then(res => {
              });
          }
  },
}

</script>
<style lang="less">
.file-header{
      width: 100vm;
      height: 52px;
      padding:10px;
      background-image: linear-gradient(#fff, #f3f3f3);
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      .left{
            width: 65px;
            button{
                width: 32px;
                height: 32px;
                border: 1px solid #dddddd;
            }
             button:hover{
                 box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
            }
            .move{
                background:#fff url('~@/assets/images/01.png') no-repeat center ;
                background-size:10px;
            }
            .back{
                background:#fff url('~@/assets/images/02.png') no-repeat center ;
                background-size:10px;
                border-left: none;
            }
            .button-disable{            
                box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
            }
      }
      .middle{
              flex: 1;
              margin:0px 100px  0px 30px;
              border:1px solid #ddd;
              display: flex;
              line-height: 32px;
              span{
                display: block;
                background: #fafafa;
                width: 35px;
                height:28px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #dddddd;
                cursor: pointer;
              }
              span:hover{
                background: #e4f8ff;
              }
              span:first-child{
                border-left: none;
                border-right: 1px solid #dddddd;
              }
              .crumbs{
                flex: 1;
                display: flex;
                li{
                  display: flex;
                  align-items:center ;
                   background: #f2f2f2;
                   cursor: pointer;
                  img{
                    padding: 10px;
                  }
                }
                a{
                  display: block;
                  width: 14px;
                  height: 28px;
                  background: url('~@/assets/images/06.png') no-repeat center ;
                }
                li:last-child a{
                   background: url('~@/assets/images/07.png') no-repeat center ;
                }
              }
      }
      .right{
              float: right;
              width:200px;
              margin-right: 10px;            
      } 
}
</style>