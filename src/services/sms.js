import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });
// 短信随访历史
export async function getSmsList(params) {
  return req('/smsMessage/getSmsList.do', params);
}
// 发送短信
export async function sendSms(params) {
  return req('/smsMessage/sendSms.do', params);
}
// 短信随访模版
export async function getTplList(params) {
  return req('/smsMessage/smsTemplateList.do', params);
}
