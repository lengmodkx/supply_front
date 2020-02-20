import fetch from "./fetch";
import api from "./url";

/**
 * 饼图数据
 **/
export function getPieDate(projectId) {
    return $get(`${api.statistics}/getPieChart/${projectId}`)
}

/**
 * 饼图详细数据集
 * @param projectId
 */
export function getPieSource(projectId, data) {
    return $get(`${api.statistics}/getPieSource/${projectId}`, {
        "data": data
    })
}

/**
 * 柱状图详细数据集
 * @param projectId
 */
export function getHistogramSource(projectId, data) {
    return $get(`${api.statistics}/getHistogramSource/${projectId}`, {
        "data": data
    })
}


/**
 * 任务燃尽图详细数据集
 * @param projectId
 */
export function getBurnoutSource(projectId, data) {
    return $get(`${api.statistics}/getBurnoutSource/${projectId}`, {
        "data": data
    })
}




/**
 * 累计图详细数据集
 * @param projectId
 */
export function getAddSource(projectId, data) {
    return $get(`${api.statistics}/getAddSource/${projectId}`, {
        "data": data
    })
}

/**
 * 获取统计数据概览
 * @param projectId
 */
export function getCountData(projectId, data) {
    return $get(`${api.statistics}/getCountData/${projectId}`, {
        "data": data
    })
}
/**
 * 获取统计数据概览
 * @param projectId
 * @param divName
 * @param data
 */
export function getCountTable(projectId, divName, data) {
    return $get(`${api.statistics}/getCountTable/${projectId}/${divName}`, {
        "data": data
    })
}

function $get(url, params) {
    return fetch({
        url: url,
        method: "get", // 请求方法
        params: params
    });
}