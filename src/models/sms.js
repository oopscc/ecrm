import {
  getSmsList,
  sendSms,
  getTplList,
  sendWJSms
} from '../services/sms';

import {message} from 'antd';
export default {
  namespace: 'sms',

  state: {
    data: {
      list: [],
    },
    tplList: {
      list: [],
    }
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getSmsList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *send({ payload, callback }, { call, put }) {
      const response = yield call(sendSms, payload);
      if (callback) callback();
    },
    *sendWJSms({ payload, callback }, { call, put }) {
        const response = yield call(sendWJSms, payload);
        if (response && !response.result) {
            message.success('提交请求成功');
        }
        if (callback) callback(response);
      },

    *fetchTpls({ payload }, { call, put }) {
      const response = yield call(getTplList, payload);
      yield put({
        type: 'saveTpls',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.smsArray,
        },
      };
    },
    saveTpls(state, action) {
      return {
        ...state,
        tplList: {
          list: action.payload.data.smsArray,
        },
      };
    },
  },
};

