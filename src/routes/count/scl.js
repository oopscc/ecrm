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
import StandardTable from '../../components/StandardTable';
import { getTimeDistance } from '../../utils/utils';

import styles from './scl.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ loading, count }) => ({
    count,
    loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
    state = {
        salesType: 'all',
        currentTabKey: '',
        rangePickerValue: getTimeDistance('year'),
    };

    componentDidMount() {
        this.props.dispatch({
            type: 'chart/fetch',
        });
        this.props.dispatch({
            type: 'count/fetchScl',
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'chart/clear',
        });
    }

    handleChangeSalesType = (e) => {
        this.setState({
            salesType: e.target.value,
        });
    };

    handleTabChange = (key) => {
        this.setState({
            currentTabKey: key,
        });
    };

    handleRangePickerChange = (rangePickerValue) => {
        this.setState({
            rangePickerValue,
        });

        this.props.dispatch({
            type: 'chart/fetchSalesData',
        });
    };

    selectDate = (type) => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
        });

        this.props.dispatch({
            type: 'chart/fetchSalesData',
        });
    };

    isActive(type) {
        const { rangePickerValue } = this.state;
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

    render() {
        const { rangePickerValue, salesType, currentTabKey } = this.state;
        const { loading, count } = this.props;

        const { survivalLine, survivalRate, diseaseRate, cureModeRate } = count;

        console.log({count});
        const columns = [
            {
                title: '项目/月',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '3',
                dataIndex: 'M3',
                key: 'M3',
                width: '10%'
            },
            {
                title: '6',
                dataIndex: 'M6',
                key: 'M6',
                width: '10%'
            },
            {
                title: '9',
                dataIndex: 'M9',
                key: 'M9',
                width: '10%'
            },
            {
                title: '12',
                dataIndex: 'M12',
                key: 'M12',
                width: '10%'
            },
            {
                title: '24',
                dataIndex: 'M24',
                key: 'M24',
                width: '10%'
            },
            {
                title: '36',
                dataIndex: 'M36',
                key: 'M36',
                width: '10%'
            },
            {
                title: '48',
                dataIndex: 'M48',
                key: 'M48',
                width: '10%'
            },
            {
                title: '60',
                dataIndex: 'M60',
                key: 'M60',
                width: '10%'
            }
        ];

        const CustomTab = ({ data, currentTabKey: currentKey }) => (
            <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
                <Col span={12}>
                    <NumberInfo
                        title={data.name}
                        subTitle="转化率"
                        gap={2}
                        total={`${data.cvr * 100}%`}
                        theme={currentKey !== data.name && 'light'}
                    />
                </Col>
                <Col span={12} style={{ paddingTop: 36 }}>
                    <Pie
                        animate={false}
                        color={currentKey !== data.name && '#BDE4FF'}
                        inner={0.55}
                        tooltip={false}
                        margin={[0, 0, 0, 0]}
                        percent={data.cvr * 100}
                        height={64}
                    />
                </Col>
            </Row>
        );

        const topColResponsiveProps = {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 6,
            style: { marginBottom: 24 },
        };

        return (
            <div>
                <Row gutter={24}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            loading={loading}
                            className={styles.salesCard}
                            bordered={false}
                            title={diseaseRate.titleName}
                            bodyStyle={{ padding: 24 }}

                            style={{ marginTop: 24, minHeight: 400 }}
                        >
                            <Pie
                                hasLegend
                                subTitle="患者总数"
                                total={diseaseRate.data.reduce((pre, now) => now.y + pre, 0)}
                                data={diseaseRate.data}
                                valueFormat={val => numeral(val).format('0,0')}
                                height={248}
                                lineWidth={4}
                            />
                        </Card>
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            loading={loading}
                            className={styles.salesCard}
                            bordered={false}
                            title={cureModeRate.titleName}
                            bodyStyle={{ padding: 24 }}

                            style={{ marginTop: 24, minHeight: 400 }}
                        >
                            <Pie
                                hasLegend
                                subTitle="患者总数"
                                total={cureModeRate.data.reduce((pre, now) => now.y + pre, 0)}
                                data={cureModeRate.data}
                                valueFormat={val => numeral(val).format('0,0')}
                                height={248}
                                lineWidth={4}
                            />
                        </Card>
                    </Col>
                </Row>
                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0, marginTop: 24 }}>
                    <div className={styles.salesCard}>
                        <Table
                            loading={loading}
                            dataSource={survivalRate.data}
                            columns={columns}
                            pagination={false}
                        />
                    </div>
                </Card>
                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0, marginTop: 24 }}>
                    <div className={styles.salesCard}>
                        <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
                            <TabPane tab={survivalLine.titleName} key="sales">
                                <Row>
                                    <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesBar}>
                                            <Bar height={295} title={survivalLine.titleName} data={survivalLine.data} />
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
