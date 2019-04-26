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