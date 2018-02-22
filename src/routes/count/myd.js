import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Icon,
    Card,
    Tabs,
    Table,
    Radio,
    DatePicker,
    Tooltip,
    Menu,
    Dropdown,
} from 'antd';
import numeral from 'numeral';
import {
    ChartCard,
    yuan,
    MiniArea,
    MiniBar,
    MiniProgress,
    Field,
    Bar,
    Pie,
    TimelineChart,
} from '../../components/Charts';
import Trend from '../../components/Trend';
import NumberInfo from '../../components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import C_Select from '../../components/c_select';
import TimeRangePicker from '../../components/TimeRangePicker';

import styles from './myd.less';
import { depth } from 'array-flatten';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
    rankingListData.push({
        title: `工专路 ${i} 号店`,
        total: 323234,
    });
}

@connect(({ chart, loading, category, count }) => ({
    chart,
    count,
    depts: category.Depts,
    doctors: category.Users,
    loading: loading.effects['count/fetchMyd'],
}))
export default class Analysis extends Component {
    state = {
        rangePickerValue: getTimeDistance('year'),
        currentDept: false,
        currentDoctor: false,
        deptPicker: getTimeDistance('year'),
        doctorPicker: getTimeDistance('year'),
    };

    componentDidMount() {

        this.props.dispatch({
            type: 'chart/fetch',
        });
        //人员
        this.props.dispatch({
            type: 'category/fetchUsers',
        });
        // 科室
        this.props.dispatch({
            type: 'category/fetchDepts',
        });

        // 获取医院data
        this.fetch('', 1, this.state.rangePickerValue);
        // this.props.dispatch({
        //     type: 'count/fetch',
        //     payload: {
        //         currentDept: depts[0],
        //         currentDoctor: doctors[0]
        //     }
        // });
    }
    // 拿到科室，人员列表之后，开始搜索一次绘图
    componentWillReceiveProps(nextProps) {
        if (nextProps.depts[0] && !this.props.depts[0]) {
            const { depts } = nextProps;
            this.setState({
                currentDept: depts[0],
            })
            this.fetch(depts[0].id, 2, this.state.deptPicker);
        };
        if (nextProps.doctors[0] && !this.props.doctors[0]) {
            const { doctors } = nextProps;
            this.setState({
                currentDoctor: doctors[0],
            })
            this.fetch(doctors[0].id, 3, this.state.doctorPicker);
        };
    }
    fetch(id, mydType, picker) {
        this.props.dispatch({
            type: 'count/fetchMyd',
            payload: {
                id,
                mydType,
                beginTime: picker[0].format('YYYY-MM-DD'),
                endTime: picker[1].format('YYYY-MM-DD')
            }
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'chart/clear',
        });
    }

    handleRangePickerChange = (mydType, pickerValue) => {
        const { currentDept, currentDoctor } = this.state;
        const picker = mydType == 1 ? { rangePickerValue: pickerValue }
            : mydType == 2 ? { deptPicker: pickerValue }
                : { doctorPicker: pickerValue };
        const id = mydType == 1 ? ''
            : mydType == 2 ? currentDept ? currentDept.id : ''
                : currentDoctor ? currentDoctor.id : ''
        this.setState({
            ...picker
        });
        if (mydType != 1 && !id) return;
        this.fetch(id, mydType, pickerValue);

    };

    selectDate = (type, mydType) => {
        const pickerValue = getTimeDistance(type);
        this.handleRangePickerChange(mydType, pickerValue);
    };

    isActive(type, rangePickerValue) {

        const value = getTimeDistance(type);
        if (!rangePickerValue[0] || !rangePickerValue[1]) {
            return;
        }
        if (
            rangePickerValue[0].isSame(value[0], 'day') &&
            rangePickerValue[1].isSame(value[1], 'day')
        ) {
            return styles.currentDate;
        }
    }

