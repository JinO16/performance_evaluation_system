import request from '@/utils/request'
//添加级别信息
export function createLevel(data) {
    return request({
        url: '/level/add',
        method: 'post',
        data: Object.assign({}, data)
    })
};
//获得所有的级别
export function getAllLevel(data) {
    return request({
        url: '/level/getAll',
        method:'get',
        data
    })
};
//修改级别
export function updateLevel(data) {
    return request({
        url:'/level/update',
        method:'post',
        data:Object.assign({}, data)
    })
};
//删除级别
export function deleteLevel (data) {
    return request({
        url:'/level/delete',
        method:'delete',
        data
    })
}
