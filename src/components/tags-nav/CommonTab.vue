<template>
    <div class="tabs" :class="header?'left-big':'left-small'">
        <!--closable这里说明home是不能关闭的-->
        <Tag type="dot" :key="tag.name" v-for="(tag, index) in tags" :closable="tag.name !== 'organization'"
            @on-close="handleClose(tag, index)" @click.native="changeMenu(tag)"
            :color="$route.name === tag.name ? 'primary' : 'default'">
            {{ tag.label }}
        </Tag>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from "vuex";
    import {
        setTagNavListInLocalstorage,
        getTagNavListFromLocalstorage,
    } from "@/utils/util";
    export default {
        computed: {
            ...mapState("app", ["header"]),

            ...mapState({
                tags: (state) => state.tab.tabsList,
            }),
        },
        methods: {
            ...mapMutations("tab", {
                close: "closeTab",
            }),
            //关闭标签
            handleClose(tag, index) {
                let length = this.tags.length - 1;
                //vuex调方法的另一种写法
                this.close(tag);
                // 如果关闭的标签不是当前路由的话，就不跳转
                if (tag.name !== this.$route.name) {
                    return;
                }
                // 关闭的标签是最右边的话，往左边跳转一个
                if (index === length) {
                    if (this.tags[index - 1].name == "organization") {
                        this.$router.push('/org/' + localStorage.companyId);
                    } else if (this.tags[index - 1].name == "prolist") {
                        this.$router.push('/prolist/' + localStorage.companyId);
                    } else {
                        this.$router.push({
                            name: this.tags[index - 1].name,
                        });
                    }
                } else {
                    // 否则往右边跳转
                    this.$router.push({
                        name: this.tags[index].name,
                    });
                }
            },

            //选择标签跳转路由
            changeMenu(item) {
                if (item.name == "organization") {
                    this.$router.push('/org/' + localStorage.companyId);
                } else if (item.name == "prolist") {
                    this.$router.push('/prolist/' + localStorage.companyId);
                } else {
                    this.$router.push({
                        name: item.name,
                    });
                }

                this.$store.commit("tab/selectMenu", item);
            },
        },
        mounted() {
            if (getTagNavListFromLocalstorage().length != 0) {
                this.$store.commit("tab/setLocalTag", getTagNavListFromLocalstorage());
            }
        },
        watch: {
            $route(newRoute) {
                const {
                    name,
                    query,
                    params,
                    meta
                } = newRoute;
            },
        },
    };
</script>

<style lang="less" scoped>
    .tabs {
        padding: 3px 20px;
        position: fixed;
        top: 48px;
        width: 100%;
        z-index: 100;
        background: #ffffff;
        padding-right: 80px;
        overflow-y: hidden;
        overflow-x: auto;
        white-space: nowrap;
        transition: all 0.3s;

        .ivu-tag {
            cursor: pointer;
        }
    }

    .left-big {
        left: 210px;
    }

    .left-small {
        left: 60px;
    }

    ::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #cecece;
    }
</style>