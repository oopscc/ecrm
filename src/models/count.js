import { fetchMyd } from '../services/count';
import { getTimeDistance } from '../utils/utils';

export default {
    namespace: "count",
    state: {
        doctorData: {
            chartData: [],
            rankingData: []
        },
        deptData: {
            chartData: [],
            rankingData: []
        },
        hospitalData: {
            chartData: []
        }
    },
    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const year = getTimeDistance('year');
            const rangerTime = {
                beginTime: year[0].format('YYYY-MM-DD'),
                endTime: year[1].format('YYYY-MM-DD')
            }
            if (payload.currentDept) {
                yield put({
                    type: 'fetchMyd',
                    payload: {
                        mydType: 2,
                        id: payload.currentDept.id,
                        ...rangerTime
                    },
                });
            }
            if (payload.currentDoctor) {
                yield put({
                    type: 'fetchMyd',
                    payload: {
                        mydType: 3,
                        id: payload.currentDoctor.id,
                        ...rangerTime
                    },
                });
            }
            yield put({
                type: 'fetchMyd',
                payload: {
                    mydType: 1,
                    ...rangerTime
                },
            });
        },
        *fetchMyd({ payload, callback }, { call, put }) {
            const response = yield call(fetchMyd, payload);
            yield put({
                type: payload.mydType == 1? 'saveHospitalData': payload.mydType == 2 ? 'saveDeptData': 'saveDoctorData',
                payload: response.data.data,
            });
        },
    },
    reducers: {
        saveHospitalData(state, { payload }) {
            return {
                ...state,
                hospitalData: {
                    ...this.state.hospitalData,
                    chartData: Array.from(payload.chartArray, item => {item.x = item.name; item.y = item.score})
                }
            };
        },
        saveDeptData(state, { payload }) {
            return {
                ...state,
                DeptData: {
                    ...this.state.hospitalData,
                    chartData: Array.from(payload.chartArray, item => {item.x = item.name; item.y = item.score}),
                    rankingData: payload.rankingArray
                }
            };
        },
        saveDoctorData(state, { payload }) {
            return {
                ...state,
                DoctorData: {
                    ...this.state.hospitalData,
                    chartData: Array.from(payload.chartArray, item => {item.x = item.name; item.y = item.score}),
                    rankingData: payload.rankingArray
                }
            };
        },
    },
};

