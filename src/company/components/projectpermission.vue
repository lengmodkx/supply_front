<template>
    <div>
        <div class="modal-per-content" v-for="(permission,index) in permissions" :key="index">
            <div class="checke-title">
                <Checkbox :indeterminate="permission.indeterminate" :value="permission.checkAll" @click.prevent.native="handleCheckAll(permission)">{{permission.group}}</Checkbox>
            </div>
            <CheckboxGroup v-model="permission.checkAllGroup" @on-change="checkAllGroupChange(permission)">
                <Checkbox class="mb15" v-for="(resource,index) in permission.resources" :label="resource.resourceName" :key="index"></Checkbox>
            </CheckboxGroup>
        </div>
        <div class="footer-btn">
            <Button type="primary" size="large" @click="savePower">保存</Button>
        </div>
    </div>
</template>
<script>
    import {changePower} from '../axios/backendManagementApi'
    export default {
        props: ['permissions', 'role'],
        data() {
            return {
            }
        },
        methods: {
            handleCheckAll(permission) {
                if (permission.indeterminate) {
                    permission.checkAll = false
                } else {
                    permission.checkAll = !permission.checkAll
                }
                permission.indeterminate = false

                if (permission.checkAll) {
                    permission.checkAllGroup = permission.resources
                } else {
                    permission.checkAllGroup = []
                }
            },
            checkAllGroupChange(permission) {
                if (permission.checkAllGroup.length === permission.resources.length) {
                    permission.indeterminate = false
                    permission.checkAll = true
                } else if (permission.checkAllGroup.length > 0) {
                    permission.indeterminate = true
                    permission.checkAll = false
                } else {
                    permission.indeterminate = false
                    permission.checkAll = false
                }
            },
            // 保存 按钮
            savePower () {
                let resourcesArr=[]
                this.permissions.forEach(v => {
                    resourcesArr=resourcesArr.concat(v.checkAllGroup)
                })
                let idArr=[]
                resourcesArr.forEach((i,n) => {
                    this.permissions.forEach((ii,nn) => {
                        ii.resources.forEach((iii,nnn) => {
                            if (iii.resourceName===i){
                                idArr.push(iii.id)
                            }
                        })
                    })
                })
                changePower(this.role,idArr.join(',')).then(res => {
                    if (res.result){
                        this.$emit('close')
                        this.$Message.success('设置成功');
                    }
                })
            }
        }
    }
</script>
<style>
    .footer-btn{
        margin: 10px 0;
        display: flex;
        padding: 0 20px 20px;
        flex-direction: row-reverse;
    }
    .modal-per-content {
        display: flex;
        border-bottom: 1px solid #e9e9e9;
        margin-top: 15px;
        padding: 0 16px;
    }
    .modal-per-content:nth-last-child(1){
        border-bottom: 0 none;
    }
    .per-checkbox {
        width: 160px;
    }
    .checke-title{
        flex: none;
        margin-right: 10px;
    }
    .mb15{
        margin-bottom: 15px;
    }
</style>
