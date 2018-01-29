import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, prrams) => request('url', {
    method: 'POST',
    body: {
      ...params
    },
  });

export async function waitCallTask(params) {
  return req('/callTask/waitCallTask.do', params);
}

export async function saveTask(params) {
  return req('/callTask/createTask.do', params);
}

export async function getTask(params) {
  return req('/callTask/taskInfo.do', params);
}

export async function getTaskList(params) {
  return req('/callTask/taskInfoList.do', params);
}

export async function deleteTask(params) {
  return req('/callTask/deleteTask.do', params);
}
