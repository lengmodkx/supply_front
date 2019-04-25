import fetch from "./fetch"; // 引用fetch.js

// 创建企业
export function createCompany(data) {
    return fetch({
        url: '/organizations',
        method: "post",
        data: data
    });
}
// 获取 企业成员
export function getMembers(phone,orgId) {
    return fetch({
        url: `/organization/members/${phone}/user`,
        method: "get",
        params: {orgId:orgId}
    });
}