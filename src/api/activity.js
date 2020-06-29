import request from '@/utils/request'

export function activityList(data) {
  return request({
    url: '/activity/page',
    method: 'get',
    params: data
  })
}
export function changeStatusApi(id) {
  return request({
    url: '/activity/disabled/' + id,
    method: 'put'
  })
}
export function saveActivity(data) {
  return request({
    url: 'activity/',
    method: 'post',
    data
  })
}
export function deleteActivity(id) {
  return request({
    url: 'activity/' + id,
    method: 'delete'
  })
}
export function activityDetail(id) {
  return request({
    url: 'app/activity/' + id,
    method: 'get'
  })
}
export function updateDetail(data) {
  return request({
    url: 'activity/update/',
    method: 'put',
    data
  })
}
