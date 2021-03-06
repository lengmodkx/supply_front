import fetch from "./fetch"; // 引用fetch.js

// 查询企业列表
export function getAllOrg() {
    return fetch({
        url: '/organizations/my_org',
        method: "get",
    });
}
// 获取企业下的所有项目
export function getAllProject(orgId) {
    return fetch({
        url: `/organizations/${orgId}`,
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
// 搜索 全部成员
export function searchMembers(phone, orgId) {
    return fetch({
        url: `/organization/members/${phone}/user`,
        method: "get",
        params: {
            orgId: orgId
        }
    });
}

// 搜索 企业成员
export function searchOrgMembers(phone, orgId, projectId) {
    return fetch({
        url: `/organization/members/${phone}/searchOrgUser`,
        method: "get",
        params: {
            orgId: orgId,
            projectId: projectId
        }
    });
}


// 添加企业成员/部门成员
export function addPeople(data) {
    return fetch({
        url: '/organization/members',
        method: "post",
        data: data
    });
}
// 初始化企业成员信息  查询信息
export function initOrgMember(orgId, flag) {
    return fetch({
        url: `/organization/members/${orgId}`,
        method: "get",
        params: {
            'pageSize': 9999,
            'flag': flag ? flag : 0,
        }
    });
}

// 初始化企业成员信息  查询信息 新 add2020/6/23
export function initOrgMemberNew(orgId, flag,memberLabel) {
    return fetch({
        url: `/organization/members/${orgId}/getOrgPartment`,
        method: "get",
        params: {
            'flag': flag,
            memberLabel:memberLabel
        }
    });
}

//部门角色筛选
export function getOrgPartmentByMemberLebel(orgId, partmentId, flag, memberLabel) {
    return fetch({
        url: `/organization/members/getOrgPartmentByMemberLebel`,
        method: "get",
        params: {
            'orgId': orgId,
            'partmentId': partmentId,
            'memberLabel': memberLabel,
            'flag': flag,
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
// 获取子部门
export function getSonBranchs(partmentId) {
    return fetch({
        url: `/partments/${partmentId}/sub`,
        method: "get",
    });
}
// 添加部门成员
export function addBranchPeople(partmentId, data) {
    return fetch({
        url: `/partment_members/${partmentId}/add`,
        method: "post",
        data: data
    });
}

// 移除部门成员
export function removeBranchPeople(partmentId, data) {
    return fetch({
        url: `/partment_members/${partmentId}/member`,
        method: "delete",
        params: data
    });
}
// 更新部门 （更改部门名称）
export function changeBranchNames(partmentId, params) {
    return fetch({
        url: `/partments/${partmentId}`,
        method: "put",
        params: params
    });
}
// 删除部门
export function deleteBranch(partmentId) {
    return fetch({
        url: `/partments/${partmentId}`,
        method: "delete",
    });
}
// 获取所有群组
export function getGroups(orgId) {
    return fetch({
        url: `/organization_group/${orgId}`,
        method: "get",
    });
}
// 创建群组
export function addGroup(orgId, data) {
    return fetch({
        url: `/organization_group/${orgId}`,
        method: "post",
        data: data
    });
}
// 获取某个群组下的成员
export function getGroupPeople(groupId) {
    return fetch({
        url: `/organization_group_member/${groupId}`,
        method: "get",
    });
}
// 添加群组成员
export function addGroupPeople(groupId, memberId,chatGroupId) {
    return fetch({
        url: `/organization_group_member/${groupId}`,
        method: "post",
        data: {
            memberId: memberId,
            chatGroupId:chatGroupId
        }
    });
}
// 改变群组名称
export function changeGroupsname(groupId, groupName,chatGroupId) {
    return fetch({
        url: `/organization_group/${groupId}`,
        method: "put",
        params: {
            groupName: groupName,
            chatGroupId:chatGroupId
        }
    });
}
// 删除群组
export function deleteGroup(groupId,chatGroupId) {
    return fetch({
        url: `/organization_group/${groupId}`,
        method: "delete",
        params: {
            chatGroupId:chatGroupId
        }
    });
}


export function getDepartmentTree(orgId, departmentId) {
    return fetch({
        url: `/partments/tree`,
        method: "post",
        data: {
            orgId: orgId,
            departmentId: departmentId
        }
    });
}

export function lockUser(orgId, userId, lock) {
    return fetch({
        url: `/organization/members/${orgId}/lock`,
        method: "put",
        params: {
            userId: userId,
            lock: lock
        }
    });
}

//判断被邀请人电话号或邮箱是否注册过账号
export function verifyPhone(orgId, data) {
    return fetch({
        url: `/organization/members/checkMemberIsRegister/${orgId}`,
        method: 'get', // 请求方法
        params: data
    })
}

//根据电话号/邮箱邀请企业成员
export function invitation(orgId, data) {
    return fetch({
        url: `/organization/members/inviteOrgMemberByPhone/${orgId}`,
        method: 'get', // 请求方法
        params: data
    })
}

// 链接邀请登录添加企业成员/部门成员
export function linkaddPeople(data) {
    return fetch({
        url: '/organization/members/addMember1',
        method: "post",
        data: data
    });
}

export function groupRemoval(groupId, memberId) {
    return fetch({
        url: `/organization_group_member/${groupId}/member`,
        method: "delete", // 请求方法
        params: {
            memberId: memberId
        }
    });
}

//搜索部门
export function searchDepartment(keyWord,orgId) {
    return fetch({
        url: `/partments/searchOrgByKeyWord/${orgId}`,
        method: 'get', // 请求方法
        params: {
            keyWord: keyWord
        }
    })
}

//聊天添加好友  环信
export function addFriend(accountName,buddyAccountName) {
    return fetch({
        url: `/addBuddyByAccountName`,
        method: 'get', // 请求方法
        params: {
            accountName:accountName,
            buddyAccountName:buddyAccountName
        }
    })
}