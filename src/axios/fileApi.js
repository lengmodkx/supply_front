import fetch from "./fetch"; // 引用fetch.js

// 获取文件详情
export function getFileDetails(fileId) {
    return fetch({
        url: `/files/${fileId}/details`,
        method: "get",
    });
}
// 修改文件名称
export function changeName(fileId, fileName) {
    return fetch({
        url: `/files/${fileId}/name`,
        method: "put",
        params: {
            fileName: fileName
        }
    });
}
// 下载文件
export function downloadFile(fileId) {
    return fetch({
        url: `/files/${fileId}/download`,
        method: "get",
    });
}
// 改变参与者
export function jionPeople(fileId, newJoin) {
    return fetch({
        url: `/files/${fileId}/add_remove_join`,
        method: "put",
        params: {
            newJoin: newJoin
        }
    });
}

// 移动文件
export function removeFile(folderId, fileIds) {
    return fetch({
        url: `/files/${folderId}/m_move`,
        method: "put",
        params: {
            fileIds: fileIds
        }
    });
}
// 复制文件
export function cloneFile(folderId, fileIds) {
    return fetch({
        url: '/files/copy',
        method: "post",
        data: {
            folderId: folderId,
            fileIds: fileIds
        }
    });
}
// 文件移到回收站
export function recycleBin(fileIds, projectId) {
    return fetch({
        url: `/files/${fileIds}/m_recycle`,
        method: "put",
        params: {
            projectId: projectId
        }
    });
}
// 添加关联
export function addRelation(data) {
    return fetch({
        url: '/bindings',
        method: "post",
        data: data
    });
}

//更新文件版本
export function updateFileVersion() {

}

//收藏文件
export function collectFile(fileId) {
    return fetch({
        url: `/files/${fileId}/collect`,
        method: "post",
        data: ''
    });
}
//文件隐私模式
export function filePrivacy(data) {
    return fetch({
        url: `/files/${fileId}/privacy`,
        method: "post",
        data: data
    });
}