import fetch from '@/axios/fetch'

// 获取企业角色列表
export function getRole(orgId) {
    return fetch({
        url: `/roles/1/99`,
        method: "get",
        params: {orgId:orgId}
    });
}
// 添加角色
export function addRole(data) {
    return fetch({
        url: `/roles/org`,
        method: "post",
        data: data
    });
}
// 删除角色
export function deleteRole(roleId, orgId) {
    return fetch({
        url: `/roles/${roleId}/org`,
        method: "delete",
        params: {orgId:orgId}
    });
}
// 更新角色信息
export function updateRole(roleId,roleName,roleDes,roleKey) {
    return fetch({
        url: `/roles/${roleId}`,
        method: "put",
        params: {roleName:roleName,roleDes:roleDes,roleKey:roleKey}
    });
}
// 获取所有权限
export function getAllPower(roleId) {
    return fetch({
        url: `/resources/${roleId}`,
        method: "get",
    });
}
// 更改权限
export function changePower(role,resources) {
    return fetch({
        url: `/resource_role/${role}/edit_resource`,
        method: "post",
        data: {resources:resources}
    });
}