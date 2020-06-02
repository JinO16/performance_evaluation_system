//教研模块岗位权重设置接口
import request from '@/utils/request';
//添加接口
export function createZygxStation(data) {
    return request({
        url: '/zygxStationSet/add',
        method: 'post',
        data:Object.assign({},data)
    })
}
//获取所有信息接口
export function getZygxStation(data) {
    return request({
        url:'/zygxStationSet/getAll',
        method:'get',
        data
    })
}
//修改接口
export function updateStation(data) {
    return request({
        url: '/zygxStationSet/update',
        method:'put',
        data: Object.assign({},data)
    })
}