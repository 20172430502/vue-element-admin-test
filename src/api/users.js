import request from '@/utils/request'

export function _getUsers(params) {
  return request({
    url: 'users',
    method: 'get',
    params
  })
}
export function _editUser(data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}
export function updataUser(_url, data) {
  return request({
    url: `users/${_url}`,
    method: 'put',
    data
  })
}
export function _change(uId,state){
  return request({
    url: `users/${uId}/state/${state}`,
    method: 'put'
  })
}
export function _edit(uId){
  return request({
    url: `users/${uId}`,
    method: 'get'
  })
}
export function _confirm(uId){
  return request({
    url: `users/${uId}`,
    method: 'delete'
  })
}
export function _allotRoles(){
  return request({
    url: `roles`,
    method: 'get'
  })
}
export function _editCurrentRole(uId,data){
  return request({
    url: `users/${uId}/role`,
    method: 'put',
    data
  })
}