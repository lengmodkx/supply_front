import {
    setTagNavListInLocalstorage,
    getTagNavListFromLocalstorage,
    localRead
} from '@/utils/util'

const store = {
    namespaced: true,
    //存储数据
    state: {
        isCollapse: false,
        currentMenu: null,
        tabsList: [{
            path: '/org/' + localRead('companyId'),
            name: 'organization',
            label: '首页',
        }]
    },
    //调用方法
    mutations: {
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        //选择标签 选择面包屑
        selectMenu(state, val) {
            if (val.name === 'organization') {
                state.currentMenu = null
            } else {
                state.currentMenu = val
                //如果等于-1说明tabsList不存在那么插入，否则什么都不做
                if (val.meta.name || val.label) {
                    let result = state.tabsList.findIndex(item => item.name === val.name)
                    let obj = {
                        path: val.path,
                        name: val.name,
                        label: val.meta ? val.meta.name : val.label,
                    }
                    result === -1 ? state.tabsList.push(obj) : ''
                    setTagNavListInLocalstorage([...state.tabsList])
                }

            }
            // val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu = val)
        },
        //关闭标签
        closeTab(state, val) {
            let result = state.tabsList.findIndex(item => item.name === val.name)
            state.tabsList.splice(result, 1)
            setTagNavListInLocalstorage([...state.tabsList])
        },
        setLocalTag(state, val) {
            state.tabsList = val
        }
    },
    actions: {}
}
export default store