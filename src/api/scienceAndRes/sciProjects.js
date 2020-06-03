//科研立项模块接口
import request from '@/utils/request'
//添加科研考评数据
export function createSciProjects(data) {
    return request({
        url: '/sciProjects/add',
        method: 'post',
        data: Object.assign({}, data)
    })
}
//用户获取自己的科研考评模块清单
export function getOwnSciProjects(jobID) {
    return request({
        url:'/sciProjects/getOwn',
        method:'get',
        params:{ jobID }
    })
}
//删除某一条科研考评清单
export function deleteSciProjects(data) {
    return request({
        url:'/sciProjects/delete',
        method:'delete',
        data
    })
}
//修改某条数据
export function updateSciProjects(data) {
    return request({
        url: '/sciProjects/update',
        method: 'put',
        data: Object.assign({}, data)
    })
}
//获取所有的科研考评清单

export function getAllSciProjects(data) {

    return request({

        url: '/sciProjects/getAll',

        method: 'get',

        params: {data}

    })
}