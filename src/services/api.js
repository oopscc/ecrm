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

export async function queryDiagnoses(params) {
  return request('/patient/diagnosePageQuery.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/*
data
  name
  patientCode
  currentPage
  pageSize
  total
  rows
      id
      String
      ●
      诊断信息id
      patientCode
      String
      ●
      病案号
      name
      String
      ●
      病人姓名
      diagnoseTimeStr
      String
      ●
      诊断时间 yyyy-MM-dd
      diagnoseDept
      String
      ●
      诊断科别
      admissionNumber
      Int
      ●
      患者住院次数
      admissionTimeStr
      String
      ●
      患者入院时间 yyyy-MM-dd
      admissionDept
      String
      ●
      入院科别
      diagnoseName
      String

      主要诊断
      treatmentDoctor
      String
      ●
      主治医师
      outTimeStr
      String
      ●
      患者出院时间 yyyy-MM-dd
      outDept
      String
      ●
      出院科别
*/ 

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

// TODO 获得电话随访的各种信息
export async function getCallData(params) {
  return req('/patient/getPhonePageData.do', params);
}






