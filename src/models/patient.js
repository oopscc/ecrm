import {
  queryPatients,
  addPatient,
  getPatient,
  editPatient,
  queryDiagnoses,
  addDiagnose,
  getDiagnose,
  editDiagnose,
  queryFlupList,
  addFlup,
  getFlup,
  editFlup,

} from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'patient',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    diagnosesData: {
      list: [],
      pagination: {}
    },
    diagnoseInfo: {
    },
    flup: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPatients, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPatient, payload);
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editPatient, payload);
      if (callback) callback();
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getPatient, payload);
      if (callback) callback(response);
    },
    *fetchDiagnose({ payload }, { call, put }) {
      const response = yield call(queryDiagnoses, payload);
      yield put({
        type: 'saveDiagnoses',
        payload: response,
      });
    },
    *addDiagnose({ payload, callback }, { call, put }) {
      const response = yield call(addDiagnose, payload);
      yield put(routerRedux.push('/patient/diagnoseInfo/result'));
      if (callback) callback();
    },
    *editDiagnose({ payload, callback }, { call, put }) {
      const response = yield call(editDiagnose, payload);
      yield put(routerRedux.push('/patient/diagnoseInfo/result'));
      if (callback) callback();
    },
    *getDiagnose({ payload, callback }, { call, put }) {
      const response = yield call(getDiagnose, payload);
      yield put({
        type: 'saveDiagnoseInfo',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 患者随访历史纪录
    *fetchFlupList({ payload }, { call, put }) {
      const response = yield call(queryFlupList, payload);
      yield put({
        type: 'saveFlup',
        payload: response,
      });
    },
    *addFlup({ payload, callback }, { call, put }) {
      const response = yield call(addFlup, payload);
      console.log(response)
      yield put(routerRedux.push('/patient/diagnoseInfo/result'));
      if (callback) callback();
    },
    *editFlup({ payload, callback }, { call, put }) {
      const response = yield call(editFlup, payload);
      if (callback) callback();
    },
    *getFlup({ payload, callback }, { call, put }) {
      const response = yield call(getFlup, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveDiagnoses(state, action) {
      return {
        ...state,
        diagnosesData: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveDiagnoseInfo(state, action) {
      return {
        ...state,
        diagnoseInfo: {
          ...state.diagnoseInfo,
          ...action.payload.data
        },
      };
    },
    saveFlup(state, action) {
      return {
        ...state,
        flup: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
  },
};

