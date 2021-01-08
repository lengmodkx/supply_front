<template>
<div class="layout-right">
    <div class="container">
        <div class="content">
            <div class="title">
                <div class="conetent-tit">正文</div>
            </div>
            <div class="article-content">
                <div class="article-tit">{{infoList.acId==1?infoList.articleTitle:infoList.acId==2?'微头条':infoList.videoName}}</div>
                <div class="article-info df ac">
                        <img :src="infoList.acId==1?iconList.videoIcon:infoList.acId==2?iconList.ttIcon:iconList.textIcon"
                            class="createImg">
                        <span class="createText">{{infoList.acId==1?'文章':infoList.acId==2?'微头条':'视频'}}</span>
                        <img :src="infoList.memberImage" alt="" class="createImg b50">
                        <span class="createText">{{infoList.userName}}</span>
                    <div>{{infoList.createTime}}</div>
                </div>
                <div class="article-text" v-if="infoList.acId==1">
                        <div v-html="infoList.articleContent"></div>
                </div>
                <div class="article-text" v-if="infoList.acId==2">
                    <div class="article-text-content">{{infoList.headlineContent}}</div>
                    <div v-for="item in infoList.headlineImages.split(',')">
                        <img :src="item" alt="">
                    </div>
                </div>
                <div class="article-text" v-if="infoList.acId==3">
                    <div v-for="item in infoList.videoAddress.split(',')">
                        <video :src="item" controls="controls" style="height:500px;display: block;margin:auto;">您的浏览器不支持 video 标签。</video>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        data() {
            return {
                iconList: {
                    videoIcon: require('../assets/images/articles/video.png'),
                    ttIcon: require('../assets/images/articles/tt.png'),
                    textIcon: require('../assets/images/articles/text.png'),
                },
                infoList: {}
            }
        },
        mounted() {
            this.infoList = this.$route.params.articleInfoList

        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/css/commonRight.less";
    .container {
        height: 100%;
        .content {
            min-height: 100%;
        }
    }
    .article-content {
        padding: 30px 20px;
        color: #666666;

        .article-tit {
            text-align: center;
            margin-bottom: 28px;
            font-size: 18px;
        }

        .article-info {
            justify-content:center;
            color: #808080;
            padding-bottom: 26px;
            border-bottom: 1px solid #d5d5d5;
            .createImg {
                width: 16px;
                height: 16px;
            }

            .b50 {
                border-radius: 50%;
            }

            .createText {
                margin: 0 15px 0 10px;
            }
        }
        .article-text {
            padding:30px 180px ;
            .article-text-content {
                text-align: center;
                margin-bottom: 30px;
            }
            img {
                display: block;
                margin: auto;
                height: 300px;
                margin-bottom: 20px;
            }
        }
    }
</style>