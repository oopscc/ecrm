import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });

export async function getSmsList(params) {
  return req('/smsMessage/getSmsList.do', params);
}

export async function sendSms(params) {
  return req('/smsMessage/sendSms.do', params);
}

export async function getTplList(params) {
  return req('/smsMessage/smsTemplateList.do', params);
}


