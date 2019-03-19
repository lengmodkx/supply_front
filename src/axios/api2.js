import fetch from './fetch' // 引用fetch.js
import api from './url' // 引用url.js
// 所有分享
export function shares(projectId) {
    return $get('/shares', {
        'projectId': projectId
    })
}
// 分享详情
export function share(shareId) {
    return $get(`/shares/${shareId}`, '')
}

export function shareAdd(params) {
    return $post('/shares', params)
}

export function files(params) {
    return $get('/files', params)
}

export function uploadModel(parentId, params) {
    return $post(`/files/${parentId}/model`, params)
}

export function createFolder(parentId, params) {
    return $post(`/files/${parentId}/add`, params)
}

export function uploadCommonFile(parentId, params) {
    return $post(`/files/${parentId}/upload`, params)
}

export function menus(projectId) {
    return $get(`/projects/${projectId}/menu`, null)
}

export function folder(projectId, params) {
    return $get(`/files/${projectId}/folder`, params)
}

export function checkFolder(fileId) {
    return $get(`/files/${fileId}/check_folder`, null)
}







export function $post(url, params) {
    return fetch({
        url: url,
        method: 'post', // 请求方法
        data: params
    })
}

function $get(url, params) {
    return fetch({
        url: url,
        method: 'get', // 请求方法
        params: params
    })
}

function $put(url, params) {
    return fetch({
        url: url,
        method: 'put', // 请求方法
        data: params
    })
}

function $delete(url, params) {
    return fetch({
        url: url,
        method: 'delete', // 请求方法
        params: params
    })
}