import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });

export async function queryWJs(params) {
  return req('/questionnaire/callwjList.do', params);
}

// export async function addCallRecord(params) {
//   return req('/questionnaire/addCallRecord.do', params);
// }

export async function getQuestionnaire(params) {
  return req('/questionnaire/callQuestionInfo.do', params);
}

export async function getWJTplList(params) {
  return req('/questionnaire/wjTemplateList.do', params);
}


