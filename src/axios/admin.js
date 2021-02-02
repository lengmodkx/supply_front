import fetch from "./fetch"; // 引用fetch.js
import api from "./url"; // 引用url.js


//需求审核
export function demandCheckDemand(data) {
    return fetch({
        url: `/demand/checkDemand`,
        method: 'get', // 请求方法
        params: data
    })
}


//内容审核
export function contentAudit(data) {
    return fetch({
        url: `/article/checkArticle`,
        method: 'get', // 请求方法
        params: data
    })
}

//评论审核
export function updateCommentState(data) {
    return fetch({
        url: `/comment/updateCommentState`,
        method: 'get', // 请求方法
        params: data
    })
}

