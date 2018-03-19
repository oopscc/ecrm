import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, params) => request(url, {
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

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function fakeRegister(params) {
    return request('/api/register', {
        method: 'POST',
        body: params,
    });
}

export async function queryNotices() {
    return request('/api/notices');
}


export async function fakeAccountLogin(params) {
    return request('/hospitalCRM/user/login.do', {
        method: 'POST',
        body: params,
    });
}

export async function queryPatients(params) {
    return request('/hospitalCRM/patient/allPatientList.do', {
        method: 'POST',
        body: {
            ...params
        },
    });
}

export async function addPatient(params) {
    return request('/hospitalCRM/patient/addPatient.do', {
        method: 'POST',
        body: {
            ...params
        },
    });
}

export async function editPatient(params) {
    return request('/hospitalCRM/patient/editPatient.do', {
        method: 'POST',
        body: {
            ...params
        },
    });
}

export async function getPatient(params) {
    return request('/hospitalCRM/patient/patientInfo.do', {
        method: 'POST',
        body: {
            ...params
        },
    });
}

// 住院信息
export async function queryDiagnoses(params) {
    return request('/hospitalCRM/patient/diagnosePageQuery.do', {
        method: 'POST',
        body: {
            ...params
        },
    });
}

// 增加诊断信息
export async function addDiagnose(params) {
    return request('/hospitalCRM/patient/addDiagnoseInfo.do', {
        method: 'POST',
        body: {
            ...params
        },
    });
}

export async function getDiagnose(params) {
    return req('/hospitalCRM/patient/getDiagnoseInfo.do', params);
}

export async function editDiagnose(params) {
    return req('/hospitalCRM/patient/editDiagnoseInfo.do', params);
}

// 患者随访历史
export async function queryFlupList(params) {
    return req('/hospitalCRM/callRecord/patientCallRecord.do', params);
}

export async function addFlup(params) {
    return req('/hospitalCRM/callRecord/addCallRecord.do', params);
}

export async function getFlup(params) {
    return req('/hospitalCRM/callRecord/getCallRecordInfo.do', params);
}

export async function editFlup(params) {
    return req('/hospitalCRM/callRecord/editCallRecord.do', params);
}

export async function batchImport(params) {
    return request('/hospitalCRM/patient/imoprtExcelPatientList.do', {
        method: 'formdata',
        body: params,
    });
}
export async function batchExport(params) {
    return request('/hospitalCRM/patient/exportPatientList.do', {
        method: 'get',
        body: {
            ...params
        },
    });
}
export async function batchUpHistory(params) {
    return request('/hospitalCRM/patient/uploadCallRecordExcel.do', {
        method: 'formdata',
        body: params,
    });
}



