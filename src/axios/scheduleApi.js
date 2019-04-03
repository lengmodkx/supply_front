import fetch from "./fetch"; // 引用fetch.js
import api from "./url"; // 引用url.js

// 根据id获取日程
export function getRicheng(scheduleId) {
    return fetch({
        url: `/schedules/${scheduleId}`,
        method: "get"
    });
}
// 更新日程名称
export function upRichengName(scheduleId, scheduleName) {
    return fetch({
        url: `/schedules/${scheduleId}/schedule_name`,
        method: "put",
        params: {scheduleName:scheduleName}
    });
}
// 设置 开始日期
export function beginDate(scheduleId, startTime) {
    return fetch({
        url: `/schedules/${scheduleId}/starttime`,
        method: "put",
        params: {startTime:startTime}
    });
}
// 设置 结束日期
export function endDate(scheduleId, endTime) {
    return fetch({
        url: `/schedules/${scheduleId}/endtime`,
        method: "put",
        params: {endTime:endTime}
    });
}
// 改变重复规则
export function changeRepeat(scheduleId, repeat) {
    return fetch({
        url: `/schedules/${scheduleId}/repeat`,
        method: "put",
        params: {repeat:repeat}
    });
}
// 改变提醒规则
export function changeRemind(scheduleId, remind) {
    return fetch({
        url: `/schedules/${scheduleId}/remind`,
        method: "put",
        params: {remind:remind}
    });
}
// 改变地点
export function changeAddress(scheduleId, address) {
    return fetch({
        url: `/schedules/${scheduleId}/address`,
        method: "put",
        params: {address:address}
    });
}
// 改变备注
export function changeRemarks(scheduleId, remarks) {
    return fetch({
        url: `/schedules/${scheduleId}/remarks`,
        method: "put",
        params: {remarks:remarks}
    });
}
// 更新日程参与者
export function playPeople(scheduleId, memberIds) {
    return fetch({
        url: `/schedules/${scheduleId}/memberIds`,
        method: "put",
        params: {memberIds:memberIds}
    });
}
// 复制日程
export function copyRc(scheduleId,projectId) {
    return fetch({
        url: `/schedules/${scheduleId}/copy`,
        method: "post",
        params: {projectId:projectId}
    });
}
// 移动日程
export function removeRc(scheduleId,projectId) {
    return fetch({
        url: `/schedules/${scheduleId}/move`,
        method: "put",
        params: {projectId:projectId}
    });
}
// 移动到回收站
export function recycleRc(scheduleId) {
    return fetch({
        url: `/schedules/${scheduleId}/recyclebin`,
        method: "put"
    });
}
// 更新隐私模式
export function privacy(scheduleId,privacy) {
    return fetch({
        url: `/schedules/${scheduleId}/privacy`,
        method: "put",
        params: {privacy:privacy}
    });
}
function $post(url, params) {
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