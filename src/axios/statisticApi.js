import fetch from "./fetch";
import api from "./url";

/**
 * 饼图数据
 **/
export function getPieDate(projectId){
    return fetch({
        url:`${api.statistics}/getPieChart/${projectId}`,
        method: "get"
    });
}

/**
 * 饼图详细数据集
 * @param projectId
 */
    export function getPieSource(projectId,data) {

    return fetch({
        url: `${api.statistics}/getPieSource/${projectId}/${data}`,
        method: "get",
    });
}

/**
 * 柱状图详细数据集
 * @param projectId
 */
export function getHistogramSource(projectId,data) {
    return fetch({
        url: `${api.statistics}/getHistogramSource/${projectId}/${data}`,
        method: "get"
    });
}


/**
 * 任务燃尽图详细数据集
 * @param projectId
 */
export function getBurnoutSource(projectId,data) {
    return fetch({
        url: `${api.statistics}/getBurnoutSource/${projectId}/${data}`,
        method: "get"
    });
}




/**
 * 累计图详细数据集
 * @param projectId
 */
export function getAddSource(projectId,data) {
    return fetch({
        url: `${api.statistics}/getAddSource/${projectId}/${data}`,
        method: "get"
    });
}

/**
 * 获取统计数据概览
 * @param projectId
 */
export function getCountData(projectId,data) {
    return fetch({
        url: `${api.statistics}/getCountData/${projectId}/${data}`,
        method: "get"
    })


}/**
 * 获取统计数据概览
 * @param projectId
 * @param divName
 * @param data
 */
export function getCountTable(projectId,divName,data) {
    return fetch({
        url: `${api.statistics}/getCountTable/${projectId}/${divName}/${data}`,
        method: "get"
    })
}