//科研成果奖励模块接口
import request from '@/utils/request'
//添加科研考评数据
export function createSciAchievement(data) {
    return request({
        url: '/sciAchievement/add',
        method: 'post',
        data: Object.assign({}, data)
    })
}
//用户获取自己的科研考评模块清单
export function getOwnSciAchievement(jobID) {
    return request({
        url:'/sciAchievement/getOwn',
        method:'get',
        params:{ jobID }
    })
}
//删除某一条科研考评清单
export function deleteSciAchievement(data) {
    return request({
        url:'/sciAchievement/delete',
        method:'delete',
        data
    })
}
//修改某条数据
export function updateSciAchievement(data) {
    return request({
        url: '/sciAchievement/update',
        method: 'put',
        data: Object.assign({}, data)
    })
}
//获取所有的科研考评清单
export function getAllSciAchievement(data) {
    return request({
        url: '/sciAchievement/getAll',
        method: 'get',
        params: {data}
    })
}