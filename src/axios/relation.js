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