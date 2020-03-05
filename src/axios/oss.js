import {
    getOssSign
} from './api.js'

let accessid = ''
let policyBase64 = ''
let signature = ''
let callbackbody = ''
let key = ''
let expire = 0
let host = ''
let g_object_name = ''
let now = Date.parse(new Date()) / 1000;
// 生成随机字符串
function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// 获取用户上传原始文件名
function get_file_name(filename) {
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

// 把随机生成的字符串拼接在原始上传文件名后面生成新的唯一文件名
function set_file_name(filename) {
    let suffix = get_file_name(filename)
    g_object_name = key + random_string(10) + suffix
    return ''
}

export function oss(filename, level, parentId, projectId) {
    //调用后端服务器接口获取签名信息，利用axios返回promise，可以链式调用
    return new Promise(resolve => {
        getOssSign().then(res => {
            if (res.result == 1) {
                policyBase64 = res.data.policy
                accessid = res.data.accessId
                signature = res.data.signature
                expire = parseInt(res.data.expire)
                callbackbody = res.data.callback
                host = res.data.host
                key = res.data.dir
                if (filename != null) {
                    set_file_name(filename)
                }
                // 返回表单上传需要的参数信息
                resolve({
                    'host': host,
                    'key': g_object_name,
                    'policy': policyBase64,
                    'OSSAccessKeyId': accessid,
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'callback': callbackbody,
                    'signature': signature,
                    'x:user_id': localStorage.userId,
                    'x:name': filename,
                    'x:project_id': projectId,
                    'x:parent_id': parentId,
                    'x:level': level
                });
            }
        });
    })
}