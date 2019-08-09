import fetch from "./fetch"; // 引用fetch.js
// 保存自动化规则
export function saveRule(data) {
    return fetch({
        url: `/automation_rules`,
        method: "post",
        data: data,
        headers: {
            'Content-Type':'application/json'
        },
        specialPost: true
    });
}
// 获取自动化规则列表
export function getAllRule(projectId) {
    return fetch({
        url: `/automation_rules/pro/${projectId}`,
        method: "get",
    });
}
// 修改规则名称
export function ruleName(id,name) {
    return fetch({
        url: `/automation_rules/${id}/name`,
        method: "put",
        params: {
            name:name
        }
    });
}
// 删除自动化规则
export function deleteRule(id) {
    return fetch({
        url: `/automation_rules/${id}`,
        method: "delete",
    });
}
// 编辑规则
export function editRule(id) {
    return fetch({
        url: `/automation_rules/id/${id}`,
        method: "get",
    });
}