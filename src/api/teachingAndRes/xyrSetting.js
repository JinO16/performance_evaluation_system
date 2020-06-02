//教研模块岗位权重设置接口
import request from '@/utils/request';
//添加接口
export function createXyrStation(data) {
    return request({
        url: '/xyrStationSet/add',
        method: 'post',
        data:Object.assign({},data)
    })
}
//获取所有信息接口
export function getXyrStation(data) {
    return request({
        url:'/xyrStationSet/getAll',
        method:'get',
        data
    })
}
//修改接口
export function updateStation(data) {
    return request({
        url: '/xyrStationSet/update',
        method:'put',
        data: Object.assign({},data)
    })
}