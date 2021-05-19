import fetch from "./fetch"; // 引用fetch.js

export function templates(params) {
    return fetch({
        url: 'templates',
        method: 'get', // 请求方法
        params: params
    })
}

export function template(templateId) {
    return fetch({
        url: `templates/${templateId}`,
        method: 'get' // 请求方法
    })
}

export function saveTemplate(data) {
    return fetch({
        url: 'templates',
        method: 'post', // 请求方法
        data: data
    })
}

export function getRelation(params) {
    return fetch({
        url: 'templates/relations',
        method: 'get', // 请求方法
        params: params
    })
}