import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}


export async function queryPatients(params) {
  return request('/patient/allPatientList.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addPatient(params) {
  return request('/patient/addPatient.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editPatient(params) {
  return request('/patient/editPatient.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getPatient(params) {
  return request('/patient/patientInfo.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 住院信息
export async function queryDiagnoses(params) {
  return request('/patient/diagnosePageQuery.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 增加诊断信息
export async function addDiagnose(params) {
  return request('/patient/addDiagnoseInfo.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getDiagnose(params) {
  return req('/patient/getDiagnoseInfo.do', params);
}

export async function editDiagnose(params) {
  return req('/patient/editDiagnoseInfo.do', params);
}


// 待随访患者 
 
// 已随访患者


// TODO 获得电话随访的各种信息
export async function getCallData(params) {
  return req('/patient/getPhonePageData.do', params);
}






