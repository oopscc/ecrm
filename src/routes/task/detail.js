import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import qs from 'query-string'
import numeral from 'numeral';

import styles from './list.less';
import { Link } from 'react-router-dom';
import C_Select from '../../components/c_select';
import DescriptionList from '../../components/DescriptionList';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;
const { RangePicker } = DatePicker;


@connect(({ task, loading, category }) => ({
    task,
    loading: loading.models.task,
    category
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        selectedRows: [],
        formValues: {},
        taskId: ''
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let { taskId } = qs.parse(location.search);
        if (!taskId) {
            return
        }
        this.setState({
            taskId
        })
        dispatch({
            type: 'task/getTask',
            payload: {
                id: taskId
            }
        });
        dispatch({
            type: 'task/getTaskPatients',
            payload: {
                taskId,
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'task/getTaskPatients',
            payload: {
                taskId: this.state.taskId,
                currentPage: 1,
                pageSize: 10
            },
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const { dispatch, form, task } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                taskId: this.state.taskId,
                pageSize: task.patientList.pagination.pageSize,
                currentPage: task.patientList.pagination.current
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'task/getTaskPatients',
                payload: values,
            });
        });
    }

    renderSimpleForm() {
        const { category, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="患者姓名">
                            {getFieldDecorator('patientName')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="病案号">
                            {getFieldDecorator('patientCode')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="随访状态">
                            {getFieldDecorator('callState')(
                                <C_Select data={category.taskState} needAll={true} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
    }

    batchSms() {

    }

    render() {
        const { task: { patientList: data, taskInfo }, loading, category } = this.props;
        const { taskId, selectedRows } = this.state;

        let columns = [
            {
                title: '病案号',
                dataIndex: 'patientCode',
                key: 'patientCode',
                width: 80,
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 80,
            }, {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: 80,
                render: val => val ? <span>女</span> : <span>男</span>
            }, {
                title: '联系电话',
                dataIndex: 'mobile',
                key: 'mobile',
                width: 110
            }, {
                title: '病种',
                dataIndex: 'diseaseName',
                key: 'diseaseName',
                width: 100
            }, {
                title: '确诊时间',
                dataIndex: 'diagnoseTime',
                key: 'diagnoseTime',
                width: 100,
                render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
            }, {
                title: '原发性诊断名称',
                dataIndex: 'diagnoseName',
                key: 'diagnoseName',
                width: 100
            }, {
                title: '主治医师',
                dataIndex: 'treatmentDoctor',
                key: 'treatmentDoctor',
                width: 100
            }, {
                title: '随访时间',
                dataIndex: 'callTime',
                key: 'callTime',
                width: 100,
                render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
            }, {
                title: '随访结果',
                dataIndex: 'callResult',
                key: 'callResult',
                width: 100
            }, {
                title: '随访状态',
                dataIndex: 'callDone',
                key: 'callDone',
                width: 100,
                render(text) {
                    return +text ? '已完成' : '未完成';
                },
            }, {
                title: '随访方式',
                dataIndex: 'callMode',
                key: 'callMode',
                width: 100,
                render(text) {
                    let callMode = category.flupType.filter(item => item.id == text)[0];
                    return callMode ? callMode.name : '';
                },
            }]

        if (data.isAdmin == 0 || data.isSelf) {
            const OPTION = {
                title: '操作',
                key: 'operation',
                width: 100,
                fixed: 'right',
                render: (text, record) => {
                    return <div>
                        <Link style={{ marginRight: 8 }}
                            to={`/task/call?patientCode=${record.patientCode}&id=${record.id}`}>
                            {'电话'}
                        </Link>
                        <Link to={`/task/sms?patientCode=${record.patientCode}&id=${record.id}`}>
                            {'短信'}
                        </Link>
                    </div>
                }
            }
            columns = [...columns, OPTION];
        }

        return (
            <PageHeaderLayout needBack={true} title={`${taskInfo.taskName}任务详情`}>
                <Card bordered={false} style={{ marginBottom: 16 }}>
                    <DescriptionList size="large" title="任务信息" style={{ marginBottom: 32 }}>
                        <Description className={styles.description} term="随访任务">
                            {taskInfo.taskName}
                        </Description>
                        <Description className={styles.description} term="随访人员">
                            {taskInfo.userName}
                        </Description>
                        <Description className={styles.description} term="预计完成时间">
                            {taskInfo.estimateTimeStr}
                        </Description>
                        <Description className={styles.description} term="患者数量">
                            {taskInfo.patientNum}
                        </Description>
                    </DescriptionList>
                    <Divider style={{ marginBottom: 32 }} />
                    <DescriptionList size="large" title="任务统计" style={{ marginBottom: 32 }}>
                        <Description className={styles.description} term="已完成">
                            {numeral(taskInfo.completedNum).format('0,0')}
                        </Description>
                        <Description className={styles.description} term="未完成">
                            {numeral(taskInfo.undoneNum).format('0,0')}
                        </Description>
                    </DescriptionList>
                </Card>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            {
                                selectedRows.length > 0 && (
                                    <span>
                                        <Button onClick={this.batchSms}>批量短信</Button>
                                    </span>
                                )
                            }
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1250 }}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
