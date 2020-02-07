<template>
    <div class="content-main">
        <header id="header">
            <div class="header-left">
                <Tooltip :content="isExtend?'点击收起导航':'点击展开导航'" placement="right">
                    <Icon @click="isExtend=!isExtend" class="icon-menu" type="md-menu" />
                </Tooltip>
                <img :src="userImg" alt="">
                <span>{{userName}}</span>
            </div>
            <!-- <img class="header-right" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+userImg" alt=""> -->
        </header>
        <div class="content">
            <transition name="slide-fade" >
                <div v-show="isExtend" class="left-nav">
                    <Menu :active-name="path" width="278px">
                        <MenuGroup title="基础">
                            <MenuItem name="/information" to="information">
                                <Icon type="md-print" size="16" />
                                企业信息
                            </MenuItem>
                            <MenuItem name="/company-jurisdiction" to="company-jurisdiction">
                                <Icon type="ios-ribbon-outline" size="16" />
                                企业权限
                            </MenuItem>
                            <MenuItem name="/project-jurisdiction" to="project-jurisdiction">
                                <Icon type="logo-buffer" size="16" />
                                项目权限
                            </MenuItem>
                        </MenuGroup>
                    </Menu>
                </div>
            </transition>
            <transition name="slide-fade">
                <div v-show="isExtend" class="left-zhanwei"></div>
            </transition>
            <div class="right-con">
                <router-view></router-view>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    data: function () {
        return {
            isExtend: true,
            userImg:localStorage.userImg,
            userName:localStorage.userName
        }
    },
    mounted() {
        console.log('>>>>',this.path)
    },
    computed:{
        path(){
            var url = this.$route.path;
            var index = url.lastIndexOf("\/");
            var str = url.substring(index,url.length);
            return str;
        }
    }
}
</script>
<style socped lang="less">
    @import "../assets/common";
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(-100px);
    }
</style>