import {
    query as queryUsers, queryCurrent,
    addUser,
    editUser,
    getUser,
    fetchUsers,
    editUserLock,
    resetPassword,
    updateRole,
    activateUser
} from '../services/user';
import { setAuthority, getUserName } from '../utils/authority';

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {},
        users: {
            list: [],
            pagination: { pageSize: 10, current: 0 }
        },
    },

    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(queryUsers);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *fetchCurrent(_, { call, put }) {
            // const response = yield call(queryCurrent);
            const username = getUserName();
            yield put({
                type: 'saveCurrentUser',
                payload: {username},
            });
        },
        *getUser({ payload, callback }, { call, put }) {
            const response = yield call(getUser, payload);
            if (callback) callback(response);
        },
        *addUser({ payload, callback }, { call, put }) {
            const response = yield call(addUser, payload);
            if (callback) callback(response);
        },
        *editUser({ payload, callback }, { call, put }) {
            const response = yield call(editUser, payload);
            if (callback) callback(response);
        },
        *fetchUsers({ payload, callback }, { call, put }) {
            const response = yield call(fetchUsers, payload);
            yield put({
                type: 'saveUsers',
                payload: response,
            });
        },
        *editUserLock({ payload, callback }, { call, put }) {
            const response = yield call(editUserLock, payload);
            callback && callback(response);
            if (!response || +response.result) {return}
            yield put({
                type: 'updateUsers',
                payload,
            });
        },
        *resetPassword({ payload, callback }, { call, put }) {
            const response = yield call(resetPassword, payload);
            callback && callback(response);
        },
        *updateRole({ payload, callback }, { call, put }) {
            const response = yield call(updateRole, payload);
            if (!response || +response.result) {return}
            yield put({
                type: 'updateUsers',
                payload: response,
            });
        },
        *activateUser({ payload, callback }, { call, put }) {
            const response = yield call(activateUser, payload);
            yield put({
                type: 'saveUsers',
                payload: response,
            });
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload,
                },
            };
        },
        saveUsers(state, action) {
            return {
                ...state,
                users: {
                    list: action.payload.data.rows,
                    pagination: {
                        pageSize: action.payload.data.pageSize,
                        currentPage: action.payload.data.currentPage,
                        total: action.payload.data.total
                    }
                },
            };
        },
        updateUsers(state, action) {
            return {
                ...state,
                users: {
                    ...state.users,
                    list: [
                        ...state.users.list.map(item => {
                            if (item.id == action.payload.id) {
                                return {...item, ...action.payload};
                            }
                            return {...item};
                        })
                    ],
                },
            };
        }
    },
};
