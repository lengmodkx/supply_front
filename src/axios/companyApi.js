import fetch from "./fetch"; // 引用fetch.js

// 查询企业列表
export function getAllOrg() {
    return fetch({
        url: '/organizations/my_org',
        method: "get",
    });
}
// 创建企业
export function createCompany(data) {
    return fetch({
        url: '/organizations',
        method: "post",
        data: data
    });
}
// 搜索 企业成员
export function searchMembers(phone,orgId) {
    return fetch({
        url: `/organization/members/${phone}/user`,
        method: "get",
        params: {orgId:orgId}
    });
}
// 添加企业成员/部门成员
export function addPeople(data) {
    return fetch({
        url: '/organization/members/',
        method: "post",
        data: data
    });
}
// 初始化企业信息  查询信息
export function initOrgMember(orgId, flag) {
    return fetch({
        url: `/organization/members/${orgId}`,
        method: "get",
        params: {
            'pageSize': 9999,
            'flag': flag?flag:0,
        }
    });
}
// 创建部门
export function createBranchs(orgId, data) {
    return fetch({
        url: `/partments/${orgId}`,
        method: "post",
        data: data
    });
}
// 获取部门信息
export function getBranch(orgId) {
    return fetch({
        url: `/partments/${orgId}`,
        method: "get",
    });
}
// 获取部门下的成员
export function getBranchpeople(partmentId) {
    return fetch({
        url: `/partment_members/${partmentId}/members`,
        method: "get",
    });
}
// 添加部门成员
export function addBranchPeople(partmentId, data) {
    return fetch({
        url: `/partment_members/${partmentId}/add`,
        method: "post",
        data:data
    });
}

// 创建群组
export function addGroup(orgId, data) {
    return fetch({
        url: `/organization_group/${orgId}`,
        method: "post",
        data:data
    });
}