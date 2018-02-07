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
    return req('/hospitalCRM/user/userInfo.do', params);
}
export async function fetchUsers(params) {
    return req('/hospitalCRM/user/userList.do', params);
}

/*==============system depts=================*/
export async function addDept(params) {
    return req('/hospitalCRM/dept/addDept.do', params);
}
export async function editDept(params) {
    return req('/hospitalCRM/dept/editDept.do', params);
}
export async function deleteDept(params) {
    return req('/hospitalCRM/dept/deleteDept.do', params);
}
export async function fetchDepts(params) {
    return req('/hospitalCRM/dept/deptPageQuery.do', params);
}

/*==============system Diseases=================*/
export async function addDisease(params) {
    return req('/hospitalCRM/diseaseKind/addDisease.do', params);
}
export async function editDisease(params) {
    return req('/hospitalCRM/diseaseKind/editDisease.do', params);
}
export async function deleteDisease(params) {
    return req('/hospitalCRM/diseaseKind/deleteDisease.do', params);
}
export async function fetchDiseases(params) {
    return req('/hospitalCRM/diseaseKind/DiseasePageQuery.do', params);
}

/*==============system icd-10=================*/
export async function addICD(params) {
    return req('/hospitalCRM/illnessCoding/addIllnessCoding.do', params);
}
export async function editICD(params) {
    return req('/hospitalCRM/illnessCoding/editIllnessCoding.do', params);
}
export async function deleteICD(params) {
    return req('/hospitalCRM/illnessCoding/deleteIllnessCoding.do', params);
}
export async function getICD(params) {
    return req('/hospitalCRM/illnessCoding/getIllnessInfo.do', params);
}
export async function fetchICDs(params) {
    return req('/hospitalCRM/illnessCoding/illnessPageQuery.do', params);
}