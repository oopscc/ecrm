import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, params) => request(url, {
    method: 'POST',
    body: {
      ...params
    },
  });
// 待随访任务列表
export async function waitTasks(params) {
  return req('/hospitalCRM/callTask/waitCallTask.do', params);
}
// 生成随访任务
export async function saveTask(params) {
  return req('/hospitalCRM/callTask/createTask.do', params);
}
// 随访任务详情
export async function getTask(params) {
  return req('/hospitalCRM/callTask/taskInfo.do', params);
}
// 随访任务患者列表
export async function getTaskPatients(params) {
  return req('/hospitalCRM/callTask/taskInfoList.do', params);
}


// 删除随访任务
export async function deleteTask(params) {
  return req('/hospitalCRM/callTask/deleteTask.do', params);
}
