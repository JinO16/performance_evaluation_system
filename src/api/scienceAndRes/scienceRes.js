//科研考评模块接口
import request from '@/utils/request'
//添加科研考评数据
export function createScienceRes(data) {
    return request({
        url: '/scienceRes/add',
        method: 'post',
        data: Object.assign({}, data)
    })
}
//用户获取自己的科研考评模块清单
export function getOwnScienceRes(jobID) {
    return request({
        url:'/scienceRes/getOwn',
        method:'get',
        params:{ jobID }
    })
}
//删除某一条科研考评清单
export function deleteScienceRes(data) {
    return request({
        url:'/scienceRes/delete',
        method:'delete',
        data
    })
}
//修改某条数据
export function updateScienceRes(data) {
    return request({
        url: '/scienceRes/update',
        method: 'put',
        data: Object.assign({}, data)
    })
}
//获取所有的科研考评清单

export function getAllScienceRes(data) {

    return request({

        url: '/scienceRes/getAll',

        method: 'get',

        params: {data}

    })
}