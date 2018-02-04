import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, params) => request(url, {
  method: 'POST',
  body: {
    ...params
  },
});

// 患者随访历史记录列表，转移
// export async function queryCallRecords(params) {
//   return req('/callRecord/patientCallRecord.do', params);
// }


// export async function addCallRecord(params) {
//   return req('/callRecord/addCallRecord.do', params);
// }

// export async function getCallRecord(params) {
//   return req('/callRecord/getCallRecordInfo.do', params);
// }

// export async function editCallRecord(params) {
//   return req('/callRecord/editCallRecord.do', params);
// }


export async function getWaitCallCount(params) {
  return req('/hospitalCRM/callRecord/waitCallCount.do', params);
}

export async function getWillCallNum(params) {
  return req('/hospitalCRM/callRecord/willCallNum.do', params);
}
// 待随访患者
export async function getWillCallList(params) {
  return req('/hospitalCRM/callRecord/willCallPageQuery.do', params);
}
// 今日已随访患者
export async function getTodayCallList(params) {
  return req('/hospitalCRM/callRecord/todayCallPageQuery.do', params);
}
// 总已随访患者
export async function getCallList(params) {
  return req('/hospitalCRM/callRecord/calledPageQuery.do', params);
}

// TODO 获得电话随访的各种信息
export async function getCallData(params) {
  return req('/hospitalCRM/callRecord/getPhonePageData.do', params);
}

// 保存随访记录
export async function saveCallRes(params) {
  return req('/hospitalCRM/callRecord/savePhoneCallResult.do', params);
}
