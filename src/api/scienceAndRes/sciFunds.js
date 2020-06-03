//科研经费模块接口
import request from '@/utils/request';
//添加科研经费数据
export function createSciFunds(data) {
    return request({
        url: '/sciFunds/add',
        method: 'post',
        data: Object.assign({},data)
    })
}
//用户获取自己的科研经费模块清单
export function getOwnSciFunds(jobID) {
    return request({
        url:'/sciFunds/getOwn',
        method:'get',
        params: {jobID}
    })
}
//修改某条科研经费清单数据
export function updateSciFunds(data) {
    return request({
        url:'/sciFunds/update',
        method:'put',
        data: Object.assign({},data)
    })
}
//删除某条数据单
export function deleteSciFunds(data) {
    return request({
        url:'/sciFunds/delete',
        method:'delete',
        data
    })
}
//获取所有科研经费模块数据清单
export function getAllSciFunds(data) {
    return request({
        url:'/sciFunds/getAll',
        method:'get',
        params: {data}
    })
}
//获取某一条数据单的基本数据
export function getBaseFormData(_id) {
    return request({
        url: '/sciFunds/getBase',
        method:'get',
        params:{_id}
    })
}
//根据部门获取所有本部门的清单
export function getByDepartment(department) {
    return request({
        url: '/sciFunds/getByDepartment',
        method: 'get',
        params: {department}
    })
}