<template>
    <div>
        <div class="modal-per-content" v-for="(permission,index) in permissions" :key="index">
            <div style="border-right: 1px solid #e9e9e9;">
                <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">{{permission.group}}</Checkbox>
            </div>
            <CheckboxGroup v-model="permission.resources" @on-change="checkAllGroupChange">
                <Checkbox v-for="(resource,index) in permission.resources" :label="resource" :key="index"></Checkbox>
            </CheckboxGroup>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                indeterminate: true,
                checkAll: false,
                checkAllGroup: ['香蕉', '西瓜'],
                permissions: [{ group: '任务', resources: ['创建任务', '移动任务', '移到回收站'] }]
            }
        },
        methods: {
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false
                } else {
                    this.checkAll = !this.checkAll
                }
                this.indeterminate = false

                if (this.checkAll) {
                    this.checkAllGroup = ['香蕉', '苹果', '西瓜']
                } else {
                    this.checkAllGroup = []
                }
            },
            checkAllGroupChange(data) {
                if (data.length === 3) {
                    this.indeterminate = false
                    this.checkAll = true
                } else if (data.length > 0) {
                    this.indeterminate = true
                    this.checkAll = false
                } else {
                    this.indeterminate = false
                    this.checkAll = false
                }
            }
        }
    }
</script>
<style>
    .modal-per-content {
        display: flex;
        border-bottom: 1px solid #e9e9e9;
    }
    .per-checkbox {
        width: 160px;
    }
</style>
