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
                        <swiper class="swiper" :options="swiperOption">
                            <swiper-slide v-if="demandInfo.demandFiles==null">
                                <img src='../assets/images/articles/wutu.png' class="wutu">
                            </swiper-slide>
                            <swiper-slide v-for="(item,index) in demandInfo.demandFiles.split(',')" :key="index" v-else>
                                <img :src='item' alt="">
                            </swiper-slide>
                            <div class="swiper-pagination" slot="pagination"></div>
                            <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                            <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                        </swiper>
                    </div>
                    <div class="details-info">
                        <div class="df jsb ac">
                            <div class="titles">{{demandInfo.demandName}}</div>
                            <Button type="primary" @click="goBid" v-if="demandInfo.memberId !=userId">竞标</Button>
                        </div>
                        <div class="text-muted">出价：<span class="red">{{demandInfo.bid}}</span><span
                                class="tips">元</span></div>
                        <div class="text-muted">需求说明：<span class="tips">{{demandInfo.demandDetails}}</span></div>

                    </div>
                </div>

                <div class="title mt30">
                    <span>竞标人</span>
                    <div class="line"></div>
                </div>
                <div class="compy-content df jsb">
                    <div class='loading-content' v-if="loading">
                        <Loading></Loading>
                    </div>
                    <div class="compy-item df" v-for="item in bidingList">
                        <img :src="item.organizationImage" alt="">
                        <div class="compy-info">
                            <div class="compy-name">{{item.organizationName}}</div>
                            <div class="text-muted serveInfo">服务详情：{{item.details?item.details:'无'}}</div>
                            <div class="text-muted">报价：{{item.bid}}</div>
                            <div class="df ac jsb">
                                <div class="text-muted">联系电话：{{item.organizationPhone}}</div>
                                <Button type="primary" size="small">达成合作</Button>
                            </div>
                        </div>
                    </div>
                    <div class="tips" v-if="bidingList==null&&demandInfo.memberId !=userId">暂无法查看其它竞标人</div>
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
    import Loading from "../components/public/common/Loading.vue";

    import {
        demandInfos
    } from '@/axios/api'
    export default {
        components: {
            swiper,
            swiperSlide,
            Loading
        },
        name: '',
        data() {
            return {
                userId: localStorage.userId, //需求发起人的id
                swiperOption: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                },
                demandInfo: {},
                bidingList: [],
                loading: false,
                wutu: require('../assets/images/articles/wutu.png')
            }
        },
        created() {
            this.loading = true
            this.demandInfo = JSON.parse(localStorage.getItem("demandInfoList"));
            this.getBidding()
        },
        methods: {
            goBid() {
                this.$router.push({
                    path: '/bidding',
                    query: {
                        'demandId': this.demandInfo.demandId
                    }
                })
            },
            getBidding() {
                demandInfos({
                    demandId: this.demandInfo.demandId
                }).then(response => {
                    this.bidingList = response.data.bidList
                    this.loading = false

                })
            }
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
        width: 550px;
        height: 330px;
        margin-right: 36px;

        .swiper {
            height: 100%;
            width: 100%;

            .swiper-slide {
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-weight: bold;
                background-color: #dcdcdc;

                img {
                    width: 100%;
                    height: 100%;
                }

                .wutu {
                    width: 110px;
                    height: 120px;
                }
            }
        }
    }





    .mt30 {
        margin-top: 30px;
    }

    .compy-content {
        flex-wrap: wrap;

        .loading-content {
            width: 100%;
            margin-top: 30px;
        }
    }

    .compy-item {
        width: 32%;
        align-items: center;
        margin-top: 20px;

        img {
            width: 90px;
            height: 90px;
            margin-right: 20px;
        }

        .compy-info {
            flex: 1;
            overflow: hidden;

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

            .serveInfo {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .tips {
        font-size: 14px;
        margin-top: 30px;
        color: #666666;
        text-align: center;
        width: 100%;
    }
</style>