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

import styles from './index.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ chart, loading, count, task, category}) => ({
    chart,
    count,
    tasks: task.tasks,
    taskState: category.taskState,
    loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
    state = {
        currentTabKey: '',
        rangePickerValue: getTimeDistance('month'),
        pieType: 'year'
    };

    componentDidMount() {
        this.props.dispatch({
            type: 'count/fetchIndexHeader',
        });
        this.props.dispatch({
            type: 'count/fetchIndexTrend',
        });
        this.props.dispatch({
            type: 'count/fetchIndexPie',
        });
        this.props.dispatch({
            type: 'task/fetch',
            payload: {
                currentPage: 1,
                pageSize: 9
            }
        });
    }

    handleChangePieType = (e) => {
        this.setState({
            pieType: e.target.value,
        });
    };

    handleRangePickerChange = (rangePickerValue) => {
        this.setState({
            rangePickerValue,
        });

        this.props.dispatch({
            type: 'count/fetchIndexTrend',
        });
    };

    selectDate = (type) => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
        });

        this.props.dispatch({
            type: 'count/fetchIndexTrend',
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
        const { rangePickerValue, currentTabKey, pieType } = this.state;
        const { chart, loading, count, tasks, taskState } = this.props;

        const {totalCallData, dayCallData, newCallData, trendData, callResData} = count;

        const salesExtra = (
            <div className={styles.salesExtraWrap}>
                <div className={styles.salesExtra}>
                    <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
                        今日
          </a>
                    <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
                        本周
          </a>
                    <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
                        本月
          </a>
                    <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
                        全年
          </a>
                </div>
                <RangePicker
                    value={rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    style={{ width: 256 }}
                />
            </div>
        );
        const iconGroup = (
            <span className={styles.iconGroup}>
                <a href='/#/task/list'>
                    <Icon type="ellipsis" />
                </a>
            </span>
        );
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: '10%',
                render: (text, record, index) => {
                    return +index + 1;
                },
            },
            {
                title: '任务名称',
                dataIndex: 'taskName',
                key: 'taskName',
                width: '30%',
                align: 'center',
                render: (text, record) => {
                    let href = `#/task/detail?taskId=${record.taskId}`;
                    return <a href={href}>{text}</a>;
                },
            },
            {
                title: '患者数量',
                dataIndex: 'patientNum',
                key: 'patientNum',
                align: 'center',
                width: '30%',

            },
            {
                title: '任务状态',
                dataIndex: 'taskState',
                key: 'taskState',
                width: '30%',
                render: text => {
                    return taskState.filter(item => item.id == text)[0].name;
                },
                align: 'right',
            },
        ];

        const topColResponsiveProps = {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 8,
            style: { marginBottom: 24 },
        };

        return (
            <div>
                <Row gutter={24}>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="月总随访量"
                            action={
                                <Tooltip title="随访总量趋势">
                                    <Icon type="info-circle-o" />
                                </Tooltip>
                            }
                            total={yuan(totalCallData.total)}
                            footer={<Field label="日均访问量" value={`${numeral(totalCallData.avgNum).format('0,0')}`} />}
                            contentHeight={46}
                        >
                            <Trend flag={totalCallData.weekTrend - 1 > 0 ? 'up' : 'down'} style={{ marginRight: 16 }}>
                                周同比<span className={styles.trendText}>
                                {numeral(totalCallData.weekTrend * 100 - 100).format('0,0')}%
                                </span>
                            </Trend>
                            <Trend flag={totalCallData.dayTrend - 1 > 0 ? 'up' : 'down'}>
                                日环比<span className={styles.trendText}>{totalCallData.dayTrend - 1}</span>
                            </Trend>
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="随访量"
                            action={
                                <Tooltip title="一周随访量趋势">
                                    <Icon type="info-circle-o" />
                                </Tooltip>
                            }
                            total={numeral(dayCallData.total).format('0,0')}
                            footer={<Field label="日随访量" value={numeral(dayCallData.dayNum).format('0,0')} />}
                            contentHeight={46}
                        >
                            <MiniArea color="#975FE4" data={dayCallData.trendData} />
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title="待随访总量"
                            action={
                                <Tooltip title="新增待随访趋势">
                                    <Icon type="info-circle-o" />
                                </Tooltip>
                            }
                            total={numeral(newCallData.total).format('0,0')}
                            footer={<Field label="人均随访量" value={newCallData.dayNum} />}
                            contentHeight={46}
                        >
                            <MiniBar data={newCallData.trendData} />
                        </ChartCard>
                    </Col>
                </Row>

                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
                    <div className={styles.salesCard}>
                        <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
                            <TabPane tab="随访量统计" key="sales">
                                <Row>
                                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesBar}>
                                            <Bar height={295} title="随访量趋势" data={trendData.callTrendData} />
                                        </div>
                                    </Col>
                                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesRank}>
                                            <h4 className={styles.rankingTitle}>随访护士排名</h4>
                                            <ul className={styles.rankingList}>
                                                {trendData.rankingList.map((item, i) => (
                                                    <li key={item.title}>
                                                        <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                                        <span>{item.name}</span>
                                                        <span>{numeral(item.num).format('0,0')}</span>
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

                <Row gutter={24}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            loading={loading}
                            bordered={false}
                            title="我的待随访任务"
                            extra={iconGroup}
                            style={{ marginTop: 24, height: 510 }}
                        >
                            <Table
                                rowKey={record => record.index}
                                size="small"
                                columns={columns}
                                dataSource={tasks.list}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            loading={loading}
                            className={styles.salesCard}
                            bordered={false}
                            title="随访结果统计"
                            bodyStyle={{ padding: 24 }}
                            extra={
                                <div className={styles.salesCardExtra}>
                                    <div className={styles.salesTypeRadio}>
                                        <Radio.Group value={pieType} onChange={this.handleChangePieType}>
                                            <Radio.Button value="year">年</Radio.Button>
                                            <Radio.Button value="month">月</Radio.Button>
                                            <Radio.Button value="day">周</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                </div>
                            }
                            style={{ marginTop: 24, minHeight: 509 }}
                        >
                            <h4 style={{ marginTop: 8, marginBottom: 32 }}>随访结果</h4>
                            <Pie
                                hasLegend
                                subTitle="统计总数"
                                total={yuan(callResData[`${pieType}PieData`].reduce((pre, now) => now.y + pre, 0))}
                                data={callResData[`${pieType}PieData`]}
                                valueFormat={val => yuan(val)}
                                height={248}
                                lineWidth={4}
                            />
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    }
}
