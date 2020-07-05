<template>
    <div>
       <div class="rule-head">
           <Button @click="$emit('cancelRule')" size="large">取消</Button>
           <Button @click="save" type="primary" size="large">保存</Button>
       </div>
        <div class="rule-con" style="padding: 20px 10px">
            <div class="rule-item">
                <div class="rule-title">规则名称</div>
                <Input v-model="ruleData.name" size="large"/>
            </div>
            <!--选择 列表、-->
            <div class="rule-item">
                <div class="rule-title">选择任务列表</div>
                <Select v-model="hasSelectList" size="large" @on-change="clickList" :label-in-value='true'>
                    <Option v-for="(item,index) in listList" :value="item.relationId" :key="item.relationId">{{item.relationName}}</Option>
                </Select>
            </div>
            <!--选择 条件、v-if="hasSelectList"  -->
            <div class="rule-item" >
                <div class="rule-title">选择条件</div>
                <Select v-model="conditionModel" size="large" @on-change="conditionChange" :label-in-value='true'>
                    <Option v-for="(item,index) in conditionList" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
            </div>
            <!-- v-if="conditionModel==3" -->
            <div class="rule-item" >
                <div class="rule-title">选择执行者</div>
                <Select v-model="executor" size="large" @on-change="selectConditionValue" :label-in-value='true'>
                    <Option v-for="(item,index) in projectPeople" :value="item.memberId" :key="item.memberId">{{item.memberName}}</Option>
                </Select>
            </div>
            <!-- v-if="executor!=''" -->
            <div class="rule-item" >
                <div class="rule-title">选择结果</div>
                <Select v-model="resultSelect" size="large"  :label-in-value='true'>
                    <Option :value="0">默认指派给</Option>
                    <Option :value="1">自动跳转到</Option>
                </Select>
            </div>
            <!-- v-if="resultSelect!=''"   -->
            <div class="rule-item" >
                <div class="rule-title">流转任务列表</div>
                <Select v-model="circulationTask" size="large" :label-in-value='true'>
                    <Option v-for="(item,index) in listList" :value="item.relationId" :key="item.relationId">{{item.relationName}}</Option>
                </Select>
            </div>
            <!--  v-if="resultSelect!=''"  -->
            <div class="rule-item">
                <div class="rule-title">修改任务状态</div>
                <Select v-model="taskStatus" size="large"  :label-in-value='true'>
                    <Option :value="0">未完成</Option>
                    <Option :value="1">已完成</Option>
                </Select>
            </div>
            <!--选择 列表、-->
            <!-- <Poptip v-model="selList" placement="bottom">
                <div >
                    <div v-if="hasSelectList" class="square" @click="getSelList">{{hasSelectList}}</div>
                    <Icon v-else class="jia" type="md-add" @click="getSelList" />
                </div>
                <div slot="title" class="model-title">
                    <i></i>
                    <h3>添加对象</h3>
                    <Icon @click="selList=false" type="md-close" />
                </div>
                <div slot="content">
                    <div style="height: 40px;line-height: 40px;color: #a6a6a6;padding: 0 16px">任务</div>
                    <div class="option-item" v-for="(item, index) in listList" :key="index" @click="clickList(item)">列表{{index+1}} {{item.relationName}}</div>
                </div>
            </Poptip> -->
            <!--选择 条件、-->
            <!-- <div class="rule-con" v-if="hasSelectList">
                <Icon type="md-arrow-down" class="jiantou" />
                <Poptip v-model="selCondition" placement="bottom">
                    <div >
                        <div v-if="showOptionName" class="square">{{showOptionName}}</div>
                        <div v-if="showOptionName&&showOptionVal" class="square" style="margin-top: 5px">{{showOptionVal}}</div>
                        <Icon v-if="!showOptionName" class="jia" type="md-add" />
                    </div>
                    <div slot="title" class="model-title">
                        <div>
                            <Icon @click="returnModal" v-if="option!=='添加条件'" type="ios-arrow-back" />
                        </div>
                        <h3>{{option}}</h3>
                        <Icon @click="selCondition=false" type="md-close" />
                    </div>
                    <div slot="content">
                        <div  v-show="option==='添加条件'">
                            <div class="option-item" @click="selOptionName('all','任何条件')">任何条件</div>
                            <div class="option-item" @click="selOptionName('completed','被完成')">被完成</div>
                            <div class="option-item" @click="selOptionName('redone','被重做')">被重做</div>
                            <div class="option-item" @click="option='更多条件'">更多条件</div>
                        </div>
                        <div v-show="option==='更多条件'">
                            <div @click="selOptionName2('设置执行人','settingExecutors')" class="option-item">设置执行人</div>
                            <div @click="selOptionName2('截止时间','endTime')" class="option-item">截止时间</div>
                            <div @click="selOptionName2('优先级','priority')" class="option-item">优先级</div>
                            <div @click="selOptionName2('重复','repeat')" class="option-item">重复</div>
                        </div>
                        <div v-show="option==='设置执行人'">
                            <div class="option-item zxr" v-for="(item, index) in projectPeople" @click="selectConditionValue(item.memberId,item.memberName)" :key="index">
                                <img :src="item.memberImg" alt="">
                                <span>{{item.memberName}}</span>
                            </div>
                        </div>
                        <div v-show="option==='截止时间'">
                            <div class="select-end-time">
                                <DatePicker @on-change="changeDate" type="date" placeholder="选择截止时间" style="width: 200px"></DatePicker>
                            </div>
                            <div class="select-end-time" @click="selectConditionValue(new Date(endTime).getTime(),endTime)"><Button type="info" long>确定</Button></div>
                        </div>
                        <div v-show="option==='优先级'">
                            <div class="option-item zxr" @click="selectConditionValue('ordinary','普通')">
                                <div class="circle" style="border: 1px solid #383838"></div>
                                <span>普通</span>
                            </div>
                            <div class="option-item zxr" @click="selectConditionValue('urgent','紧急')">
                                <div class="circle" style="border: 1px solid #ffaf38;"></div>
                                <span>紧急</span>
                            </div>
                            <div class="option-item zxr" @click="selectConditionValue('veryUrgent','非常紧急')">
                                <div class="circle" style="border: 1px solid #ff4f3e"></div>
                                <span>非常紧急</span>
                            </div>
                        </div>
                        <div v-show="option==='重复'">
                            <div class="option-item" @click="selectConditionValue('true','是')">是</div>
                            <div class="option-item" @click="selectConditionValue('false','否')">否</div>
                        </div>
                    </div>
                </Poptip>
            </div> -->
            <!--添加结果1-->
            <!-- <div class="rule-con" v-if="hasSelectOption">
                <Icon type="md-arrow-down" class="jiantou" />
                <Poptip v-model="addResult" @on-popper-hide="resultPopHid">
                    <div >
                        <div v-if="actionName" class="square">{{actionName}}</div>
                        <div v-if="actionName&&actionVal" class="square" style="margin-top: 5px">{{actionVal}}</div>
                        <Icon v-if="!actionName" class="jia" type="md-add" />
                    </div>
                    <div slot="title" class="model-title">
                        <div>
                            <Icon @click="resultType='添加结果'" v-if="resultType!=='添加结果'" type="ios-arrow-back" />
                        </div>
                        <h3>{{resultType}}</h3>
                        <Icon @click="addResult=false" type="md-close" />
                    </div>
                    <div slot="content">
                        <div v-show="resultType==='添加结果'">
                            <div @click="behavior('默认指派给')" class="option-item">默认指派给</div>
                            <div @click="behavior('自动跳转到')" class="option-item">自动跳转到</div>
                        </div>
                        <div v-show="resultType==='默认指派给'">
                            <div class="option-item zxr" v-for="(item, index) in projectPeople" @click="selectDefaultAssign(item.memberId,item.memberName)" :key="index">
                                <img :src="item.memberImg" alt="">
                                <span>{{item.memberName}}</span>
                            </div>
                        </div>
                        <div v-show="resultType==='自动跳转到'">
                            <div style="height: 40px;line-height: 40px;color: #a6a6a6;padding: 0 16px">任务</div>
                            <div class="option-item" v-for="(item, index) in listList" :key="index" @click="automaticJump(item.relationId,item.relationName)">列表{{index+1}} {{item.relationName}}</div>
                        </div>
                    </div>
                </Poptip>
            </div> -->
            <!--添加结果2-->
           <!-- <div class="rule-con" v-if="result2">
               <Icon type="md-arrow-down" class="jiantou" />
               <Poptip v-model="addResult2">
                   <div >
                       <div v-if="designate" class="square">默认值派给</div>
                       <div v-if="designate" class="square" style="margin-top: 5px">{{designate}}</div>
                       <Icon v-if="!designate" class="jia" type="md-add" />
                   </div>
                   <div slot="title" class="model-title">
                       <div>
                           <Icon @click="resultType='添加结果'" v-if="resultType!=='添加结果'" type="ios-arrow-back" />
                       </div>
                       <h3>{{resultType}}</h3>
                       <Icon @click="addResult2=false" type="md-close" />
                   </div>
                   <div slot="content">
                       <div v-show="resultType==='添加结果'">
                           <div @click="behavior('默认指派给','last')"  class="option-item">默认指派给</div>
                       </div>
                       <div v-show="resultType==='默认指派给'">
                           <div class="option-item zxr" v-for="(item, index) in projectPeople" @click="selectDefaultAssign(item.memberId,item.memberName,'last')" :key="index">
                               <img :src="item.memberImg" alt="">
                               <span>{{item.memberName}}</span>
                           </div>
                       </div>
                   </div>
               </Poptip>
           </div> -->
        </div>

    </div>
