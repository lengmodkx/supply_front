<template>
    <!-- 文件 -->
    <div >
        <div class="inner file">
            <div class="file-head">
                <span class="now">我创建的</span><span>我参与的</span>
            </div>
            <div class="file-title">
                <!--没选文件时-->
                <div v-if="1" class="select-no">
                    <div class="file-title-left">
                        <div class="check-box"></div>
                        <div class="file-con">
                            <div class="file-name">名称</div>
                        </div>
                        <div class="file-size">大小</div>
                        <div class="file-time">更新时间</div>
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
                        <p>已选择3项</p>
                        <div><Icon type="ios-log-out" />移动</div>
                        <div><Icon type="md-copy" />复制</div>
                        <div> <Icon type="ios-archive-outline" />收藏</div>
                        <div><Icon type="ios-trash-outline" />删除</div>
                    </div>
                </div>
            </div>
            <div class="file-content">
                <!--列表模式-->
                <ul v-if="moShi==='liebiao'" class="liebiao">
                    <li>
                        <div class="check-box">
                            <Checkbox v-model="single" size="default"></Checkbox>
                        </div>
                        <div class="file-con">
                            <img src="" alt="">
                            <Tooltip class="file-name" content="Here is the prompt text">
                                名称名称名称
                            </Tooltip>
                        </div>
                        <div class="file-size">500kb</div>
                        <div class="file-time">2018-12-12</div>
                        <Icon type="ios-cloud-download-outline" />
                        <Icon type="ios-arrow-dropdown" />
                    </li>
                </ul>
                <!--图片模式-->
                <ul v-if="moShi==='tupian'" class="tupian">
                    <li>
                        <div class="file-img-box">
                            <div class="check-box">
                                <Checkbox v-model="single" size="default"></Checkbox>
                            </div>
                            <div class="xiazai"><Icon type="ios-cloud-download-outline" /></div>
                            <div class="gengduo"><Icon type="ios-arrow-dropdown" /></div>
                        </div>
                        <div class="file-name-box">
                            <Tooltip content="Here is the prompt text">
                                <input type="text" value="22222222">
                            </Tooltip>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
      return {
          moShi: 'liebiao',
          single:''
      }
    }
}
</script>

<style scoped lang="less">
@import "../Mine";
</style>