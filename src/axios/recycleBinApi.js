import fetch from "./fetch"; // 引用fetch.js

// 恢复内容
export function recycle(publicId,publicType,projectId,groupId,menuId) {
    return fetch({
        url: `/recycle_bin/recovery`,
        method: "put",
        params:{
            publicId:publicId,
            publicType:publicType,
            projectId:projectId,
            groupId:groupId,
            menuId:menuId
        }
    });
}