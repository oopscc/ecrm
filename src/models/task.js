import {
  waitTasks,
  saveTask,
  getTask,
  getTaskPatients,
  deleteTask
} from '../services/task';

export default {
  namespace: 'task',

  state: {
    tasks: {
      notBeginNum: 0,
      goingNum: 0,
      list: [],
      pagination: {}
    },
    waitTasks: {
      notBeginNum: 0,
      goingNum: 0,
      list: [],
      pagination: {}
    },
    taskInfo: {

    },
    patientList: {
      list: [],
      pagination: {}
    },
    taskNum: {
      willCount: 10,
      counted: 20 
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(waitTasks, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveTask({ payload, callback }, { call, put }) {
      const response = yield call(saveTask, payload);
      if (callback) callback();
    },
    *getTask({ payload, callback }, { call, put }) {
      const response = yield call(getTask, payload);
      yield put({
        type: 'saveTaskInfo',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getTaskPatients({ payload, callback }, { call, put }) {
      const response = yield call(getTaskPatients, payload);
      yield put({
        type: 'savePatientList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteTask, payload);
      if (callback) callback(response);
    },
    *fetchWaitTasks({ payload }, { call, put }) {
      const response = yield call(waitCallTask, payload);
      yield put({
        type: 'saveWaitTasks',
        payload: response,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(waitCallTask, payload);
      yield put({
        type: 'saveSearchRes',
        payload: response,
      });
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        tasks: {
          notBeginNum: action.payload.notBeginNum,
          goingNum: action.payload.goingNum,
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveWaitTasks(state, action) {
      return {
        ...state,
        waitTasks: {
          notBeginNum: action.payload.notBeginNum,
          goingNum: action.payload.goingNum,
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveTaskInfo(state, action) {
      return {
        ...state,
        taskInfo: {
          ...action.payload.data
        },
      };
    },
    savePatientList(state, action) {
      return {
        ...state,
        patientList: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        }
      };
    },
    saveSearchRes(state, action) {
      return {
        ...state,
        taskNum: {
          ...state.taskNum,
          // ...action.payload.data
        }
      };
    },
  },
};

