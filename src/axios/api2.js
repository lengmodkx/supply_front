import fetch from './fetch' // 引用fetch.js
import api from './url' // 引用url.js
// 获取一个用户的日历信息
export function getCalendar(userId) {
    return fetch({
        url: `/calendar/${userId}`,
        method: 'get',
    })
}
// 列表示图初始化
export function getListView(projectId) {
    return fetch({
        url: `/tasks/${projectId}/panel`,
        method: 'get',
    })
}

// 在甘特图中 更新项目的开始结束时间
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

export function bind_files(params) {
    return fetch({
        url: '/files/bind_files',
        method: 'post', // 请求方法
        data: params
    })
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


//通过关键字查询用户
export function getUsers(keyword) {
    return $get(`/members/${keyword}`, null)
}

//给项目添加成员
export function addUser(params) {
    return $post('/members', params)
}
//移除项目成员
export function removeUser(userId) {
    return $delete(`/members/${userId}`, null)
}

export function projectTag(projectId) {
    return $get(`tags/${projectId}/checkProjectTag`, '')
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

//更改项目封面
export function updataProjectPic(projectId,file) {
    return fetch({
        headers: { 'Content-Type': 'charset=UTF-8; multipart/form-data;' },
        url: '/projects/${projectId}/picture',
        method: 'post', // 请求方法
        params: {
            file: file,
        }
    })
}
// 甘特图初始化
export function initGantt(projectId) {
    return fetch({
        url: `projects/gantt_chart/${projectId}`,
        method: 'get',
    })
}


//项目视图修改信息
export function updateProjectInfo(projectId,projectName,startTime,endTime) {
    return fetch({
            url: `/projects/${projectId}/updateProInfo`,
        method: 'post', // 请求方法
        params: {
            'projectName': projectName,
            'startTime': startTime,
            'endTime':endTime
        }
    })
}