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
                    if (this.tags[index - 1].name) {
                        let name = this.tags[index - 1].name
                    }
                    if (name == "organization") {
                        this.$router.push('/org/' + localStorage.companyId);
                    } else if (name == "prolist") {
                        this.$router.push({
                            path: "/prolist/" + localStorage.companyId,
                            query: {
                                'checkTagName': '2,0',
                            }
                        });
                    } else if (name == "systemSettings") {
                        this.$router.push({
                            path: "/systemSettings/",
                            query: {
                                'checkTagName': '8,5',
                            }
                        });
                    } else if (name == 'nearThing' || name == 'task' || name == 'schedule' || name == 'file' || name ==
                        'collect') {
                        //我的页面
                        this.$router.push({
                            path: "/mine/" + name,
                            query: {
                                'checkTagName': name,
                            }
                        });
                    } else {
                        this.$router.push({
                            name: name
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
                    this.$router.push({
                        path: "/prolist/" + localStorage.companyId,
                        query: {
                            'checkTagName': '2,0',
                        }
                    });
                } else if (item.name == 'nearThing' || item.name == 'task' || item.name == 'schedule' || item.name ==
                    'file' || item.name == 'collect') {
                    //我的页面
                    this.$router.push({
                        path: "/mine/" + item.name,
                        query: {
                            'checkTagName': item.name,
                        }
                    });
                } else if (item.name == "systemSettings") {
                    this.$router.push({
                        path: item.name,
                        query: {
                            'checkTagName': '8,5',
                        }
                    });
                } else {
                    this.$router.push({
                        name: item.name,
                    });
                }

                // this.$store.commit("tab/selectMenu", item);
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
        z-index: 99;
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