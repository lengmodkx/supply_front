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