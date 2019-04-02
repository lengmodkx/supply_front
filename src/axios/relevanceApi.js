import fetch from "./fetch"; // 引用fetch.js


// 根据项目id获取分组信息
export function getFenzu(projectId) {
    console.log(555555)
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

// 更新日程名称
export function upRichengName(scheduleId, scheduleName) {
    return fetch({
        url: `/schedules/${scheduleId}/schedule_name`,
        method: "put",
        params: {scheduleName:scheduleName}
    });
}
