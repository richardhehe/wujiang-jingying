import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'user/page',
    method: 'get',
    params: query
  })
}

export function fetchChangeStatus(id) {
  return request({
    url: 'user/disabled/' + id,
    method: 'put'
    // params: { id }
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
    // params: { pv }
  })
}
export function getMeetingTree() {
  return request({
    url: 'meeting/tree',
    method: 'get'
    // params: { pv }
  })
}
