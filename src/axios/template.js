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
        url: 'templates/saveTemplate',
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


//模板详情
export function templateInfo(data) {
    return fetch({
        url: `/templates/templateInfo`,
        method: 'get', // 请求方法
        params: data
    })
}

//创建模板任务
export function createTemplateTask(data) {
    return fetch({
        url: `/templates/createTemplateTask`,
        method: 'get', // 请求方法
        params: data
    })
}

//新建任务列表
export function createNewList(data) {
    return fetch({
        url: '/templates/relations',
        method: 'post', // 请求方法
        data: data
    })
}

//模板任务初始化
export function getTemplateTaskList(data) {
    return fetch({
        url: '/templates/getTemplateTaskList',
        method: 'get', // 请求方法
        params: data
    })
}


// 修改任务名称
export function updateTaskName(data) {
    return fetch({
        url: `/templates/${data.taskId}/update`,
        method: "put", // 请求方法
        params:data
    });
}

//创建标签
export function createTemplateTag(data) {
    return fetch({
        url: '/templates/createTemplateTag',
        method: 'get', // 请求方法
        params: data
    })
}

//获取标签列表
export function getTemplateTagList(data) {
    return fetch({
        url: '/templates/getTemplateTagList',
        method: 'get', // 请求方法
        params: data
    })
}


//修改标签
export function updateTemplateTag(data) {
    return fetch({
        url: '/templates/updateTemplateTag',
        method: 'get', // 请求方法
        params: data
    })
}


//删除标签
export function removeTemplateTag(data) {
    return fetch({
        url: '/templates/removeTemplateTag',
        method: 'get', // 请求方法
        params: data
    })
}

//添加子任务
export function insertChildTask(data) {
    return fetch({
        url: '/templates/insertChildTask',
        method: 'get', // 请求方法
        params: data
    })
}

//删除分组列表
export function deleteRelaList(relationId) {
    return fetch({
        url: `templates/relations`,
        method: 'delete', // 请求方法
        params: {
            relationId:relationId
        }
    })
}

// 修改分组名称
export function updateRelaName(relationId, relationName) {
    return fetch({
        url: `templates/relations`,
        method: "put", // 请求方法
        params: {
            relationId: relationId,
            relationName:relationName
        }
    });
}



//移除模板列表任务
export function deleteRealtionAllTask(data) {
    return fetch({
        url: '/templates/deleteRealtionAllTask',
        method: 'get', // 请求方法
        params: data
    })
}


//根据模板创建项目
export function applyTemplate(data) {
    return fetch({
        url: `/templates/project/${data.templateId}`,
        method: 'post', // 请求方法
        data: data
    })
}