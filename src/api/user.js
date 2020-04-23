import request from '@/utils/request'
//登录接口
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: Object.assign({},data)
  })
}
//用户登录获取该用户信息接口
export function getInfo(token) {
  return request({
    url: '/user/getInfo',
    method: 'get',
    params: { token }
  })
}
//退出登录接口
export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: token 
  })
}
//添加用户接口
export function createUser(data) {
  return request({
    url: '/user/add',
    method:'post',
    data:Object.assign({}, data)
  })
}
//获取所有用户接口
export function getAllUser(data) {
  console.log('获取用户接口data--->',data)
  return request({
    url: '/user/getAll',
    method:'get',
    data:Object.assign({}, data)
  })
}
//修改用户信息接口
export function updateUser(data) {
  return request({
    url: '/user/update',
    method:'put',
    data:Object.assign({}, data)
  })
}
//删除用户信息接口
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method:'delete',
    data
  })
}