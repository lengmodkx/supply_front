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
export function getPieSource(projectId) {
    return fetch({
        url: `${api.statistics}/getPieSource/${projectId}`,
        method: "get"
    });
}

/**
 * 柱状图详细数据集
 * @param projectId
 */
export function getHistogramSource(projectId) {
    return fetch({
        url: `${api.statistics}/getHistogramSource/${projectId}`,
        method: "get"
    });
}


/**
 * 任务燃尽图详细数据集
 * @param projectId
 */
export function getBurnoutSource(projectId) {
    return fetch({
        url: `${api.statistics}/getBurnoutSource/${projectId}`,
        method: "get"
    });
}




/**
 * 累计图详细数据集
 * @param projectId
 */
export function getAddSource(projectId) {
    return fetch({
        url: `${api.statistics}/getAddSource/${projectId}`,
        method: "get"
    });
}