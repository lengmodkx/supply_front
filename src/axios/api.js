import fetch from "./fetch"; // 引用fetch.js
import api from "./url"; // 引用url.js

export function getOssSign() {
    return $get('/oss/sign', {
        "dir": "upload/file/"
    });
}

export function getWebSign(key) {
    return $get('/oss/websign', {
        "dir": 'upload/chat/'
    });
}

export function changeOrganization(orgId) {
    return $post(`/organization/members/${orgId}`)
}
// 收藏
export function collect(data) {
    return fetch({
        url: '/collections',
        method: "post",
        data: data
    });
}
// 发送消息
export function sendMsg(str) {
    return fetch({
        url: '/logs/chat',
        method: "post",
        data: str,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// 删除所有的已读消息
export function deleteAllRead() {
    return fetch({
        url: `/news/read`,
        method: "delete"
    });
}

//标记所有消息为已读
export function allIsRead() {
    return fetch({
        url: `/news/read`,
        method: "put"
    });
}

// 剩余消息
export function restMsg(publicId, surpluscount) {
    return fetch({
        url: `/logs/${publicId}/surplus_msg`,
        method: "get",
        params: {
            'surpluscount': surpluscount
        }
    });
}
//用户登录：
export function userlogin(data) {
    // userName,password是参数
    return fetch({
        url: api.login,
        method: "post",
        data: data
    });
}
//获取手机绑定框


export function showBindPhone() {
    return fetch({
        url: '/is_bind_phone',
        method: "get",
    });
}

// 获取手机验证码
export function getPhone(accountName, captcha) {
    return fetch({
        url: '/code',
        method: "get",
        params: {
            'accountName': accountName,
            'captcha': captcha
        }
    });
}
//通过手机获取验证码

export function getPhoneCode(phone, userId) {
    return fetch({
        url: '/message/code',
        method: "post",
        params: {
            'phone': phone,
            'userId': userId
        }
    });
}

//绑定手机号

export function bindPhone(data) {
    return fetch({
        url: '/bind/phone',
        method: "post",
        data: data
    });
}

// 重置密码
export function resetPwd(data) {
    return fetch({
        url: '/forget',
        method: "put",
        params: {
            'accountName': data.accountName,
            'password': data.password,
            'code': data.code
        }
    });
}
//获取用户登录时用于加密的字符串
export function getEncrypStr() {
    return fetch({
        url: '/encryp_str',
        method: "get"
    });
}

//用户注册：
export function userRegister(data) {
    return fetch({
        url: api.register,
        method: "post", // 请求方法
        data: data
    });
}

//创建新的项目
export function createProject(data) {
    return fetch({
        url: api.projects,
        method: "post", // 请求方法
        data: data
    });
}
// 获取项目树形菜单
export function getProjectTree(projectId) {
    return fetch({
        url: '/projects/tree',
        method: "get", // 请求方法
        params: {
            projectId: projectId
        }
    });
}
//获取单个项目
export function getProject(projectId) {
    return $get(`/projects/${projectId}`);
}
// 局部更新项目
export function updateProject(data) {
    return fetch({
        url: `/projects/${data.projectId}`,
        method: "put", // 请求方法
        params: data
    });
}
// 搜索项目
// export function searchProjects(projectName, condition) {
//     return fetch({
//         url: '/projects/seach',
//         method: "get", // 请求方法
//         params: {
//             projectName: projectName,
//             condition: condition
//         }
//     });
// }

// 搜索项目 2020-5-15
export function searchProjects(projectName, condition, orgId) {
    return fetch({
        url: '/projects/seach',
        method: "get", // 请求方法
        params: {
            projectName: projectName,
            condition: condition,
            orgId: orgId,
        }
    });
}

//获取项目列表
// export function getProjectList() {
//     return fetch({
//         url: api.projects,
//         method: "get", // 请求方法
//         params: {}
//     });
// }

//获取关联任务 2020-2-19

export function getProjectList(orgId) {
    return fetch({
        url: '/projects/org/projects',
        method: "get", // 请求方法
        params: {
            orgId: orgId
        }
    });
}


//获取项目列表
export function getStarProjectList() {
    return fetch({
        url: `${api.members}/star`,
        method: "get", // 请求方法
        params: {}
    });
}
//获取验证码：
export function getCaptcha(data) {
    // projects是你要调用接口的名字，label是传进来的参数
    return fetch({
        url: api.captcha,
        method: "get" // 请求方法
        // params: {
        //   captcha: data,

        // }
    });
}
//设为星标项目
export function setStarProject(projectId) {
    return fetch({
        url: `${api.projects}/${projectId}/collect`,
        method: "put" // 请求方法
    });
}
//项目归档，取消归档
export function guidangProject(projectId, status) {
    return fetch({
        url: `${api.projects}/${projectId}/status`,
        method: "put", // 请求方法
        params: {
            status
        }
    });
}
//项目移入回收站
export function recycleProject(projectId) {
    return fetch({
        url: `${api.projects}/${projectId}/recycle_bin`,
        method: "put", // 请求方法
        params: {}
    });
}
//项目移出回收站
export function recoverProject(projectId) {
    return fetch({
        url: `${api.projects}/${projectId}/out_recycle_bin`,
        method: "put", // 请求方法
        params: {}
    });
}

//彻底删除项目
export function delProject(projectId) {
    return fetch({
        url: `${api.projects}/${projectId}`,
        method: "delete", // 请求方法
        params: {}
    });
}

// 任务彻底删除

export function delRWProject(taskId) {
    return fetch({
        url: `tasks/${taskId}`,
        method: "delete", // 请求方法
        params: {}
    });
}

// 分享删除

export function delFXProject(shareId) {
    return fetch({
        url: `shares/${shareId}`,
        method: "delete", // 请求方法
        params: {}
    });
}


// 日程删除


export function delRCProject(id) {
    return fetch({
        url: `schedules/${id}`,
        method: "delete", // 请求方法
        params: {}
    });
}
export function createUser(userId, orgId) {
    return $post("/aliyun/createUser", {
        userId: userId,
        orgId: orgId
    })
}

export function createMeeting(userId, meetingName, scheduleId, projectId) {
    return $get("/aliyun/createMeeting", {
        userId: userId,
        meetingName: meetingName,
        scheduleId: scheduleId,
        projectId: projectId
    })
}
export function joinMeeting(userId, meetingCode) {
    return $get("/aliyun/joinMeeting", {
        userId: userId,
        meetingCode: meetingCode
    })
}

//文件删除文件夹删除


export function delWJProject(id, projectId) {
    return fetch({
        url: `files/${id}`,
        method: "delete", // 请求方法
        params: {
            projectId: projectId
        }
    });
}

//删除文件夹新
export function delWJProjectNew(fileId) {
    return fetch({
        url: `files/deleteFileFolder`,
        method: "delete", // 请求方法
        params: {
            fileId: fileId
        }
    });
}


// 分组删除

export function delFZProject(id) {
    return fetch({
        url: `relations/${groupId}/group`,
        method: "delete", // 请求方法
        params: {}
    });
}

// 标签删除

export function delBQProject(tagId) {
    return fetch({
        url: `tags/${tagId}`,
        method: "delete", // 请求方法
        params: {}
    });
}
//点击项目进入任务主页
export function mView(projectId) {
    return $get(`${api.projects}/view_member`, {
        projectId: projectId
    });
}

//点击项目进入任务主页
export function enterTask(projectId) {
    return fetch({
        url: `${api.projects}/${projectId}/tasks`,
        method: "get" // 请求方法
    });
}

//任务流转任务列表
export function enterTaskNew(projectId) {
    return fetch({
        url: `projects/${projectId}/taskIndex2`,
        method: "get" // 请求方法
    });
}
// 添加任务
export function addTask(data) {
    return fetch({
        url: api.tasks,
        method: "post", // 请求方法
        data: data
    });
}

// 修改任务名称
export function updateTaskName(taskId, taskName) {
    return fetch({
        url: `${api.tasks}/${taskId}/name`,
        method: "put", // 请求方法
        params: {
            taskName: taskName
        }
    });
}

// 修改任务名称
export function updateRepeat(taskId, repeat) {
    return fetch({
        url: `${api.tasks}/${taskId}/repeat`,
        method: "put", // 请求方法
        params: {
            repeat: repeat
        }
    });
}

// 修改任务优先级
export function updatePriority(taskId, priority) {
    return fetch({
        url: `${api.tasks}/${taskId}/priority`,
        method: "put", // 请求方法
        params: {
            priority: priority
        }
    });
}

// 任务移入回收站
// export function taskToRecycle(taskId) {

//     return $put(`/tasks/${taskId}/recyclebin`);
// }

export function taskToRecycle(params) {

    return $post(`/recycle_bin/move_task_rb`, params);
}




//移动所有任务到回收站
export function taskAllToRecycle(menuId) {
    return $put(`/relations/${menuId}/move_recycle_bin`)
}
// 复制任务
export function copyTask(taskId, projectId, groupId, menuId) {
    return $post(`/tasks/${taskId}/copy`, {
        projectId: projectId,
        groupId: groupId,
        menuId: menuId
    });
}

// 移动任务
export function moveTask(taskId, projectId, groupId, menuId) {
    return $put(`/tasks/${taskId}/move`, {
        projectId: projectId,
        groupId: groupId,
        menuId: menuId
    });
}
//获取项目成员
export function projectMembers(projectId) {
    return $get(`/projects/${projectId}/members`, '');
}

//搜索项目成员
export function projectMembersSerach(projectId, condition) {


    return fetch({
        url: `/projects/searchMemberByName/${projectId}`,
        method: "get",
        params: {
            condition: condition,
        }
    });
}




//获取单个项目成员详情
export function projectOneMembers(projectId, userId) {
    return $get(`/projects/${projectId}/membersInfo/${userId}`, '');
}

//获取参与者列表
export function getmemberList(projectId) {
    return $get(`/members/${projectId}/member`, '');
}
//获取项目中总标签列表
export function allTags(projectId, params) {
    return $get(`/tags/${projectId}`, params);
}
//创建新标签
export function addnewTag(params) {
    return $post(`/tags`, params)
}


//创建标签并且绑定信息
export function addTagAndBind(params) {
    return $post(`/tags/add_and_bind`, params)
}
//删除标签
// export function delTag(tagId, params) {
//     return $delete(`/tags/${tagId}`, params);
// }


export function delTag(params) {

    return $post(`/recycle_bin/move_tag_rb`, params);
}

// 标签移动到回收站
export function receclyTag(tagId) {
    return $put(`/tags/${tagId}/dropTag`, null);
}




//修改标签
export function modifyTag(tagId, params) {
    return $put(`/tags/${tagId}`, params);
}

//移除一项信息上的标签
export function removeInfoTag(tagId, publicId, publicType) {
    return $delete(`/tags/${tagId}/remove/tag`, {
        publicId: publicId,
        publicType: publicType
    });
}

//在一项信息上添加标签
export function bindingTag(tagId, publicId, publicType) {
    return $post(`/tags/binding`, {
        tagId: tagId,
        publicId: publicId,
        publicType: publicType
    });
}

//搜索标签
export function searchTags(params) {
    return $get(`/tags/search`, params)
}
//修改进度

export function progress(params) {
    return $post(`/tasks/progress`, params)
}

//修改计划工时

export function workHour(params) {
    return $post(`/tasks/work_hours`, params)
}

//添加实际工时
export function additionHour(params) {
    return $post(`/taskWorkingHours/addition`, params)
}


//获取工时列表

export function getTaskWorkingHours(params) {
    return $get(`/taskWorkingHours/list`, params)
}

//删除工时列表

export function removeTaskWorkingHours(params) {
    return $post(`/taskWorkingHours/remove`, params)
}

//拖拽任务大盒子 排序菜单
export function sortTaskMenu(idList) {
    return fetch({
        url: `${api.relations}/${idList}/orderMenu`,
        method: "put", // 请求方法
        params: {}
    });
}
//新建任务（菜单）
export function addnewTask(projectId, groupId, menuName) {
    return fetch({
        url: `${api.relations}/${projectId}/menu`,
        method: "post", // 请求方法
        data: {
            groupId: groupId,
            menuName: menuName
        }
    });
}

//点赞
export function fabulous(publicId) {
    return $post('/public/fabulous', {
        publicId: publicId
    })
}

//取消点赞
export function cancelFabulous(publicId) {
    return $delete(`/public/${publicId}/cancle_fabulous`, {
        publicId: publicId
    })
}

//收藏任务
export function collectTask(projectId, publicId, collectType) {
    return $post('/collections', {
        projectId: projectId,
        publicId: publicId,
        collectType
    })
}

//取消收藏
export function cancelCollect(publicId) {
    return $delete(`/collections/${publicId}`)
}

//完成任务
export function completeTask(projectId, taskId, label) {
    var l = {
        label: label,
        projectId: projectId
    }
    return fetch({
        url: `${api.tasks}/${taskId}/finish`,
        method: "put", // 请求方法
        params: l
    });
}
//取消完成任务
export function cancelcompleteTask(projectId, taskId, label) {
    var l = {
        label: label,
        projectId: projectId
    }
    return fetch({
        url: `${api.tasks}/${taskId}/unFinish`,
        method: "put", // 请求方法
        params: l
    });
}
//拖拽任务排序
export function dragTask(data) {
    return fetch({
        url: `${api.tasks}/order`,
        method: "put", // 请求方法
        params: {
            projectId: data.projectId,
            taskId: data.taskId,
            taskIds: data.taskIds,
            newMenu: data.newMenu
        }
    });
}
//任务编辑弹出框初始化
export function initEditTask(taskId) {
    return fetch({
        url: `${api.tasks}/${taskId}`,
        method: "get",
        params: {}
    });
}

export function getTaskFiles(params) {
    return fetch({
        url: `/tasks/${params}/files`,
        method: 'get', // 请求方法
        params: params
    })
}

/**获取项目下的所有分组 */
export function getGroupList(projectId) {
    return $get(`/relations/${projectId}`, {
        projectId: projectId
    });
}

/**获取分组下的所有菜单 */
export function getMenuList(groupId) {
    return $get(`/relations/${groupId}/menus`);
}

/** 更新任务的参与者 */
export function updateTaskJoin(taskId, joinIds) {
    return $put(`/tasks/${taskId}/members`, {
        taskUids: joinIds
    });
}

/**日程初始化 */
export function schedules(params) {
    return $get(`/schedules/`, params);
}
/**添加日程 */
export function addSchedule(params) {
    return $post(`/schedules/`, params);
}
// 所有分享
export function shares(projectId) {
    return $get("/shares", {
        projectId: projectId
    });
}
// 分享详情
export function getShareDetail(shareId) {
    return $get(`/shares/${shareId}`, "");
}
// 改变分享参与者
export function changeJoin(shareId, memberIds) {
    return $put(`/shares/${shareId}/members`, {
        memberIds: memberIds
    });
}
//添加分享
export function shareAdd(params) {
    return $post("/shares", params);
}
// 编辑分享
export function editShare(shareId, params) {
    return $post(`/shares/${shareId}`, params);
}
//删除分享
export function deleteShare(shareId) {
    return $delete(`/shares/${shareId}`, "");
}
//将分享移入回收站
// export function recycleShare(shareId, projectId) {
//     return $put(`/shares/${shareId}/recyclebin`, {
//         projectId: projectId
//     });
// }

export function recycleShare(params) {

    return $post(`/recycle_bin/move_share_rb`, params);
}




//恢复分享
export function recovery(shareId) {
    return $put(`/shares/${shareId}/recovery`, "");
}
//复制分享
export function copyShare(shareId, projectId) {
    return $post(`/shares/${shareId}/copy`, {
        projectId: projectId
    });
}

//移动分享
export function moveShare(shareId, projectId, curProjectId) {
    return $post(`/shares/${shareId}/move`, {
        projectId: projectId,
        curProjectId: curProjectId
    });
}

//更换分享隐私模式
export function privacyShare(shareId, projectId) {
    return $put(`/shares/${shareId}/privacy`, {
        projectId: projectId
    });
}

//置顶分享
export function topShare(shareId, projectId) {
    return $post(`/shares/${shareId}/top`, {
        projectId: projectId
    });
}

//更改任务的隐私模式
export function updateTaskPrivacy(taskId, privacy) {
    return $put(`/tasks/${taskId}/privacy`, {
        privacy: privacy
    });
}

//所有文件
export function files(fileId) {
    return $get(`/files/${fileId}`);
}
//项目所有子文件夹
export function folderChild(projectId) {
    return $get(`/files/${projectId}/folder/all`, '');
}

//上传模型
export function uploadModel(parentId, params) {
    return $post(`/files/${parentId}/model`, params);
}
//创建文件夹
export function createFolder(parentId, params) {
    return $post(`/files/${parentId}/add`, params);
}
//上传普通文件
export function uploadCommonFile(parentId, params) {
    return $post(`/files/${parentId}/upload`, params);
}
//菜单
export function menus(projectId) {
    return $get(`/projects/${projectId}/menu`, null);
}
//文件夹
export function folder(projectId, params) {
    return $get(`/files/${projectId}/folder`, params);
}
//获取项目下所有成员
export function members(projectId) {
    return $get(`/members/${projectId}/member`, "");
}
// 更新任务开始时间
export function upStartTime(taskId, startTime) {
    return $put(`tasks/${taskId}/starttime`, {
        startTime: startTime
    })
}
// 更新任务结束时间
export function upEndTime(taskId, endtime) {
    return $put(`tasks/${taskId}/endtime`, {
        endTime: endtime
    })
}
// 添加子任务
export function addChildTask(taskId, params) {
    return $post(`tasks/${taskId}/addchild`, {
        taskName: params
    })
}

//获取当前用户消息
export function getNews(data) {
    //console.log(data.isRead)
    if (!data.isRead) {
        return $get(`news`, data)
    } else {
        return $get(`news`, {})
    }
}

//获取当前用户消息
export function deleteNews(id) {
    return $delete(`news/${id}`)
}

// 群聊发送消息
export function sendChat(data) {
    return fetch({
        url: '/groupchat/',
        method: "post", // 请求方法
        data: data
    });
}



// 文件发送消息--新接口 2020-4-13
export function newSendChat(projectId, content, publicId, publicType, mentionIdList) {
    return fetch({
        url: '/groupchat/',
        method: "post", // 请求方法
        params: {
            projectId: projectId,
            content: content,
            publicId: publicId,
            publicType: publicType,
            mentionIdList: mentionIdList,
        }
    });
}

//用户消息设为已读
export function readNews(id, isRead) {
    return $put(`news/${id}/read`, {
        "isRead": isRead
    })
}

// 获取群聊消息
export function getChat(projectId) {
    return fetch({
        url: '/groupchat',
        method: "get", // 请求方法
        params: {
            projectId: projectId
        }
    });
}
// 撤回群聊消息
export function recall(chatId, projectId) {
    return fetch({
        url: `/groupchat/${chatId}/revoke`,
        method: "put", // 请求方法
        params: {
            projectId: projectId
        }
    });
}

// 获取近期的事儿 -日程
export function nearThing() {
    return fetch({
        url: '/me/recentThing',
        method: "get", // 请求方法
    });
}
// 获取近期的事儿 -任务
export function nearThingByTask() {
    return fetch({
        url: '/me/recentThingByTask',
        method: "get", // 请求方法
    });
}

// 获取我的任务信息并且排序
export function getMeTask(isDone, order, type, pageSize, pageNum) {
    return fetch({
        url: '/me/task',
        method: "get", // 请求方法
        params: {
            isDone: isDone,
            order: order,
            type: type,
            pageSize: pageSize,
            pageNum: pageNum
        }
    });
}

// 获取我的日程信息
export function getMeAfterSchedule() {
    return fetch({
        url: 'me/schedule/after',
        method: "get", // 请求方法
    });
}

// 获取和我有关的日程月份信息
export function getMonth() {
    return fetch({
        url: 'me/schedule/before',
        method: "get" // 请求方法
    });
}

/**
 * 根据月份获取过去的日程
 */
export function getScheduleByMonth(month) {
    return fetch({
        url: `me/schedule/${month}`,
        method: "get" // 请求方法
    });
}

/**
 * 获取我创建的或我参与的文件
 */
export function getMeFile(order, type) {
    return fetch({
        url: `me/file`,
        method: "get", // 请求方法
        params: {
            order: order,
            type: type
        }
    });
}

/**
 * 获取我创建的或我参与的文件--下载
 */
export function getMeDown(memberId) {
    return fetch({
        url: `/files/getIsDownload/${memberId}`,
        method: "get", // 请求方法
    });
}




/**
 * 获取我的收藏数据
 * @param order
 */
export function collectList(type) {
    console.log(type)
    return fetch({
        url: `collections`,
        method: "get", // 请求方法
        params: {
            collectType: type
        }
    });
}

export function weChatLogin(url) {
    return $get(`/wechatcode`, {
        redirectUri: url
    })
}

export function getWeChatToken(code) {
    return fetch({
        url: `/wechattoken`,
        method: "get", // 请求方法
        params: {
            code: code
        }
    });
}

export function bindWx(code, userId) {
    return $post(`/bind/wechat`, {
        code: code,
        userId: userId
    })
}

export function notBindWx(userId) {
    return $post(`/notbind/wechat`, {
        userId: userId
    })
}
// 修改任务分组名称
export function changRelationName(data) {
    return $post(`/relations/updateGroupName`, {
        relationId: data.id,
        newName: data.name
    })
}



export function delRelationName(groupId) {
    return $delete(`relations/${groupId}/group`, {})
}


export function group(projectId) {
    return $get(`relations/${projectId}/groups`, '')

}

export function addGroup(projectId, groupName) {
    return $post(`relations/${projectId}/group`, {
        groupName: groupName
    })
}

export function changeGroup(groupId, projectId) {
    return $put(`members/${groupId}/group`, {
        projectId: projectId
    })
}

//获取项目下全部角色
export function getAllRoles(projectId) {
    return $get(`pro_role/${projectId}`)
}

//获取项目下全部角色--分配角色使用
export function getMemRoles(data) {
    return $get('pro_role/for_member', {
        "userId": data.userId,
        "orgId": data.orgId,
        "projectId": data.projectId

    })
}
//分配项目下用户角色
export function updateUserRole(data) {
    return $post('/proRoleUser', data)
}


//项目下新增角色
export function addRole(data) {
    return $post('/pro_role', data)
}
//更新项目下角色
export function updateRole(roleId, roleName, roleDes, roleKey) {
    return $put(`/pro_role/${roleId}`, {
        "roleName": roleName,
        "roleDes": roleDes,
        "roleKey": roleKey
    })
}

//删除项目下角色
export function deleteRole(roleId, projectId) {
    return $delete(`/pro_role/${roleId}`, {
        "projectId": projectId
    })
}
//设置默认角色
export function defaultRole(roleKey, projectId) {
    return $put('/pro_role/default', {
        "roleKey": roleKey,
        "orgId:": orgId
    })
}
//获取项目下所有资源
export function getAllPower(roleId) {
    return $get(`/pro_res/${roleId}`)
}
//更新项目下角色权限
export function changePower(roleId, ids) {
    return $put(`/pro_res_role/${roleId}/edit_resource`, {
        "resources": ids
    })
}
//更新企业下角色权限
export function changeOrgPower(roleId, ids) {
    return $put(`/resource_role/${roleId}/edit_resource`, {
        "resources": ids
    })
}

//切换个人/企业项目时候使用
export function userOrgRoles(userId, orgId) {
    return $get('/roles', {
        "userId": userId,
        "orgId": orgId
    })
}
export function updateOrgUserRole(roleId, userId, orgId) {
    return $put(`/roles/${roleId}/update`, {
        "userId": userId,
        "orgId": orgId
    })
}

export function removeOrgUser(userId, orgId, memberId) {
    return $delete('/organization/members', {
        "orgId": orgId,
        "userId": userId,
        "memberId": memberId
    })
}

export function checkPermission(orgId) {
    return $get('/organization/members/check/member_visible', {
        "orgId": orgId
    })
}


export function $post(url, params) {
    return fetch({
        url: url,
        method: "post", // 请求方法
        data: params
    });
}

function $get(url, params) {
    return fetch({
        url: url,
        method: "get", // 请求方法
        params: params
    });
}

// 修改任务执行者
export function taskExecutor(taskId, executor) {
    return fetch({
        url: `${api.tasks}/${taskId}/executor`,
        method: "put", // 请求方法
        params: {
            executor: executor
        }
    });
}

// 修改任务备注
export function updateTaskRemarks(taskId, data) {
    return fetch({
        url: `${api.tasks}/${taskId}/remarks`,
        method: "put", // 请求方法
        params: {
            remarks: data
        }
    });
}

//获取用户未读消息数
export function getNewsCount() {
    return fetch({
        url: `/news/count`,
        method: "get" // 请求方法
    });
}

export function cancle(id, projectId, fromType, publicId) {
    return fetch({
        url: `/bindings/`,
        method: "delete", // 请求方法
        params: {
            "bindId": id,
            "projectId": projectId,
            "fromType": fromType,
            "publicId": publicId
        }
    });
}

function $put(url, params) {
    return fetch({
        url: url,
        method: "put", // 请求方法
        params: params
    });
}

function $delete(url, params) {
    return fetch({
        url: url,
        method: "delete", // 请求方法
        params: params
    });
}

/*
 * 添加标签并绑定
 * */
export function addTagBindFile(params) {
    return $post(`/files/addTagBindFile`, params)
    /*  fetch({
          url: `/files/addTagBindFile`,
          method: "post", // 请求方法
          params: {
              "fileId": fileId,
              "tagId": tagId
          }
      });*/
}

/*
 * 查询用户详情
 */
export function findUserInfo(userId) {
    return $get(`/getUserInfo/${userId}`)
    /*  fetch({
          url: `/files/addTagBindFile`,
          method: "post", // 请求方法
          params: {
              "fileId": fileId,
              "tagId": tagId
          }
      });*/
}

/*
 * 修改用户详情
 */
export function updateUserNews(param) {
    return fetch({
        url: `/updateUserInfo`,
        method: "post", // 请求方法
        params: param
    });
}

/*
 * 检测是否进入分组权限
 */

export function getIsGroupPower(groupId) {
    return fetch({
        url: `/relations/check_access/permissions`,
        method: "get", // 请求方法
        params: {
            "groupId": groupId,
        }
    });
}

//项目视图修改信息
export function changePassword(oldPassword, newPassword) {
    return fetch({
        url: `/change_password`,
        method: 'post', // 请求方法
        params: {
            'oldPassword': oldPassword,
            'newPassword': newPassword,
        }
    })
}


// 成员--最新动态-时间

export function dynamictime() {
    return fetch({
        url: `/projects/getYearOfAllMonth`,
        method: "get", // 请求方法
    });
}

// 成员--最新动态-列表

export function dynamiclist(memberId, orgId, time) {
    return fetch({
        url: `/projects/${memberId}/${orgId}/tasks/${time}`,
        method: "get", // 请求方法
    });
}

//成员任务安排

export function taskList(memberId, projectId, classify) {
    return fetch({
        url: `/tasks/${memberId}/getTaskInfoList/${projectId}`,
        method: "get",
        params: {
            classify: classify,
        }
    });
}


//成员日程

export function schedulesList(projectId, memberId, ) {
    return fetch({
        url: `/schedules/getScheduleList/${projectId}/${memberId}`,
        method: "get",
    });
}

// 已添加项目经历

export function IsexperienceList(memberId, organizationId) {
    return fetch({
        url: `/projects/getIsExperience/${organizationId}/${memberId}`,
        method: "get",
    });
}



//查询项目经历

export function experienceList(memberId, organizationId) {
    return fetch({
        url: `/projects/getExperience/${organizationId}/${memberId}`,
        method: "get",
    });
}
// 添加项目经历


export function addExperience(memberId, projectId, organizationId) {
    return fetch({
        url: `/projects/${memberId}/${projectId}/${organizationId}`,
        method: "put",
    });
}

// 删除项目经历


export function delExperience(memberId, projectId) {
    return fetch({
        url: `/projects/deleteExperience/${memberId}/${projectId}`,
        method: "delete",
    });
}

// 用户-任务-项目

export function userProjectTasks(orgId, memberId) {
    return fetch({
        url: `/tasks/${orgId}/getProjectsByMemberIdAndOrgId/${memberId}`,
        method: "get",
    });
}

//用户 任务

export function userTasksInit(memberId, projectId) {
    return fetch({
        url: `/tasks/${memberId}/getTasksByProjectIdAndMemberId/${projectId}`,
        method: "get",
    });
}
// 指派



export function setList(projectId) {
    return fetch({
        url: `/tasks/${projectId}/getExecutors`,
        method: "get",
    });
}

// 确定指派送



export function sureExecutor(taskId, executor) {
    return fetch({
        url: `/tasks/updateExecutor/${taskId}/${executor}`,
        method: "get",
    });
}

export function getUserInfo(orgId) {
    return fetch({
        url: `/organizations/getUserInfo/${orgId}`,
        method: 'get', // 请求方法
    })
}

export function getTeamInfo(orgId) {
    return fetch({
        url: `/organization/members/getMembers/${orgId}`,
        method: 'get', // 请求方法
    })
}

//新首页动态
export function getMyDynamic() {
    return fetch({
        url: `/me/getMyDynamic`,
        method: 'get', // 请求方法
    })
}

//创建项目获取模板
export function getTemplate(orgId) {
    return fetch({
        url: `/templates`,
        method: 'get', // 请求方法
        params: {
            orgId: orgId,
        }
    })
}

//项目邀请成员
export function proInviteMen(projectId, memberId) {
    return fetch({
        url: `/members/addMember1`,
        method: 'post', // 请求方法
        params: {
            projectId: projectId,
            memberId: memberId,
        }
    })
}


//通过链接使用其他账号加入项目
export function userExist(accountName) {
    return fetch({
        url: `/check_account_exist`,
        method: 'get', // 请求方法
        params: {
            accountName: accountName,
        }
    })
}
//链接邀请跳转页面获取 项目/企业邀请人信息
export function getInvitees(orgId,memberId,projectId) {
    return fetch({
        url: `/invite/getInviteMemberInfo/${memberId}`,
        method: 'get', // 请求方法
        params: {
            orgId:orgId,
            memberId:memberId,
            projectId:projectId
        }
    })
}

//注册并加入项目
export function registerJoin(data) {
    return fetch({
        url: `/register/projectMember`,
        method: 'post', // 请求方法
        params: data
    })
}

//注册并加入企业
export function registerJoinEnter(data) {
    return fetch({
        url: `/register/orgMember`,
        method: 'post', // 请求方法
        params: data
    })
}

//项目角色判断
export function roleJudgment(projectId) {
    return fetch({
        url: `/projects/judgmentRoles/${projectId}`,
        method: 'get', // 请求方法
        params: {
            projectId:projectId
        }
    })
}

//生成链接邀请成员
export function linkInvitation(orgId,projectId) {
    return fetch({
        url: `/organization/members/getOrganizationMemberByUrl`,
        method: 'get', // 请求方法
        params: {
            orgId:orgId,
            projectId:projectId
        }
    })
}

// 设置企业默认角色
export function enterDefaultRole(orgId, roleId) {
    return fetch({
        url: `roles/${orgId}/${roleId}/org_default_role`,
        method: "put", // 请求方法
    });
}


//根据条件筛选日志信息
export function getLoglist(orgId,data) {
    return fetch({
        url: `/logs/operatingLog/${orgId}`,
        method: 'get', // 请求方法
        params: data
    })
}


//解绑
export function notBindPhone() {
    return fetch({
        url: `/notBindPhone`,
        method: 'get', // 请求方法
    })
}

//判断当前用户是否是企业拥有者
export function userIsOwner(orgId) {
    return fetch({
        url: `/role_user/isOwner/${orgId}`,
        method: 'get', // 请求方法
    })
}

//根据条件筛选用户消息
export function userMessage(data) {
    return fetch({
        url: `/news/userNewsByCondition`,
        method: 'get', // 请求方法
        params:data
    })
}

//批量标注已读
export function batchReads(ids) {
    return fetch({
        url: `/news/changeIsRead`,
        method: 'get', // 请求方法
        params:{
            ids:ids,
            isRead:0
        }
    })
}

//批量标注已读
export function batchDel(ids) {
    return fetch({
        url: `/news/removeNewsByIds`,
        method: 'delete', // 请求方法
        params:{
            ids:ids,
        }
    })
}


//导出用户日志数据到导出表
export function ExportApplication(orgId,memberId,startTime,endTime) {
    return fetch({
        url: `/logs/expUser/${orgId}`,
        method: 'get', // 请求方法
        params:{
            memberId:memberId,
            startTime:startTime,
            endTime:endTime
        }
    })
}

//获取导出详情
export function getExportInfo() {
    return fetch({
        url: `/logs/getExportInfo`,
        method: 'get', // 请求方法
    })
}


//删除导出信息
export function deleteExpLog(id) {
    return fetch({
        url: `/logs/deleteLogInfo/${id}`,
        method: 'get', // 请求方法
    })
}

//导出日志信息
export function expUserLog(orgId,id) {
    return fetch({
        url: `/logs/exportLogByExcel`,
        method: 'get', // 请求方法
        responseType: 'blob',
        params:{
            orgId:orgId,
            id:id
        }
    })
}

//保存环信消息消息通知数量
export function saveWebIM(data) {
    return fetch({
        url: `/groupchat/save/ChatCount`,
        method: 'post', // 请求方法
        params: data
    })
}

//删除导出信息
export function selectTaskByExamples(example,groupId,projectId) {
    return fetch({
        url: `/tasks/selectTaskByExample`,
        method: 'get', // 请求方法
        params:{
            example:example,
            groupId:groupId,
            projectId:projectId
        }
    })
}

//根据条件筛选任务
export function searchTaskByExamples(param) {
    return fetch({
        url: `/tasks/searchTaskByExample`,
        method: 'post', // 请求方法
        data:param,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//工作台个人信息
export function workBenchInfo(data) {
    return fetch({
        url: `/workBenchInfo`,
        method: 'get', // 请求方法
        params:data
    })
}

//发布文章
export function article(data) {
    return fetch({
        url: `/article/add`,
        method: 'post', // 请求方法
        data: data
    })
}

//文章列表
export function allArtile(data) {
    return fetch({
        url: `/article/allArtile`,
        method: 'get', // 请求方法
        params: data
    })
}

//我关注人的文章列表
export function attentionListArticle(data) {
    return fetch({
        url: `/article/attentionListArticle`,
        method: 'get', // 请求方法
        params: data
    })
}


//粉丝和关注的人列表
export function allConnectionUser(data) {
    return fetch({
        url: `/article/allConnectionUser`,
        method: 'get', // 请求方法
        params: data
    })
}

//分类列表
export function articleClass(data) {
    return fetch({
        url: `/articleClass/list`,
        method: 'get', // 请求方法
        params: data
    })
}

//关注/取关
export function attentionUserStatus(data) {
    return fetch({
        url: `/article/attentionUserStatus`,
        method: 'get', // 请求方法
        params: data
    })
}

//我的文章列表
export function myArticle(data) {
    return fetch({
        url: `/article/myArticle`,
        method: 'get', // 请求方法
        params: data
    })
}

//删除我的文章
export function deleteArticle(data) {
    return fetch({
        url: `/article/deleteArticle`,
        method: 'get', // 请求方法
        params: data
    })
}


//编辑我的文章
export function editArticle(data) {
    return fetch({
        url: `/article/edit`,
        method: 'post', // 请求方法
        data: data
    })
}

//文章评论列表
export function commentList(data) {
    return fetch({
        url: `/comment/commentListByArticleId`,
        method: 'get', // 请求方法
        params: data
    })
}


//发表评论
export function commentAdd(data) {
    return fetch({
        url: `/comment/add`,
        method: 'get', // 请求方法
        params: data
    })
}

//根据文章id查询评论列表
export function commentListByArticleId(data) {
    return fetch({
        url: `/comment/commentListByArticleId`,
        method: 'get', // 请求方法
        params: data
    })
}

//移除评论
export function removeComment(data) {
    return fetch({
        url: `/comment/remove`,
        method: 'get', // 请求方法
        params: data
    })
}

//需求分类列表
export function demandClass(data) {
    return fetch({
        url: `/demandClass/list`,
        method: 'get', // 请求方法
        params: data
    })
}

//发布需求
export function demandAdd(data) {
    return fetch({
        url: `/demand/add`,
        method: 'post', // 请求方法
        data: data
    })
}

//需求列表
export function demandList(data) {
    return fetch({
        url: `/demand/list`,
        method: 'get', // 请求方法
        params: data
    })
}


//编辑需求
export function demandEdit(data) {
    return fetch({
        url: `/demand/edit`,
        method: 'post', // 请求方法
        data: data
    })
}

//删除需求
export function demandRemove(data) {
    return fetch({
        url: `/demand/remove`,
        method: 'get', // 请求方法
        params: data
    })
}

//保存问答
export function questionAdd(data) {
    return fetch({
        url: `/question/add`,
        method: 'post', // 请求方法
        data: data
    })
}

//分页查询所有提问列表
export function questionList(data) {
    return fetch({
        url: `/question/listAll`,
        method: 'get', // 请求方法
        params: data
    })
}

//回答问题保存接口
export function replyAdd(data) {
    return fetch({
        url: `/reply/add`,
        method: 'post', // 请求方法
        data: data
    })
}

//问答回答列表
export function getReplyListByQuetionId(data) {
    return fetch({
        url: `/reply/getReplyListByQuetionId`,
        method: 'get', // 请求方法
        params: data
    })
}