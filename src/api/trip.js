import request from '@/utils/request'

export function fetchTripList(data) {
  return request({
    url: '/itinerary/page',
    method: 'get',
    params: data
  })
}
export function fetchaAddTrip(data) {
  return request({
    url: '/itinerary',
    method: 'post',
    data
  })
}

export function deleteTrip(id) {
  return request({
    url: '/itinerary/' + id,
    method: 'delete'
  })
}

export function fetchDetail(id) {
  return request({
    url: 'itinerary/detail/' + id,
    method: 'get'
  })
}
export function fetchDicMeeting() {
  return request({
    url: 'dic/meeting',
    method: 'get'
  })
}
export function fetchDateList(data) {
  return request({
    url: 'itinerary/date/page',
    method: 'get',
    params: data
  })
}
export function saveDate(data) {
  return request({
    url: 'itinerary/date/save',
    method: 'post',
    data
  })
}
export function fetchTimeList(data) {
  return request({
    url: 'itinerary/detail/page',
    method: 'get',
    params: data
  })
}
export function saveTime(data) {
  return request({
    url: 'itinerary/detail/save',
    method: 'post',
    data
  })
}
export function deleteDateApi(id) {
  return request({
    url: 'itinerary/date/' + id,
    method: 'delete'
  })
}
export function deleteTimeApi(id) {
  return request({
    url: 'itinerary/detail/' + id,
    method: 'delete'
  })
}
export function updateDateApi(data) {
  return request({
    url: '/itinerary/date/update',
    method: 'put',
    data
  })
}
export function updateTimeApi(data) {
  return request({
    url: '/itinerary/detail/update',
    method: 'put',
    data
  })
}
export function updateTrip(data) {
  return request({
    url: '/itinerary/update',
    method: 'put',
    data
  })
}
