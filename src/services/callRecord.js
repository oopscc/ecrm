import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
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
  return req('/callRecord/waitCallCount.do', params);
}

export async function getWillCallNum(params) {
  return req('/callRecord/willCallNum.do', params);
}
// 待随访患者
export async function getWillCallList(params) {
  return req('/callRecord/willCallPageQuery.do', params);
}
// 今日已随访患者
export async function getTodayCallList(params) {
  return req('/callRecord/todayCallPageQuery.do', params);
}
// 总已随访患者
export async function getCallList(params) {
  return req('/callRecord/calledPageQuery.do', params);
}

// 保存随访记录
export async function saveCallRes(params) {
  return req('/callRecord/savePhoneCallResult.do', params);
}
