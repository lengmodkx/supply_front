<template>
    <div>
        <div class="modal-per-content" v-for="(permission,index) in pers" :key="index">
            <div class="checke-title">
                <Checkbox :disabled="disabled" :indeterminate="permission.indeterminate"
                          :value="permission.checkAll"
                          @click.prevent.native="handleCheckAll(permission)">{{permission.group}}</Checkbox>
            </div>
            <CheckboxGroup v-model="permission.checkAllGroup" @on-change="checkAllGroupChange(permission)">
                <Checkbox :disabled="disabled" class="mb15" v-for="(resource,index) in permission.resources" :label="resource.id" :key="index" ref="resource">{{resource.resourceName}}</Checkbox>
            </CheckboxGroup>
        </div>
        <div class="footer-btn">
            <Button type="primary" @click="savePower" >保存</Button>
        </div>
    </div>
</template>
<script>
    import {changePower,changeOrgPower} from '@/axios/api'
    export default {
        props: ['flag','permissions', 'role'],
        data() {
            return {
                disabled: this.role.roleKey==="administrator"||this.role.roleKey==="admin",
                pers: this.permissions.map(p=>{
                    if(p.checkAllGroup.length == p.resources.length){
                        p.indeterminate = false;
                        p.checkAll = true;
                    }else{
                        p.indeterminate = true;
                        p.checkAll = false;
                    }
                    return p;
                }),
                resources:[]
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
                
                console.log(permission.checkAll)
                
                if (permission.checkAll) {
                    permission.indeterminate = false;
                    permission.resources.forEach(p=>{
                        this.resources.push(p.id);
                    });
                    permission.checkAllGroup = this.resources
                } else {
                    permission.indeterminate = false;
                    permission.checkAllGroup = [],
                    this.resources=[]
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
                console.log(this.$refs.resource)
                this.$refs.resource.forEach(res=>{
                    if(res.currentValue){
                        resourcesArr.push(res.label)
                    }
                    
                })
                console.log(resourcesArr)

                if(this.flag){
                    changeOrgPower(this.role.roleId,resourcesArr.join(',')).then(res => {
                        if (res.result===1){
                            this.$emit('close')
                            this.$Message.success('设置成功');
                        }else{
                            this.$Message.error('设置失败');
                        }
                    })     
                }else{
                    changePower(this.role.roleId,resourcesArr.join(',')).then(res => {
                        if (res.result===1){
                            this.$emit('close')
                            this.$Message.success('设置成功');
                        }else{
                            this.$Message.error('设置失败');
                        }
                    })
                }
            }
        }
    }
</script>
<style>
.footer-btn{
    display: flex;
    justify-content: center;
    margin-top: 25px;
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

.checke-title{
    flex: none;
    width: 120px;
}
.mb15{
    margin-bottom: 15px;
}
</style>
