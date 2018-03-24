import {
    waitTasks,
    saveTask,
    getTask,
    getTaskPatients,
    deleteTask
} from '../services/task';
import { getWaitCallCount as waitCallTask } from '../services/callRecord'

export default {
    namespace: 'task',

    state: {
        tasks: {
            notBeginNum: 0,
            goingNum: 0,
            isAdmin: 0,
            isSelf: 0,
            userName: '',
            list: [],
            pagination: {}
        },
        waitTasks: {
            notBeginNum: 0,
            goingNum: 0,
            userName: '',
            isAdmin: 0,
            isSelf: 0,
            list: [],
            pagination: {}
        },
        taskInfo: {

        },
        patientList: {
            isAdmin: 0,
            isSelf: 0,
            list: [],
            pagination: {}
        },
        taskNum: {
            waitCallCount: 0
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
        //  查找待随访患者数量
        *search({ payload }, { call, put }) {
            const response = yield call(waitCallTask, payload);
            yield put({
                type: 'saveSearchRes',
                payload: response,
            });
        },
        // 保存随访任务
        *saveTask({ payload, callback }, { call, put }) {
            const response = yield call(saveTask, payload);
            if (callback) callback(response);
        },

    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                tasks: {
                    ...action.payload.data,
                    notBeginNum: action.payload.data.notBeginNum,
                    goingNum: action.payload.data.goingNum,
                    isAdmin: action.payload.data.isAdmin,
                    userName: action.payload.data.userName,
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
                    ...action.payload.data,
                    notBeginNum: action.payload.data.notBeginNum,
                    goingNum: action.payload.data.goingNum,
                    userName: action.payload.data.userName,
                    isAdmin: action.payload.data.isAdmin,
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
                    ...action.payload.data,
                    isAdmin: action.payload.data.isAdmin,
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
                    ...action.payload.data
                }
            };
        },
    },
};

