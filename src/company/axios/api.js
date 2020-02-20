import fetch from '@/axios/fetch'
//获取企业下全部角色
export function getAllRoles(orgId){
    return $get(`pro_role/${orgId}`)
}

//获取企业下全部角色--分配角色使用
export function getMemRoles(orgId,userId){
    return $get('pro_role/for_member',{"orgId":orgId,"userId":userId})
}
//分配企业下用户角色
export function updateUserRole(data){
    return $post('/proRoleUser',data)
}

//企业下新增角色
export function addRole(data){
    return $post('/pro_role',data)
}
//更新企业下角色
export function updateRole(roleId,roleName,roleDes,roleKey){
    return $put(`/pro_role/${roleId}`,{"roleName":roleName,"roleDes":roleDes,"roleKey":roleKey})
}

//删除企业下角色
export function deleteRole(roleId,orgId){
    return $delete(`/pro_role/${roleId}`,{"orgId":orgId})
}
//设置默认角色
export function defaultRole(roleKey,orgId){
    return $put('/pro_role/default',{"roleKey":roleKey,"orgId":orgId})
}
//获取企业下所有资源
export function getAllPower(roleId){
    return $get(`/pro_res/${roleId}`)
}
//更新企业下角色权限
export function changePower(roleId,ids){
    return $put(`/pro_res_role/${roleId}/edit_resource`,{"resources":ids})
}
//获取企业信息
export function orgInfo(orgId){
    return $get('/organizations',{'orgId':orgId})
}

//更新企业信息
export function updateOrg(orgId,data){
    return $put(`/organizations/${orgId}`,data)
}

//删除企业信息
export function delOrg(orgId,data){
    return $delete(`/organizations/${orgId}`,data)
}
//获取移交
export function getAllTransfer(orgId){
    return $get(`/organization/members/getMembers/${orgId}`)
}


//移交
export function postTransfer(orgId,ownerId,userId){
    return $post('/organization/members/transferOwner',{"orgId":orgId,"ownerId":ownerId,"userId":userId})
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