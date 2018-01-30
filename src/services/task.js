import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });
// 随访任务列表
export async function getTaskList(params) {
  return req('/callTask/taskInfoList.do', params);
}
// 待随访任务列表
export async function waitCallTask(params) {
  return req('/callTask/waitCallTask.do', params);
}
// 生成随访任务
export async function saveTask(params) {
  return req('/callTask/createTask.do', params);
}
// 随访任务详情
export async function getTask(params) {
  return req('/callTask/taskInfo.do', params);
}

// 删除随访任务
export async function deleteTask(params) {
  return req('/callTask/deleteTask.do', params);
}
