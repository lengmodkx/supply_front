import fetch from "./fetch"; // 引用fetch.js


// 编辑列表名称
export function editMenuName(relationId,data) {
    return fetch({
        url: `/relations/${relationId}/menu`,
        method: "put",
        params:{"menuName":data}
    });
}

//添加新列表
export function addMenu(projectId,menuName,groupId,order) {
    return fetch({
        url: `/relations/${projectId}/menu`,
        method: "post",
        params:{"menuName":menuName,"groupId":groupId,"order":order}
    });
}

//设置列表下所有任务的截止时间
export function setAllTaskEndTime(menuId,endTime) {
    return fetch({
        url: `/relations/${menuId}/task_end_time`,
        method: "put",
        params:{"endTime":endTime}
    });
}

//移动列表下所有任务
export function moveAllTask(menuId,projectId,groupId,toMenuId) {
    return fetch({
        url: `/relations/${menuId}/move_all_task`,
        method: "put",
        params:{"projectId":projectId,"groupId":groupId,"toMenuId":toMenuId}
    });
}

//复制列表下所有任务
export function copyAllTask(menuId,projectId,groupId,toMenuId) {
    return fetch({
        url: `/relations/${menuId}/copy_all_task`,
        method: "post",
        params:{"projectId":projectId,"groupId":groupId,"toMenuId":toMenuId}
    });
}