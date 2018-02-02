import {
  waitCallTask,
  saveTask,
  getTask,
  getTaskList,
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
    patientList: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTaskList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(saveTask, payload);
      if (callback) callback();
    },
    *getTask({ payload, callback }, { call, put }) {
      const response = yield call(getTask, payload);
      yield put({
        type: 'savePatientList',
        payload: response,
      });
      if (callback) callback();
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
    }
  },
};

