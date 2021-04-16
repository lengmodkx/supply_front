import {getNews,deleteNews,getNewsCount} from '@/axios/api'
const store = {
    namespaced: true,
    state: {
        news:[],
        newsCount:0
    },
    mutations: {
        getNewsCount(state,data){
            console.log(data)
            state.newsCount = data
        },
        getNewsList(state, data) {
            state.news = data
        },
        deteleNews(state,data){
            state.news.forEach((n,i) => {
                if(n.newsId === data){
                    state.news.splice(i,1)
                }
            })
        }
    },
    actions:{
        getNewsList({commit},data){
            getNews(data).then(res => {
                if(res.result === 1){
                    commit('getNewsList',res.data)
                }
            })
        },
        deleteNews({commit},id){
            return new Promise(resolve => {
                deleteNews(id).then(res => {
                    if(res.result === 1){
                        commit('deteleNews',id)
                        resolve()
                    }
                })
            })

        },
        getNewsCount({commit}){
            getNewsCount().then(res => {
                if(res.result === 1){
                    commit('getNewsCount',res.data)
                }
            })
        }
    }
}

export default store
