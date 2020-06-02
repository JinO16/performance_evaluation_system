//教研模块岗位权重设置接口
import request from '@/utils/request';
//添加接口
export function createXsgzStation(data) {
    return request({
        url: '/xsgzStationSet/add',
        method: 'post',
        data:Object.assign({},data)
    })
}
//获取所有信息接口
export function getXsgzStation(data) {
    return request({
        url:'/xsgzStationSet/getAll',
        method:'get',
        data
    })
}
//修改接口
export function updateStation(data) {
    return request({
        url: '/xsgzStationSet/update',
        method:'put',
        data: Object.assign({},data)
    })
}