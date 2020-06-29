import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: 'meeting/page',
    method: 'get',
    params: data
  })
}

export function deleteMeeting(id) {
  return request({
    url: 'meeting/' + id,
    method: 'delete'
  })
}
export function fetchDetail(id) {
  return request({
    url: 'meeting/detail/' + id,
    method: 'get'
  })
}

export function updateMeeting(data) {
  return request({
    url: 'meeting/update',
    method: 'put',
    data
  })
}

export function createMeeting(data) {
  return request({
    url: 'meeting',
    method: 'post',
    data
  })
}

export function changeStatus(id) {
  return request({
    url: 'meeting/disabled/' + id,
    method: 'put'
  })
}

export function venueList(data) {
  return request({
    url: 'meetingPlace/page',
    method: 'get',
    params: data
  })
}

export function addVenue(data) {
  return request({
    url: 'meetingPlace',
    method: 'post',
    data
  })
}

export function updateVenue(data) {
  return request({
    url: 'meetingPlace/update',
    method: 'put',
    data
  })
}
export function deleteVenue(id) {
  return request({
    url: 'meetingPlace/' + id,
    method: 'delete'
  })
}

// app user
export function fetchPersonList(data) {
  return request({
    url: 'appUser/page',
    method: 'get',
    params: data
  })
}

export function addPerson(data) {
  return request({
    url: 'appUser',
    method: 'post',
    data
  })
}
export function getDicItinerary() {
  return request({
    url: 'dic/itinerary',
    method: 'get'
  })
}

export function changPersonStatus(id) {
  return request({
    url: 'appUser/disabled/' + id,
    method: 'put'
  })
}
export function deletePerson(id) {
  return request({
    url: 'appUser/' + id,
    method: 'delete'
  })
}
export function changeWriteOff(id) {
  return request({
    url: 'appUser/writeOff/' + id,
    method: 'put'
  })
}

export function updatePersonApi(data) {
  return request({
    url: 'appUser/update/',
    method: 'put',
    data
  })
}
