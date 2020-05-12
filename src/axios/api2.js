import fetch from './fetch' // 引用fetch.js
import api from './url' // 引用url.js
// 获取提醒信息
export function getRemind(taskId) {
    return fetch({
        url: `/tasks/${taskId}/remind`,
        method: 'get',
    })
}
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


//更新模型文件版本

export function updateModelVersion(parentId, params) {
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
//通过关键字查询用户 获取企业中的用户列表 20200224

export function getOrgIdUsers(keyword, orgId,projectId) {
    return fetch({
            url: `/organization/members/keyword/`,
        method: 'get', // 请求方法
        params: {
            'orgId': orgId,
            'keyword': keyword,
            'projectId': projectId
        }
    })
}

//获取指定项目中的某个成员信息

export function getAssignUsers(projectId, keyword) {
    return $get(`/members/project/${projectId}`, {
        'keyWord': keyword
    })

}

//给项目添加成员
export function addUser(params) {
    return $post('/members', params)
}
//添加分组成员
export function addProjectUser(groupId, userId) {
    return $post(`/group_user/addition_group_user/${groupId}`, {
        userId: userId
    })
}

//移除项目成员
export function removeUser(projectId, userId) {
    return $delete(`/members/${userId}`, {
        "projectId": projectId
    })
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

// 甘特图初始化
export function initGantt(projectId) {
    return fetch({
        url: `projects/gantt_chart/${projectId}`,
        method: 'get',
    })
}


//项目视图修改信息
export function updateProjectInfo(projectId, projectName, startTime, endTime) {
    return fetch({
        url: `/projects/${projectId}/updateProInfo`,
        method: 'post', // 请求方法
        params: {
            'projectName': projectName,
            'startTime': startTime,
            'endTime': endTime
        }
    })
}

//关联复制联接

export function setSysClip(url) {
    return fetch({
        url: `/tasks/setSysClip/`,
        method: 'post', // 请求方法
        params: {
            'url': url
        }
    })
}


//关联复制联接

export function changeUser(params) {
    return fetch({
        url: `/projects/updateMembersInfo/`,
        method: 'post', // 请求方法
        params: params,
    })
}


export function getOrg(orgId) {
    return fetch({
        url: `/projects/${orgId}/getDeptNameByOrgId`,
        method: 'get', // 请求方法
    })
}