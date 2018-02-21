import {
    queryWJs,
    getWJTplList,
    addQuestionnaireTpl,
    editQuestionnaireTpl,
    getQuestionnaireTpl,
    deleteQuestionnaireTpl,
    getWJ,
    submitWJ,
} from '../services/questionnaire';
import {
    message
} from 'antd';

export default {
    namespace: 'quest',

    state: {
        data: {
            list: [],
            pagination: {}
        },
        tplList: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryWJs, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *get({ payload, callback }, { call, put }) {
            const response = yield call(getQuestionnaireTpl, payload);
            if (callback) callback(response);
        },
        *edit({ payload, callback }, { call, put }) {
            const response = yield call(editQuestionnaireTpl, payload);
            if (callback) callback(response);
        },
        *add({ payload, callback }, { call, put }) {
            const response = yield call(addQuestionnaireTpl, payload);
            if (callback) callback(response);
        },
        *delete({ payload, callback }, { call, put }) {
            const response = yield call(deleteQuestionnaireTpl, payload);
            yield put({
                type: 'deleteTplById',
                payload,
            });
            message.success('删除成功');
            if (callback) callback(response);
        },
        *fetchTpls({ payload }, { call, put }) {
            const response = yield call(getWJTplList, payload);
            yield put({
                type: 'saveTpls',
                payload: response,
            });
        },
        *getWJ({ payload, callback }, { call, put }) {
            const response = yield call(getWJ, payload);
            if (callback) callback(response);
        },
        *submitWJ({ payload, callback }, { call, put }) {
            const response = yield call(submitWJ, payload);
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
        saveTpls(state, action) {
            return {
                ...state,
                tplList: {
                    list: action.payload.data.rows,
                    pagination: {
                        pageSize: action.payload.data.pageSize,
                        currentPage: action.payload.data.currentPage,
                        total: action.payload.data.total
                    }
                },
            };
        },
        deleteTplById(state, action) {
            const { id } = action.payload;
            return {
                ...state,
                tplList: {
                    ...state.tplList,
                    list: [...state.tplList.list.filter(item => item.id != id)],
                },
            };
        },
    },
};

