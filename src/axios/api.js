import fetch from "./fetch"; // 引用fetch.js
import api from "./url"; // 引用url.js

// 所有发请求的方法：
// 收藏
export function collect(data) {
    return fetch({
        url: '/collections',
        method: "post",
        data: data
    });
}
// 发送消息
export function sendMsg(data) {
    return fetch({
        url: '/logs/chat',
        method: "post",
        data: data
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
export function getPhone(accountName, userId) {
    return fetch({
        url: '/code',
        method: "get",
        params: {
            'phone': accountName,
            'userId': userId
        }
    });
}
//通过手机获取验证码

export function getPhoneCode(phone) {
    return fetch({
        url: '/message/code',
        method: "post",
        params: {
            'phone': phone,
        }
    });
}

//绑定手机号

export function bindPhone(phone,code,userId,nickName) {
    return fetch({
        url: '/bind/phone',
        method: "post",
        params: {
            'phone': phone,
            'code': code,
            'userId':userId,
            'nickName':nickName
        }
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
        params: {projectId:projectId}
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
        params: {
            'projectName': data.projectName,
            'projectDes': data.projectDes,
            'isPublic': data.isPublic,
            'projectDel': data.projectDel,
            'projectStatus': data.projectStatus,
            'projectCover': data.projectCover
        }
    });
}
// 搜索项目
export function searchProjects(projectName, condition) {
    return fetch({
        url: '/projects/seach',
        method: "get", // 请求方法
        params: {
            projectName: projectName,
            condition: condition
        }
    });
}
//获取项目列表
export function getProjectList() {
    return fetch({
        url: api.projects,
        method: "get", // 请求方法
        params: {}
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
//点击项目进入任务主页
export function enterTask(projectId, name) {
    return fetch({
        url: `${api.projects}/${projectId}/tasks`,
        method: "get", // 请求方法
        params: {
            name: name
        }
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
export function taskToRecycle(taskId) {
    debugger
    return $put(`/tasks/${taskId}/recyclebin`);
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
export function delTag(tagId) {
    return $delete(`/tags/${tagId}`, null);
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
export function completeTask(taskId, label) {
    if (label) {
        var l = {
            label: label
        }
    }
    return fetch({
        url: `${api.tasks}/${taskId}/finish`,
        method: "put", // 请求方法
        params: l
    });
}
//取消完成任务
export function cancelcompleteTask(taskId, taskStatus) {
    if (taskStatus) {
        var l = {
            label: taskStatus
        }
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
export function schedules(projectId) {
    return $get(`/schedules/`, projectId);
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
export function recycleShare(shareId, projectId) {
    return $put(`/shares/${shareId}/recyclebin`, {
        projectId: projectId
    });
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
export function files(params) {
    return $get("/files", params);
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
    if (!data) {
        return $get(`news`, {
            isRead: data.isRead
        })
    } else {
        return $get(`news`, {})
    }
}

//获取当前用户消息
export function deleteNews(id) {
    return $delete(`news/${id}`)
}

// 群聊发送消息
export function sendChat(projectId, content, files) {
    console.log(">>>3", files);
    return fetch({
        url: '/groupchat/',
        method: "post", // 请求方法
        params: {
            projectId: projectId,
            content: content,
            files: files
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

// 获取近期的事儿
export function nearThing() {
    return fetch({
        url: '/me/recentThing',
        method: "get", // 请求方法
    });
}

// 获取我的任务信息并且排序
export function getMeTask(isDone, order, type) {
    return fetch({
        url: '/me/task',
        method: "get", // 请求方法
        params: {
            isDone: isDone,
            order: order,
            type: type
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
 * 获取我创建的文件
 */
export function getMeFile(order) {
    return fetch({
        url: `me/file`,
        method: "get", // 请求方法
        params: {
            order: order
        }
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

export function weChatLogin() {
    return fetch({
        url: `/wechatcode`,
        method: "get" // 请求方法
    });
}

export function getWeChatToken(code) {
    return fetch({
        url: `/wechattoken`,
        method: "get", // 请求方法
        params:{code:code}
    });
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
