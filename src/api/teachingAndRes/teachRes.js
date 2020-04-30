//教学教研模块接口
import request from '@/utils/request'
//添加教学教研数据
export function createTeachRes(data) {
    return request({
        url: '/teachRes/add',
        method: 'post',
        data: Object.assign({}, data)
    })
}
//用户获取自己的教学教研模块清单
export function getOwnTeachRes(jobID) {
    return request({
        url:'/teachRes/getOwn',
        method:'get',
        params:{ jobID }
    })
}
//删除某一条教学教研清单
export function deleteTeachRes(data) {
    return request({
        url:'/teachRes/delete',
        method:'delete',
        data
    })
}
//修改某条数据
export function updateTeachRes(data) {
    return request({
        url: '/teachRes/update',
        method: 'put',
        data: Object.assign({}, data)
    })
}
//获取所有的教学教研清单
export function getAllTeachRes(data) {
    return request({
        url: '/teachRes/getAll',
        method: 'get',
        params: {data}
    })
}