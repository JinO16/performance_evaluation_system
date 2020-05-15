//教学工程和其他模块接口
import request from '@/utils/request';
//添加教学工程和其他模块数据
export function createTeachPro (data) {
    return request({
        url:'/teachPro/add',
        method: 'post',
        data: Object.assign({},data)
    })
}
//用户获取自己的教学工程和其他模块数据
export function getOwnTeachPro (jobID) {
    return request({
        url: '/teachPro/getOwn',
        method: 'get',
        params: {jobID}
    })
}
//修改某一条数据
export function updateTeachPro (data) {
    return request ({
        url: '/teachPro/update',
        method:'put',
        data: Object.assign({},data)
    })
}
//删除某条数据
export function deleteTeachPro (data) {
    return request ({
        url:'/teachPro/delete',
        method:'delete',
        data
    })
}
//获取所有数据
export function getAllTeachPro (data) {
    return request({
        url:'/teachPro/getAll',
        method:'get',
        params: {data}
    })
}