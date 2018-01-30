import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });

// 问卷列表
export async function queryWJs(params) {
  return req('/questionnaire/callwjList.do', params);
}

// 问卷详情 
export async function getQuestionnaire(params) {
  return req('/questionnaire/callQuestionInfo.do', params);
}

// 问卷随访模版
export async function getWJTplList(params) {
  return req('/questionnaire/wjTemplateList.do', params);
}