</template>

<script>
    import {enterTask,projectMembers} from '@/axios/api'
    import {saveRule} from  '@/axios/ruleApi'
    export default {
        name: "createRule",
        props: ['projectId','hasData'],
        data () {
            return {
                selList: false,
                selCondition: false,
                option: '添加条件',
                addResult: false,
                resultType: '添加结果',
                addResult2:false,
                hasSelectList: '',
                hasSelectOption: false,
                result2: false,
                listList: [],
                showOptionVal: '',
                showOptionName: '',
                projectPeople: [],
                endTime: '',
                designate: '',
                actionName: '',
                actionVal:'',
                ysObj: {
                    'repeat': '重复',
                    'completed': '被完成',
                    'redone': '被重做',
                    'settingExecutors': '设置执行者',
                    'endTime': '设置截止时间',
                    'priority': '设置优先级',
                    'all': '任何条件'
                },
                ysObj1: {
                    'ordinary': '普通',
                    'urgent': '紧急',
                    'veryUrgent': '非常紧急'
                },
                ruleData: {
                    'object': '',
                    'conditionName': '',
                    'conditionValue': '',
                    'defaultAssign': '',
                    'automaticJump': '',
                    'name': '自动化任务规则',
                    'projectId': this.projectId,
                    'id': ''
                },
                conditionList:[
                    {name:'增加任务、被移动',id:'0'},
                    {name:'被完成',id:'1'},
                    {name:'被重做',id:'2'},
                    {name:'设置执行人',id:'3'},
                ],
                conditionModel:'',
                executor:'',//执行者
                resultSelect:'', //结果
                circulationTask:'', //流转任务列表
                taskStatus:'', //修改任务状态
            }
        },
        mounted() {
            console.log(this.hasData)
            this.getSelList()
            if (this.hasData) {
               this.ruleData.id=this.hasData.id
                this.ruleData.name=this.hasData.name
                this.ruleData.object=this.hasData.object.relationId
                this.ruleData.conditionName=this.hasData.conditionName
                this.ruleData.conditionValue=this.hasData.conditionValue
                this.ruleData.defaultAssign=this.hasData.defaultAssign.userId
                this.hasSelectList=this.hasData.object.relationName
                this.showOptionName=this.ysObj[this.hasData.conditionName]
                this.showOptionVal=this.hasData.conditionValue
                if (this.showOptionName==='设置截止时间') {
                    this.showOptionVal=new Date(this.hasData.conditionValue*1).toLocaleDateString()
                }
                if (this.hasData.automaticJump) {
                    this.ruleData.automaticJump=this.hasData.automaticJump.relationId
                    this.hasSelectOption=true
                    this.actionName='默认跳转到'
                    this.actionVal=this.hasData.automaticJump.relationName
                    this.result2=true
                    this.designate=this.hasData.defaultAssign.userName
                }else {
                    this.hasSelectOption=true
                    this.actionName='默认指派给'
                    this.actionVal=this.hasData.defaultAssign.userName
                }
            }

        },
        methods: {
            returnModal () {
                if (this.option==='更多条件') {
                    this.option='添加条件'
                }else {
                    this.option='更多条件'
                }
            },
            // 获取列表数据
            getSelList() {
                enterTask(this.projectId).then(res => {
                    if (res.result) {
                        this.listList=res.menus
                    }
                })
            },
            // 选择列表
            clickList(item) {
                console.log(item)
                console.log(item.value)
                this.ruleData.object=item.value
                this.hasSelectList=item.label
                this.selList=false
                // 清空下面的值
                this.showOptionName=''
                this.hasSelectOption=false
                this.result2=false
                this.ruleData.conditionName=''
                this.ruleData.conditionValue=''
                this.ruleData.defaultAssign=''
                this.ruleData.automaticJump=''
            },
            // 选择 条件名称
            selOptionName(data,name) {
                this.ruleData.conditionName=data
                this.showOptionName=name
                if (data==='all'){
                    this.result2=true
                    this.hasSelectOption=false
                } else {
                    this.hasSelectOption=true
                    this.result2=false
                }
                this.selCondition=false
                // 清空下面的值
                this.ruleData.defaultAssign=''
                this.ruleData.automaticJump=''
                this.actionName=''
                this.designate=''
            },
            selOptionName2(option,conditionName) {
                this.showOptionName=option
                this.option=option
                this.ruleData.conditionName=conditionName
                if (option==='设置执行人') {
                    projectMembers(this.projectId).then(res => {
                        if (res.result) {
                            this.projectPeople=res.data
                        }
                    })
                }
            },
            // 选择条件 结果
            selectConditionValue(conditionValue,showOptionVal) {
                this.ruleData.conditionValue=conditionValue
                this.showOptionVal=showOptionVal
                this.option='添加条件'
                this.selCondition=false
                this.hasSelectOption=true
                // 清空下面的值
                this.ruleData.defaultAssign=''
                this.ruleData.automaticJump=''
                this.actionName=''
                this.designate=''
            },
            changeDate(value) {
                this.endTime=value
            },
            // 选择行为
            behavior(resultType,last) {
                if (last) {
                    console.log('选择行为')
                } else {
                    this.actionName=resultType
                }
                this.resultType=resultType
                if (resultType==='默认指派给') {
                    projectMembers(this.projectId).then(res => {
                        if (res.result) {
                            this.projectPeople=res.data
                        }
                    })
                }else if (resultType==='自动跳转到') {
                    this.getSelList()
                }
            },
            // 选择指派给谁
            selectDefaultAssign(id, name,last) {
                // result2
                if (last){
                    this.designate=name
                } else {
                    // result1
                    this.actionVal=name
                    this.ruleData.automaticJump=''
                    this.result2=false
                }
                this.ruleData.defaultAssign=id
                this.resultType='添加结果'
                this.addResult2=false
                this.addResult=false
                console.log(this.ruleData)
            },
            // 默认跳转到
            automaticJump(id,name) {
                this.ruleData.automaticJump=id
                this.actionVal=name
                this.addResult=false
                this.result2=true
                this.designate=''
                console.log(this.ruleData)
            },
            // 添加结果选择框关闭时 触发
            resultPopHid() {
                this.resultType='添加结果'
            },
            // 点击保存
            save() {
                saveRule(this.ruleData).then(res => {
                    console.log(this.ruleData)
                    if (res.result){
                        this.$Message.success('设置成功')
                        this.$emit('cancelRule')
                    }else {
                        this.$Message.error('系统异常，请稍后再试');
                    }
                })
            },
            conditionChange(){
                console.log(this.conditionModel)
            }
        }
    }
