import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, params) => request(url, {
    method: 'POST',
    body: {
        ...params
    },
});

// 问卷模版列表
export async function fetchWJTpls(params) {
    return req('/hospitalCRM/questionnaire/wjTemplateList.do', params);
}

// 短信模版列表
export async function fetchSMSTpls(params) {
    return req('/hospitalCRM/smsMessage/getSmsList.do', params);
}

// 科室列表
export async function fetchDepts(params) {
    return req('/hospitalCRM/dept/deptLikeList.do', params);
}

// 人员
export async function fetchUsers(params) {
    return req('/hospitalCRM/user/userLikeList.do', params);
}

// 病种列表
export async function fetchDiseases(params) {
    return req('/hospitalCRM/diseaseKind/diseaseLikeList.do', params);
}


// 患者状态
export async function fetchPStates(params) {
    return req('/hospitalCRM/patient/patientStateList.do', params);
}

// 付费方式
export async function fetchPays(params) {
    return req('/hospitalCRM/patient/payModeList.do', params);
}

// 麻醉方式
export async function fetchAnesthesias(params) {
    return req('/hospitalCRM/patient/anesthesiaModeList.do', params);
}

// 治疗方式
export async function fetchCures(params) {
    return req('/hospitalCRM/patient/cureModeList.do', params);
}

// 随访结果
export async function fetchCallRes(params) {
    return req('/hospitalCRM/patient/callResultList.do', params);
}

// 医生职务
export async function fetchDuties(params) {
    return req('/hospitalCRM/user/dutyList.do', params);
}

// 职称
export async function fetchJobs(params) {
    return req('/hospitalCRM/user/jobList.do', params);
}

// 医生
export async function fetchDoctors(params) {
    return req('/hospitalCRM/user/doctorList.do', params);
}

// 护士
export async function fetchNurses(params) {
    return req('/hospitalCRM/user/nurseList.do', params);
}
// 统一
export async function fetchCategory(params) {
    return req('/hospitalCRM/patient/categoryList.do', params);
}



