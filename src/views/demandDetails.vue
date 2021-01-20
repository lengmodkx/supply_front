<template>
    <div class="layout-right" id="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <span>需求详情</span>
                    <div class="line"></div>
                </div>
                <div class="details-content df">
                    <div class="thumb-example">
                        <!-- swiper1 -->
                        <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
                            <swiper-slide class="slide-1"></swiper-slide>
                            <swiper-slide class="slide-2"></swiper-slide>
                            <swiper-slide class="slide-3"></swiper-slide>
                            <swiper-slide class="slide-4"></swiper-slide>
                            <swiper-slide class="slide-5"></swiper-slide>
                        </swiper>
                        <!-- swiper2 Thumbs -->
                        <swiper class="swiper gallery-thumbs" :options="swiperOptionThumbs" ref="swiperThumbs">
                            <swiper-slide class="slide-1"></swiper-slide>
                            <swiper-slide class="slide-2"></swiper-slide>
                            <swiper-slide class="slide-3"></swiper-slide>
                            <swiper-slide class="slide-4"></swiper-slide>
                            <swiper-slide class="slide-5"></swiper-slide>
                        </swiper>
                    </div>
                    <div class="details-info">
                        <div class="titles">一图来看全面深化改革取得历史性伟大成就</div>
                        <div class="text-muted">出价：<span class="red">2000</span><span class="tips">元</span></div>
                        <div class="text-muted">发布人电话：<span class="tips">元</span></div>
                        <!-- <div class="text-muted">需求分类：<span class="tips">元</span></div> -->
                        <div class="text-muted">解决方式：<span class="tips">元</span></div>
                        <div class="text-muted">需求说明：<span
                                class="tips">国家主席习近平30日晚在北京同德国总理默克尔、法国总统马克龙、欧洲理事会主席米歇尔、欧盟委员会主席冯德莱恩举行视频会晤。中欧领导人共同宣布如期完成中欧投资协定谈判。
                                习近平指出，2020年对世界和中欧双方来说都是十分特殊的一年，新冠肺炎疫情全球大流行和世界百年未有之大变局深刻交织，不稳定不确定因素越来越多。在这样的背景下，中欧迎难而上，携手努力，推动中欧关系取得丰硕成果。双方如期实现年内完成中欧投资协定谈判的预期目标，达成了一份平衡、高水平、互利共赢的投资协定，展现了中方推进高水平对外开放的决心和信心，将为中欧相互投资提供更大的市场准入、更高水平的营商环境、更有力的制度保障、更光明的合作前景，也将有力拉动后疫情时期世界经济复苏，增强国际社会对经济全球化和自由贸易的信心，为构建开放型世界经济作出中欧两大市场的重要贡献。
                            </span></div>

                    </div>
                </div>

                <div class="title mt10">
                    <span>竞标企业</span>
                    <div class="line"></div>
                </div>
                <div class="compy-content df">
                    <div class="compy-item df" v-for="item in 6">
                        <img src="../assets/images/login-bg.jpg" alt="">
                        <div class="compy-info">
                            <div class="compy-name">壹仟零壹艺网络科技（北京）有限公司</div>
                            <div class="text-muted">主营业务：xxxxxx</div>
                            <div class="text-muted">报价：2000</div>
                            <div class="text-muted">联系电话：1870000000</div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper'
    import "swiper/dist/css/swiper.css";
    export default {
        components: {
            swiper,
            swiperSlide
        },
        name: '',
        data() {
            return {
                swiperOptionTop: {
                    loop: true,
                    loopedSlides: 5, // looped slides should be the same
                    spaceBetween: 10,
                },
                swiperOptionThumbs: {
                    loop: true,
                    loopedSlides: 5, // looped slides should be the same
                    spaceBetween: 10,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    touchRatio: 0.2,
                    slideToClickedSlide: true
                }
            }
        },
        mounted() {
            console.log(this.$refs.swiperTop)

            this.$nextTick(() => {
                console.log(this.$refs.swiperTop)
                const swiperTop = this.$refs.swiperTop.$swiper
                const swiperThumbs = this.$refs.swiperThumbs.$swiper
                swiperTop.controller.control = swiperThumbs
                swiperThumbs.controller.control = swiperTop
            })
        }
    }
</script>
<style lang="less" scoped>
    .container {
        width: 100%;
        color: #333333;
        font-size: 14px;
        min-height: 100%;
        background: #ffffff;

        .content {
            background: #ffffff;
            padding: 20px;

            .title {
                border-bottom: 1px solid #d5d5d5;
                padding: 0 0 15px 30px;

                position: relative;
                display: flex;
                justify-content: space-between;

                .line {
                    width: 56px;
                    height: 2px;
                    background: #2b85e4;
                    position: absolute;
                    bottom: 0;
                }

            }

            .details-content {
                margin-top: 20px;

                .details-info {
                    color: #666666;
                    flex: 1;

                    .titles {
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .text-muted {
                        font-weight: 600;
                        margin-top: 24px;

                        .red {
                            font-weight: 600;
                            color: #FF2020;
                            font-size: 16px;
                        }

                        .tips {
                            font-weight: 400;
                        }
                    }
                }
            }
        }
    }

    .thumb-example {
        width: 500px;
        height: 380px;
        margin-right: 36px;
    }

    .swiper {
        .slide-1 {
            background-image: url('../assets/images/login-bg.jpg');
        }

        .slide-2 {
            background-image: url('../assets/images/login-bg.jpg');
        }

        .slide-3 {
            background-image: url('../assets/images/login-bg.jpg');
        }

        .slide-4 {
            background-image: url('../assets/images/login-bg.jpg');
        }

        .slide-5 {
            background-image: url('../assets/images/login-bg.jpg');
        }

    }

    .gallery-top {
        height: 80%;
        width: 100%;
    }

    .gallery-thumbs {
        height: 20%;
        box-sizing: border-box;
        padding: 10px 0;
    }

    .gallery-thumbs .swiper-wrapper {
        width: 24%;
        height: 100%;
        opacity: 0.4;
    }

    .gallery-thumbs .swiper-slide-active {
        opacity: 1;
    }

    .mt10 {
        margin-top: 10px;
    }
    .compy-content {
        flex-wrap: wrap;
    }
    .compy-item {
        width: 33.33%;
            align-items: center;
        margin-top: 20px;
        img {
            width: 90px;
            height: 90px;
            margin-right: 20px;
        }

        .compy-info {
            .compy-name {
                font-size: 14px;
                font-weight: 600;
                color: #666666;
            }

            .text-muted {
                font-size: 12px;
                margin-top: 7px;
                font-weight: 600;
                color: #666666;
            }
        }
    }
</style>