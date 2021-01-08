<template>
    <div class="layouts-left">
        <Menu :class="header ? 'big' : 'small'" class="big-Menu" :active-name="menuActive" :theme="isSubMenuTheme()"
            v-if="header" width="210px" @on-select="goto">
            <template v-for="(item, index) in MenuList">
                <template v-if="item.childNode">
                    <Submenu :key="index" :name="item.name">
                        <template slot="title">
                            <i>
                                <svg-icon :name="item.icon" class="svgIcon"></svg-icon>
                            </i>
                            <span>{{ item.oneName }}</span>
                        </template>

                        <template v-for="(value, i) in item.childNode">
                            <menu-item :name="value.name" :key="i">
                                <span>{{ value.text }}</span>
                            </menu-item>
                        </template>
                    </Submenu>
                </template>
                <template v-else>
                    <MenuItem :key="index" :name="item.name">
                    <i>
                        <svg-icon :name="item.icon" class="svgIcon"></svg-icon>
                    </i>
                    <span>{{ item.oneName }}</span>
                    </MenuItem>
                </template>
            </template>
        </Menu>
        <Menu width="80px" v-else class="small-Menu" :theme="isSubMenuTheme()" @on-select="goto">
            <div>
                <template v-for="(item, index) in MenuList">
                    <template v-if="item.childNode">
                        <Dropdown :key="index" placement="right-start" class="menu-dropdown" transfer>
                            <MenuItem :name="item.name">
                            <!-- <i> -->
                            <svg-icon :name="item.icon" class="svgIcon"></svg-icon>
                            <!-- </i> -->
                            </MenuItem>
                            <DropdownMenu slot="list" class="drop">
                                <DropdownItem v-for="(children, index) in item.childNode" :key="index">
                                    <MenuItem :name="children.name">{{ children.text }}</MenuItem>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                    <template v-else>
                        <Dropdown :key="index" placement="right-start" class="menu-dropdown">
                            <MenuItem :name="item.name" :key="index">
                            <Tooltip placement="right" :content="item.oneName" transfer>
                                <i>
                                    <svg-icon :name="item.icon" class="svgIcon"></svg-icon>
                                </i>
                            </Tooltip>
                            </MenuItem>
                        </Dropdown>
                    </template>
                </template>
            </div>
        </Menu>
    </div>
</template>

<script>
    import {
        mapActions,
        mapState,
        mapMutations
    } from "vuex";
    import {
        checkPermission,
        userIsOwner
    } from "@/axios/api.js";
    export default {
        name: "",
        data() {
            return {
                menuActive: "1", //菜单栏选中项
                MenuList: [{
                        oneName: "首页",
                        name: "1",
                        icon: "xiazai44",
                    },
                    {
                        oneName: "项目",
                        name: "2",
                        icon: "xiangmu1",
                        childNode: [{
                                text: "全部项目",
                                name: "2,0",
                            },
                            {
                                text: "我创建的",
                                name: "2,1",
                            },
                            {
                                text: "我参与的",
                                name: "2,2",
                            },
                            {
                                text: "我的收藏",
                                name: "2,3",
                            },
                            {
                                text: "已归档",
                                name: "2,4",
                            },
                            {
                                text: "回收站",
                                name: "2,5",
                            },
                        ],
                    },
                    {
                        oneName: "网盘",
                        name: "3",
                        icon: "wangpanjihuo",
                    },
                    {
                        oneName: "设计",
                        name: "4",
                        icon: "sheji",
                    },
                    {
                        oneName: "人脉",
                        name: "6",
                        icon: "gerencanshu",
                    },
                    {
                        oneName: "团队",
                        name: "7",
                        icon: "tuanduiguanli",
                    },
                    {
                        oneName: "设置",
                        name: "8",
                        icon: "shezhi1",
                        childNode: [{
                                text: "基础信息",
                                name: "8,0"
                            },
                            {
                                text: "成员",
                                name: "8,1"
                            },
                            {
                                text: "组织架构",
                                name: "8,2"
                            },
                            {
                                text: "企业权限",
                                name: "8,3"
                            },
                            {
                                text: "项目权限",
                                name: "8,4"
                            }, {
                                text: "操作日志",
                                name: "8,5"
                            },
                            {
                                text: "导出申请",
                                name: "8,6"
                            }
                        ]
                    },
                    {
                        oneName: "我的",
                        name: "10",
                        icon: "content",
                    },
                    {
                        oneName: "内容管理",
                        name: "11",
                        icon: "content",
                        childNode:[
                            {
                                text: "发布",
                                name: "12"
                            },
                            {
                                text: "内容管理",
                                name: "13"
                            },
                            {
                                text: "评价管理",
                                name: "14"
                            },
                        ]
                    },
                ],
            };
        },
        computed: {
            ...mapState("app", ["header"]),
        },
        methods: {
            // 主题暗色与亮色
            isSubMenuTheme() {
                let {
                    subMenuTheme
                } = this.$store.state.drawer.layoutConfig;
                return subMenuTheme;
            },
            goto(tagName) {
                let name = tagName.split(",")[0]
                if (name == 1) {
                    this.$router.push("/org/" + localStorage.companyId);
                } else if (name == 2) {
                    this.$router.push({
                        path: "/prolist/" + localStorage.companyId,
                        query: {
                            'checkTagName': tagName,
                        }
                    });
                    // this.$router.push("/prolist/" + localStorage.companyId);
                } else if (name == 3) {
                    this.$router.push("/material");
                } else if (name == 4) {
                    if (runPlatform == "browse") {
                        this.$Message.error("设计系统必须在阿拉丁BIM云平台客户端打开");
                    } else {
                        ALDObj.RunALDCAD();
                    }
                } else if (name == 6) {
                    //人脉
                } else if (name == 7) {
                    checkPermission(localStorage.companyId).then((res) => {
                        if (res.result == 1 && res.data == true) {
                            this.$router.push("/members");
                        } else {
                            this.$Message.error("没有权限");
                        }
                    });
                } else if (name == 8) {
                    userIsOwner(localStorage.companyId).then((res) => {
                        if (res.msg == 1) {
                            this.$router.push({
                                path: "/systemSettings",
                                query: {
                                    'checkTagName': tagName,
                                }
                            });
                            localStorage.organizationName = res.data.organizationName;
                        } else {
                            this.$Message.error("没有权限");
                        }
                    });
                } else if (name == 9) {
                    this.$router.push("/postArticles");
                } else if (name == 10) {}
                else if (name == 12) {
                    this.$router.push("/postArticles");
                }else if (name == 13) {
                    this.$router.push("/contentMan");
                }
            },
        },
    };
</script>

<style lang="less">
    @import "../../assets/css/menu.less";
</style>