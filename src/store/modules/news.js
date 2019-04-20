import {getNews,deleteNews,getNewsCount} from '@/axios/api'
const store = {
    namespaced: true,
    state: {
        news:[],
        newsCount:0
    },
    mutations: {
        getNewsCount(state,data){
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
        },
        addNews(state,data){
            var i = 0
            if(state.news.length === 0){
                state.newsCount++
                state.news.push(data)
            } else{
                state.news.forEach((n,index) => {
                    if(n.newsId === data.newsId){
                        state.news[index].newsContent = data.newsContent
                        state.news[index].newsName = data.newsName
                        state.news[index].updateTime = data.updateTime
                        state.news[index].newsFromUser.defaultImage = data.newsFromUser.defaultImage
                        state.news[index].newsCount++
                        state.news[index].newsHandle = 0
                        state.newsCount++
                        i = 1;
                    }
                })
                if(i === 0){
                    state.newsCount++
                    state.news.unshift(data)
                }
            }
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
            deleteNews(id).then(res => {
                if(res.result === 1){
                    commit('deteleNews',id)
                }
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
