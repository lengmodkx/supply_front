import {getAllOrg} from '@/axios/companyApi'
const  store ={
    namespaced: true,
    state: {
        companyList: [],
        branchId: '',
        companyId: ''
    },
    mutations: {
        initCompany(state, data){
            console.log(data)
            state.companyList=data
            if (data[0]){
                state.companyList=data
                data.map(v => {
                    if (v.isSelection){
                        state.companyId=v.organizationId
                        localStorage.companyId=v.organizationId
                    }
                })
            } else {
                state.companyList=[]
                localStorage.companyId=''
                state.companyId=''
            }
        },
        setBranchId (state, data) {
            state.branchId=data
        }
    },
    actions: {
        initCompany({commit}){
            getAllOrg().then(res => {
                commit('initCompany', res.data)
            })
        }
    }
}

export default store