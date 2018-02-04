import request from '../utils/request';
const req = (url, params) => request(url, {
    method: 'POST',
    body: {
      ...params
    },
});

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

/*==============system user=================*/
export async function addUser(params) {
  return req('/hospitalCRM/user/addUser.do', params);
}
export async function editUser(params) {
  return req('/hospitalCRM/user/editUser.do', params);
}
export async function getUser(params) {
  return req('/hospitalCRM/user/userInfo', params);
}