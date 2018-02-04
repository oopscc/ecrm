import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, params) => request(url, {
    method: 'POST',
    body: {
      ...params
    },
  });
// 短信随访历史
export async function getSmsList(params) {
  return req('/hospitalCRM/smsMessage/getSmsList.do', params);
}
// 发送短信
export async function sendSms(params) {
  return req('/hospitalCRM/smsMessage/sendSms.do', params);
}
// 短信随访模版
export async function getTplList(params) {
  return req('/hospitalCRM/smsMessage/smsTemplateList.do', params);
}
