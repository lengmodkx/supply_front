import fetch from "./fetch"; // 引用fetch.js

// 获取文件详情
export function getFileDetails(fileId) {
    return fetch({
        url: `/files/${fileId}/details`,
        method: "get",
    });
}

// 获取素材数据
export function getSuCaiTreeDate(fileId,page) {
    return fetch({
        url: `/files/${fileId}/material`,
        method: "get",
        params: {page:page,size:10}
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
// 标记为重要文件
export function putImportant(fileId,label) {
    return fetch({
        url: `/files/sing_cancel/important_label`,
        method: "put",
        params: {fileId:fileId,label:label}
    });
}
//获取文件的url
export function getFileUrl(fileId){
    return fetch({
        url: `/files/${fileId}/url`,
        method: "get"
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
export function removeFile(folderId, fileIds, parentId,toProjectId,projectId) {
    return fetch({
        url: `/files/${folderId}/m_move`,
        method: "put",
        params: {
            fileIds: fileIds,
            parentId:parentId,
            toProjectId: toProjectId,
            projectId: projectId
        }
    });
}
// 复制文件
export function cloneFile(folderId, fileIds,toProjectId,projectId) {
    return fetch({
        url: `/files/${folderId}/copy`,
        method: "post",
        data: {
            fileIds: fileIds,
            toProjectId: toProjectId,
            projectId:projectId
        }
    });
}
// 文件移到回收站
export function recycleBin(fileIds, projectId) {
    return fetch({
        url: '/recycle_bin/move_file_rb',
        method: "post",
        params: {
            publicId: fileIds,
            projectId: projectId,
            publicType:'file',
            action:'move'
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
// 获取文件夹下的子文件
export function getChildFiles(fileId) {
    
    return fetch({
        url: `/files/${fileId}`,
        method: "get"
    });

}


// 加载项目下的文件信息
export function getTSFile(fileId) {
    return fetch({
        url: `/files/${fileId}`,
        method: "get"
    });
}

//更新普通文件版本
export function updateFileVersion(fileId,fileObj) {
    return fetch({
        url: `/files/${fileId}/version`,
        method: "post",
        params: {fileObj: fileObj}
    });
}

//更新模型文件版本
// export function updateModelVersion(fileId,params) {
//     return fetch({
//         url: `/files/${fileId}/update_model`,
//         method: "post",
//         params: params
//     });
// }


//文件隐私模式
export function filePrivacy(id, privacy) {
    return fetch({
        url: `/files/${id}/privacy/${privacy}`,
        method: "put",
        data: ''
    });
}
// 模糊查询
// export function searchFile(fileName, projectId) {
//     return fetch({
//         url: `/files/${fileName}/seach`,
//         method: "get",
//         params: {projectId: projectId}
//     });
// }

export function searchFile(fileName, projectId) {
    return fetch({
        url: `/files/${fileName}/search_file`,
        method: "get",
        params: {projectId: projectId}
    });
}

//获取文件目录

export function getFolders(fileId,projectId) {
    return fetch({
        url: `/files/${fileId}/parent/folders`,
        method: "get",
        params: {projectId: projectId}
    });
}


//获取文件目录

export function getFileByTag(tagId) {
    return fetch({
        url: `/files/${tagId}`,
        method: "get",
    });
}
// 获取素材库 数据
export function getSucai(folderId,page,orderType) {
    return fetch({
        url: `/files/${folderId}/material`,
        method: "get",
        params: {
            current:page,
            size: 10,
            downloadCount:orderType
        }
    });
}
// 获取素材库树
export function getMaterialTree() {
    return fetch({
        url: '/files/material/tree',
        method: "get"
    });
}


// 获取素材库 搜索
export function getSucaiSearch(fileName,page) {
    return fetch({
        url: `/files/${fileName}/material_base_search`,
        method: "get",
        params: {
            page:page,
            size: 10
        }
    });
}

// 获取文件树新

export function getTree(fileId) {
    return fetch({
        url: `/files/tree/${fileId}`,
        method: "get",
    });
}


export function checkPerm(){
    return fetch({
        url: '/oss/checkperm',
        method: "get",
    });
}
export function checkdownload(){
    return fetch({
        url: '/oss/checkdownload',
        method: "get",
    });
}

export function download(fileIds){
    return fetch({
        url: '/files/batch/download',
        method: "post",
        data: { fileIds: fileIds },
        responseType: 'blob'
    });
}
