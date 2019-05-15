import fetch from "./fetch"; // 引用fetch.js

// 获取回收站中的信息
export function getRecycle(projectId, type, fileType) {
    return fetch({
        url: `/recycle_bin/${projectId}/${type}`,
        method: "get",
        params: {fileType:fileType}
    });
}