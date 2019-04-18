<template>
    <!-- 文件 -->
    <div >
        <div class="inner file">
            <div class="file-head">
                <span class="now">我创建的</span><span>我参与的</span>
            </div>
            <div class="file-title">
                <!--没选文件时-->
                <div v-if="checkedFile.length=='0'" class="select-no">
                    <div>
                        <div v-show="moShi=='liebiao'" class="file-title-left">
                            <div class="check-box"></div>
                            <div class="file-con">
                                <div class="file-name">名称</div>
                            </div>
                            <div class="file-size">大小</div>
                            <div class="file-time">更新时间</div>
                        </div>
                    </div>

                    <div class="file-title-right">
                        <Tooltip content="列表模式">
                            <Icon :class="{now:moShi=='liebiao'}" @click="moShi='liebiao'" type="ios-list-box-outline" />
                        </Tooltip>
                        <Tooltip content="缩略图模式">
                            <Icon :class="{now:moShi=='tupian'}" @click="moShi='tupian'" type="ios-keypad-outline" />
                        </Tooltip>

                    </div>
                </div>
                <!--选了文件-->
                <div v-else class="select-has">
                    <div class="select-has-left">
                        <p>已选择{{checkedFile.length}}项</p>
                        <div><Icon type="ios-log-out" />移动</div>
                        <div><Icon type="md-copy" />复制</div>
                        <div> <Icon type="ios-archive-outline" />收藏</div>
                        <div><Icon type="ios-trash-outline" />删除</div>
                    </div>
                </div>
            </div>
            <div class="file-content">
                <!--列表模式-->
                <CheckboxGroup v-model="checkedFile">
                    <ul v-if="moShi==='liebiao'" class="liebiao">
                        <li v-for="f in files">
                            <div class="check-box">
                                <Checkbox :label="f.fileId" size="default"><span> </span></Checkbox>
                            </div>
                            <div class="file-con">
                                <img v-if="f.ext==='.jpg' || f.ext==='.png' " :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${f.fileUrl}`" alt="">

                                <Tooltip class="file-name" content="Here is the prompt text">
                                    {{f.fileName}}
                                </Tooltip>
                            </div>
                            <div class="file-size">{{f.size}}</div>
                            <div class="file-time"><Time :time="f.updateTime" /></div>
                            <Icon type="ios-cloud-download-outline" />
                            <Icon type="ios-arrow-dropdown" @click="showFileMenu($event,'0')"></Icon>
                        </li>
                    </ul>
                </CheckboxGroup>

                <!--图片模式-->
                <CheckboxGroup v-model="checkedFile">
                    <ul v-if="moShi==='tupian'" class="tupian">
                        <li v-for="f in files" :class="{checked:checkedFile.includes(f.fileId)}">
                            <div class="file-img-box">
                                <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${f.fileUrl}`" alt="">
                                <div class="check-box">
                                    <Checkbox  :label="f.fileId" size="default"><span> </span></Checkbox>
                                </div>
                                <div class="xiazai"><Icon type="ios-cloud-download-outline" /></div>
                                <div class="gengduo"><Icon type="ios-arrow-dropdown" @click="showFileMenu($event,'110')"></Icon></div>
                            </div>
                            <div class="file-name-box">
                                <Tooltip content="Here is the prompt text">
                                    <input type="text" v-model="f.fileName">
                                </Tooltip>
                            </div>
                        </li>
                    </ul>
                </CheckboxGroup>

            </div>
        </div>
        <mineFileMenu @closeFileMenu="closeFileMenu" v-show="visible" class="mine-file-menu" :data="fileData" :style="{left:left,bottom:top}"></mineFileMenu>
    </div>
</template>

<script>
import mineFileMenu from './mineFileMenu'
import {getMeFile} from '@/axios/api'
export default {
    data () {
      return {
          moShi: 'liebiao',
          single:'',
          left:0,
          top:0,
          files:[],
          checkedFile:[],
          fileData:{
              privacyPattern:'',
              collect:''
          },
          visible:false
      }
    },
    components:{ mineFileMenu },
    methods: {
        showFileMenu(e,n){
            this.left=e.clientX-120+'px'
            this.top=e.clientY-n+'px'
            this.visible=true
        },
        closeFileMenu(){
            this.visible=false
        },
        getMeFile(){
            getMeFile().then(res => {
                if(res.result === 1){
                    this.files = res.data
                }
            })
        }
    },
    created(){
        this.getMeFile()
    }
}
</script>

<style scoped lang="less">
@import "../Mine";
    .mine-file-menu{
        position: fixed;
        z-index: 999;
        background-color: white;
    }
</style>