<template>
    <div class="go-right">
        <div style="width: 100%"  v-for="(item, n) in branchData" :key="item.partmentId">
            <div :class="{checked:branchId==item.partmentId}" class="yiji-bumen" @click="sendPeople(item, n)">
                {{item.partmentName}}
                <div v-if="item.isExistSubPartment">
                    <Icon @click.stop="showSon(item, n)" v-if="item.isdown" type="ios-arrow-dropdown" size="20" />
                    <Icon v-else @click.stop="closeSon(item, n)" type="ios-arrow-dropup" size="20" />
                </div>
            </div>
            <div style="width: 100%" v-if="item.isExistSubPartment">
                <branch ref="branch" @getBranchMember="getBranchMember"  :branchData="item.sonData"></branch>
            </div>
        </div>
    </div>
</template>

<script>
    import branch from './branch'
    import {getSonBranchs} from '@/axios/companyApi'
    import {mapMutations, mapState} from 'vuex'
    export default {
        props: ['branchData'],
        name: "branch",
        data () {
          return {
              bumenChecked: '',
              nn: -1
          }
        },
        components: {branch},
        computed: {
            ...mapState('company', ['branchId'])
        },
        methods: {
            ...mapMutations('company', ['setBranchId']),
            sendPeople (item, n) {
                this.setBranchId(item.partmentId)
                this.$emit('getBranchMember', item)
            },
            getBranchMember (item) {
                this.clearChecked(item)
                this.$emit('getBranchMember', item)
            },
            showSon (item, n) {
                item.isdown=false
                getSonBranchs(item.partmentId).then(res => {
                    res.data.forEach(i => {
                        i.isdown=true
                    })
                    this.$set(this.branchData[n], 'sonData', res.data)
                })
            },
            closeSon (item,n) {
                item.isdown=true
                this.branchData[n].sonData=[]
            },
            // 清除checked
            clearChecked (item) {
                this.bumenChecked=''
                if (item.isExistSubPartment) {
                    this.$refs.branch.clearChecked()
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .checked{
        background-color: #f5f5f5;
    }
    .yiji-bumen{
        width: 100%;
        height: 44px;
        padding: 0 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    &:hover{
         background-color: #f5f5f5;
     }
    }
    .go-right{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        /deep/ .go-right>div{
            width: calc(100% - 20px) !important;
        }
    }
</style>