<template>
    <div>
        <div class="go-right" v-for="item in branchData" :key="item.partmentId">
            <div :class="{checked:bumenChecked==item.partmentId}" class="yiji-bumen" @click="sendPeople(item)">
                {{item.partmentName}}
                <div v-if="item.isExistSubPartment">
                    <Icon @click="showSon(item)" v-if="isdown" type="ios-arrow-dropdown" size="20" />
                    <Icon v-else @click="isdown=true" type="ios-arrow-dropup" size="20" />
                </div>
            </div>
            <div v-if="item.isExistSubPartment">
                <branch @getBranchMember="getBranchMember"  :branchData="sonData"></branch>
            </div>

        </div>
    </div>
</template>

<script>
    import branch from './branch'
    export default {
        props: ['branchData'],
        name: "branch",
        data () {
          return {
              isdown: true,
              bumenChecked: '',
              sonData: []
          }
        },
        components: {branch},
        methods: {
            sendPeople (item) {
                this.bumenChecked=item.partmentId
                this.$emit('getBranchMember', item)
            },
            getBranchMember (item) {
                this.$emit('getBranchMember', item)
            },
            showSon (item) {}
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
        .yiji-bumen{
            width: calc(100% - 20px) ;
        }
    }
    .go-right{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
</style>