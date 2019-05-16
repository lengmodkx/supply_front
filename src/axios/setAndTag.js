import fetch from "./fetch"; // 引用fetch.js

// 获取回收站中的信息
export function getRecycle(projectId, type, fileType) {
    return fetch({
        url: `/recycle_bin/${projectId}/${type}`,
        method: "get",
        params: {fileType:fileType}
    });
}
// 初始化标签页面
export function getAllTag(projectId) {
    return fetch({
        url: `/tags/${projectId}/bind`,
        method: "get",
    });
}
// 获取标签所有绑定信息
export function getTagBind(tagId) {
    return fetch({
        url: `/tags/${tagId}/tag_bind_info`,
        method: "get",
    });
}