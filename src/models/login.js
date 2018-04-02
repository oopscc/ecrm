import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeLogout } from '../services/api';
import { setAuthority, setUserName, setUserId } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
    namespace: 'login',

    state: {
        status: undefined,
    },

    effects: {
        *login({ payload }, { call, put }) {
            const response = yield call(fakeAccountLogin, payload);
            // Login successfully
            if (response && response.result == '0') {
                yield put({
                    type: 'changeLoginStatus',
                    payload: {
                        ...payload,
                        ...response.data
                    },
                });
                reloadAuthorized();
                yield put(routerRedux.push('/'));
            }
        },
        *logout({ payload }, { put, select, call }) {
            try {
                // get location pathname
                const urlParams = new URL(window.location.href);
                const pathname = yield select(state => state.routing.location.pathname);
                // add the parameters in the url
                urlParams.searchParams.set('redirect', pathname);
                if (!payload || !payload.notReal) {
                    const response = yield call(fakeLogout, {});
                }
                window.history.replaceState(null, 'login', urlParams.href);
            } finally {
                yield put({
                    type: 'changeLoginStatus',
                    payload: {
                        status: false,
                        currentAuthority: 'guest',
                        name: '',
                        id: '',
                        roleAuth: 4
                    },
                });
                reloadAuthorized();
                yield put(routerRedux.push('/user/login'));
            }
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            setUserName(payload.name || payload.setUserName || '');
            setUserId(payload.id || '');
            if (+payload.roleAuth >= 6) {
                payload.currentAuthority = 'admin';
            } else {
                payload.currentAuthority = 'guest';
            }
            setAuthority(payload.currentAuthority);
            return {
                ...state,
                status: payload.result,
                type: payload.type,
            };
        },
    },
};