    handleDept(id) {
        const { depts, doctors } = this.props;
        const { deptPicker } = this.state;
        this.setState({
            currentDept: depts.filter(item => item.id == id)[0],
        })
        this.fetch(id, 2, deptPicker);
    }

    handleDoctor(id) {
        const { depts, doctors } = this.props;
        const { doctorPicker } = this.state;
        this.setState({
            currentDoctor: doctors.filter(item => item.id == id)[0],
        })
        this.fetch(id, 3, doctorPicker);
    }

    render() {
        const { rangePickerValue, currentDept, currentDoctor, deptPicker, doctorPicker} = this.state;
        const { chart, loading, depts, doctors, count } = this.props;
        const { salesData } = chart;
        const {doctorData, deptData, hospitalData} = count;
        // const doctorData = salesData;
        // const deptData = salesData;
        // const hospitalData = salesData;
        const salesExtra = type => {
            const pickerValue = type == 1 ? rangePickerValue : type == 2 ? deptPicker : doctorPicker;
            return (
                <div className={styles.salesExtraWrap}>
                    <div className={styles.salesExtra}>
                        <a className={this.isActive('year', pickerValue)} onClick={() => this.selectDate('year', type)}>
                            全年
                        </a>
                    </div>
                    <TimeRangePicker
                        value={pickerValue}
                        style={{ width: 256, marginRight: 16 }}
                        onSelect={this.handleRangePickerChange.bind(this, type)}
                    />
                    {
                        type == 2 &&
                        <C_Select data={depts} defaultValue={currentDept ? currentDept.id : ''} style={{ width: 156 }} onSelect={this.handleDept.bind(this)} />
                    }
                    {
                        type == 3 &&
                        <C_Select data={doctors} defaultValue={currentDoctor ? currentDoctor.id : ''} style={{ width: 156 }} onSelect={this.handleDoctor.bind(this)} />
                    }
                </div>
            )
        };

        return (
            <div>

                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
                    <div className={styles.salesCard}>
                        <Tabs tabBarExtraContent={salesExtra(1)} size="large" tabBarStyle={{ marginBottom: 24 }}>
                            <TabPane tab="医院满意度统计" key="1">
                                <Row>
                                    <Col >
                                        <div className={styles.salesBar}>
                                            <Bar height={295} data={hospitalData} />
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>

                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0, marginTop: '24px' }}>
                    <div className={styles.salesCard}>
                        <Tabs tabBarExtraContent={salesExtra(2)} size="large" tabBarStyle={{ marginBottom: 24 }}>
                            <TabPane tab="科室满意度统计" key="2">
                                <Row>
                                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesBar}>
                                            <Bar height={295} title={currentDept ? currentDept.name + "满意度趋势" : ''} data={deptData.chartData} />
                                        </div>
                                    </Col>
                                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesRank}>
                                            <h4 className={styles.rankingTitle}>科室满意度排名</h4>
                                            <ul className={styles.rankingList}>
                                                {deptData.rankingData.map((item, i) => (
                                                    <li key={item.name}>
                                                        <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                                        <span>{item.name}</span>
                                                        <span>{numeral(item.score).format('0,0')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>

                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0, marginTop: '24px' }}>
                    <div className={styles.salesCard}>
                        <Tabs tabBarExtraContent={salesExtra(3)} size="large" tabBarStyle={{ marginBottom: 24 }}>
                            <TabPane tab="医生满意度统计" key="3">
                                <Row>
                                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesBar}>
                                            <Bar height={295} title={currentDoctor ? currentDoctor.name + "满意度趋势" : ''} data={doctorData.chartData} />
                                        </div>
                                    </Col>
                                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesRank}>
                                            <h4 className={styles.rankingTitle}>医生满意度排名</h4>
                                            <ul className={styles.rankingList}>
                                                {doctorData.rankingData.map((item, i) => (
                                                    <li key={item.name}>
                                                        <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                                        <span>{item.name}</span>
                                                        <span>{numeral(item.score).format('0,0')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>

            </div>
        );
    }
}
