//工作量模块接口
import request from '@/utils/request';
//添加工作量数据
export function createTeachWorkload(data) {
    return request({
        url: '/teachWorkload/add',
        method: 'post',
        data: Object.assign({},data)
    })
}
//用户获取自己的工作量模块清单
export function getOwnTeachWorkload(jobID) {
    return request({
        url:'/teachWorkload/getOwn',
        method:'get',
        params: {jobID}
    })
}
//修改某条工作量清单数据
export function updateTeachWorkload(data) {
    return request({
        url:'/teachWorkload/update',
        method:'put',
        data: Object.assign({},data)
    })
}
//删除某条数据单
export function deleteTeachWorkload(data) {
    return request({
        url:'/teachWorkload/delete',
        method:'delete',
        data
    })
}
//获取所有工作量模块数据清单
export function getAllTeachWorkload(data) {
    return request({
        url:'/teachWorkload/getAll',
        method:'get',
        params: {data}
    })
}
//获取某一条数据单的基本数据
export function getBaseFormData(_id) {
    return request({
        url: '/teachWorkload/getBase',
        method:'get',
        params:{_id}
    })
}