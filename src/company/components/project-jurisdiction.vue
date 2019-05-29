<template>
    <div class="project-permission-content">

        <header class="ppc-header">
            <span class="ppc-header-title"> 项目权限</span>
        </header>
        <div class="pcc-operate">
            <Button type="primary" icon="md-add" @click="addRole">新增</Button>
            <Button type="warning" icon="ios-create-outline" @click="editRole">编辑</Button>
            <Button type="error" icon="ios-trash-outline" @click="romoveRole">删除</Button>
            <Button type="success" icon="ios-filing-outline" @click="permissionAssign=true">分配权限</Button>
            <!--<Button type="success" icon="ios-plus-outline" @click="resourceAdd">添加资源</Button>-->
        </div>
        <div class="pcc-role-table">
            11133
        </div>
        <Modal v-model="roleAdd" :title="modelTitle" transfer footer-hide>
            <div class="add-role">
                <Input v-model="roleName" class="add-role-input" placeholder="超级管理员">
                    <span slot="prepend">角色名称</span>
                </Input>
                <Input v-model="roleKey" class="add-role-input" placeholder="administrator">
                    <span slot="prepend">角色标识</span>
                </Input>
                <Input v-model="roleDes" class="add-role-input" placeholder="超级管理员">
                    <span slot="prepend">角色描述</span>
                </Input>
                <div class="model-op">
                    <Button type="primary" @click="commitRole" class="op-btn">确定</Button>
                    <Button type="default" @click="roleAdd = false" class="op-btn">取消</Button>
                </div>
            </div>
        </Modal>
        <Modal v-model="permissionAssign" title="项目权限分配" width="850px" class="padd0">
            <project-permission ref="permission" @close="permissionAssign=false"></project-permission>
        </Modal>
    </div>
</template>
<script>
    import projectPermission from './projectpermission.vue'
    export default {
        components: {
            projectPermission
        },

        methods: {
            // resourceAdd() {
            //     this.permissionAdd = true
            //     getResource().then(res => {
            //         this.resources = res.data
            //         console.log(res)
            //     })
            // },
            commitResource() {
                var param = {
                    resourceType: this.resourceType,
                    parentId: this.resourceId,
                    resourceName: this.resourceName,
                    resourceKey: this.resourceKey,
                    resourceUrl: this.resourceUrl,
                    resourceDes: this.resourceDes
                }
                console.log(param.parentId)
                addResource(param).then(res => {
                    if (res.result == 1) {
                        this.permissionAdd = false
                    }
                })
            },
            // 新增角色
            addRole() {
                this.roleAdd = true
                this.modelTitle = '新增角色'
                this.roleName = ''
                this.roleKey = ''
                this.roleDes = ''
            },
            // 编辑角色
            editRole() {
                if (this.tableRow.length == 0) {
                    this.$Notice.warning({
                        title: '请选择一个角色进行编辑'
                    })
                } else if (this.tableRow.length == 1) {
                    this.roleAdd = true
                    this.modelTitle = '编辑角色'
                    this.roleName = this.tableRow[0].roleName
                    this.roleKey = this.tableRow[0].roleKey
                    this.roleDes = this.tableRow[0].roleDes
                } else {
                    this.$Notice.warning({
                        title: '同时只能编辑一个角色'
                    })
                }
            },
            // 移除角色
            romoveRole() {
                if (this.tableRow.length == 0) {
                    this.$Notice.warning({
                        title: '请选择角色进行删除'
                    })
                } else {
                    for (var i = 0; i < this.tableRow.length; i++) {
                        for (var j = 0; j < this.roles.length; j++) {
                            if (this.roles[j].roleKey == this.tableRow[i].roleKey) {
                                this.roles.splice(j, 1)
                            }
                        }
                    }
                }
            },
            changePage() {},
            commitRole() {
                if (this.roleName == '' || this.roleName == null) {
                    this.$Notice.warning({
                        title: '请输入角色名称'
                    })
                    return false
                }
                if (this.roleKey == '' || this.roleKey == null) {
                    this.$Notice.warning({
                        title: '请输入角色标识'
                    })
                    return false
                }
                if (this.roleDes == '' || this.roleDes == null) {
                    this.$Notice.warning({
                        title: '请输入角色描述'
                    })
                    return false
                }
            }
        },
        data() {
            return {
                resourceType: '',
                resourceId: 0,
                resourceName: '',
                resourceKey: '',
                resourceUrl: '',
                resourceDes: '',
                resources: [],
                types: [{ value: 1, label: '菜单' }, { value: 2, label: '按钮' }],
                roleAdd: false,
                permissionAssign: false,
                permissionAdd: false,
                roleName: '',
                roleKey: '',
                roleDes: '',
                modelTitle: '新增角色',
                tableRow: [],
            }
        }
    }
</script>

<style lang="less">
    .project-permission-content {
        height: calc(100vh - 88px);
        background: #fff;
        border-radius: 4px;
        .pcc-operate {
            margin: 20px 20px;
            button{
                margin-right: 15px;
            }
        }
        .pcc-role-table {
            margin-left: 20px;
            margin-right: 20px;
        }
        .ppc-header {
            display: flex;
            justify-content: space-between;
            height: 60px;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
            border-bottom: 1px solid #e5e5e5;
            .ppc-header-add-role {
                display: flex;
                align-items: center;
            }
            .add-role-title {
                font-size: 16px;
            }
            .ppc-header-title {
                font-size: 18px;
            }
        }
    }
    .add-role {
        padding: 20px 20px;
        height: 230px;
        .add-role-input {
            margin-bottom: 20px;
        }
    }
    .model-op {
        border-top: 1px solid #e5e5e5;
        .op-btn {
            float: right;
            margin-right: 10px;
            margin-top: 6px;
        }
    }
    .add-resource {
        padding: 20px 20px;
        height: 380px;
        .add-role-input {
            margin-bottom: 20px;
        }
    }
    .padd0{
        /deep/ .ivu-modal-body{
            padding: 0;
        }
    }
</style>
