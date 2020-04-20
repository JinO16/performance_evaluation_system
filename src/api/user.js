import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
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