import fetch from "./fetch"; // 引用fetch.js


// 根据项目id获取分组信息
export function getFenzu(projectId) {
    return fetch({
        url: `/relations/${projectId}/bind/group_info`,
        method: "get"
    });
}

// 获取某个分组下菜单和任务
export function getTask(groupId) {
    return fetch({
        url: `/relations/${groupId}/bind/menu_info`,
        method: "get"
    });
}
// 获取子任务
export function getZirenwu(taskId) {
    return fetch({
        url: `/tasks/${taskId}/bind/child`,
        method: "get"
    });
}
// 获取 分享
export function getShare(projectId) {
    return fetch({
        url: `/shares/${projectId}/bind`,
        method: "get"
    });
}
// 获取日程
export function getSchedule(projectId) {
    return fetch({
        url: `/schedules/${projectId}/bind`,
        method: "get"
    });
}
// 获取文件
export function getFile(projectId) {
    return fetch({
        url: `/files/${projectId}/bind`,
        method: "get"
    });
}
// 添加关联
export function addRelation(data) {
    return fetch({
        url: '/bindings',
        method: "post",
        data: data
    });
}