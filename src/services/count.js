import { stringify } from 'qs';
import request from '../utils/request';

export async function getExample(params) {
  return request(`/api/get?${stringify(params)}`);
}

export async function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

const req = (url, params) => request(url, {
    method: 'POST',
    body: {
        ...params
    },
});
// 满意度数据
export async function fetchMyd(params) {
    return req('/hospitalCRM/satisfaction/chartList.do', params);
}
// 生存率数据
export async function fetchScl(params) {
    return req('/hospitalCRM/satisfaction/countList.do', params);
}

// 首页数据
export async function indexHeader(params) {
  return req('/hospitalCRM/statTemplate/statisticsFollowNumber.do', params);
}

export async function indexTrend(params) {
  return req('/hospitalCRM/statTemplate/statisticsCallTrend.do', params);
}

export async function indexPie(params) {
  return req('/hospitalCRM/statTemplate/statisticsCallResult.do', params);
}

