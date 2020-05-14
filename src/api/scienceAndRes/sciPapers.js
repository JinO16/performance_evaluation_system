//科研考评模块接口
import request from '@/utils/request'
//添加科研考评数据
export function createSciPapers(data) {
    return request({
        url: '/sciPapers/add',
        method: 'post',
        data: Object.assign({}, data)
    })
}
//用户获取自己的科研考评模块清单
export function getOwnSciPapers(jobID) {
    return request({
        url:'/sciPapers/getOwn',
        method:'get',
        params:{ jobID }
    })
}
//删除某一条科研考评清单
export function deleteSciPapers(data) {
    return request({
        url:'/sciPapers/delete',
        method:'delete',
        data
    })
}
//修改某条数据
export function updateSciPapers(data) {
    return request({
        url: '/sciPapers/update',
        method: 'put',
        data: Object.assign({}, data)
    })
}
//获取所有的科研考评清单

export function getAllSciPapers(data) {

    return request({

        url: '/sciPapers/getAll',

        method: 'get',

        params: {data}

    })
}