</script>

<style scoped lang="less">
.rule-head{
    width: 100%;
    height: 55px;
    display: flex;
    padding: 0 10px;
    align-items: center;
    .ivu-btn{
        margin-right: 10px;
        font-size:14px;
    }
    .ivu-btn-primary{
        background: #2CB7F5;
        border-color: #2CB7F5;
    }
}
.rule-con{
    width: 100%;
    /* display: flex; */
    /* flex-direction: column; */
    padding: 0 10px;
    align-items: center;
    .begin{
        height: 44px;
        width: 44px;
        line-height: 42px;
        border: 1px solid #d9d9d9;
        border-radius: 50%;
        text-align: center;
    }
    .jiantou{
        margin: 10px 0;
        font-size: 22px;
        color: #a6a6a6;
    }
    .jia{
        color: #3da8f5;
        font-size: 20px;
        height: 44px;
        width: 44px;
        border: 1px solid #3da8f5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .rule-item {
        margin-bottom: 15px;
        .rule-title {
            margin-bottom: 5px;
        }
    }
}
.model-title{
    width: 270px;
    height: 35px;
    text-align: center;
    position: relative;
    line-height: 35px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i{
        font-size: 18px;
        cursor: pointer;
        &:hover{
            color: #3da8f5;
        }
    }
}
.option-item{
    width: 100%;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    color: gray;
    padding: 0 16px;
    font-size: 14px;
    &:hover{
        background-color: #f7f7f7;
    }
}

.square{
    height: 40px;
    padding: 0 16px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    cursor: pointer;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    &:hover{
        color: #3da8f5;
    }
}
.zxr{
    display: flex;
    align-items: center;
    img{
        width: 24px;
        height: 24px;
        margin-right: 10px;
    }
    .circle{
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 10px;
    }
}
.select-end-time{
    width: 200px;
    margin: 20px auto;
}
</style>