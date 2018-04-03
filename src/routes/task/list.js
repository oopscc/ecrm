import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import numeral from 'numeral';

import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import { Link } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import C_Select from '../../components/c_select';

import DescriptionList from '../../components/DescriptionList';
import styles from './list.less';

const { Description } = DescriptionList;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ task, loading, category, user }) => ({
    task,
    loading: loading.models.task,
    category,
    user
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'task/fetch',
            payload: {
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
            type: 'task/fetch',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const { dispatch, form, task } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: task.tasks.pagination.pageSize,
                currentPage: task.tasks.pagination.current,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'task/fetch',
                payload: values,
            });
        });
    }

    renderSimpleForm() {
        const { task: { tasks }, category } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    {tasks.isAdmin != 0 &&
                        <Col md={6} sm={24}>
                            <FormItem label="随访人员">
                                {getFieldDecorator('callUserId', {
                                    initialValue: tasks.callUserId || '',
                                })(
                                    <C_Select data={category.Users} />
                                )}
                            </FormItem>
                        </Col>
                    }
                    <Col md={6} sm={24}>
                        <FormItem label="任务状态">
                            {getFieldDecorator('taskState')(
                                <C_Select data={category.taskState} needAll={true} />
                            )}
                        </FormItem>
                    </Col>

                    <Col md={6} sm={24}>
                        <FormItem label="任务名称">
                            {getFieldDecorator('taskName')(
                                <Input placeholder="请输入" />
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

    render() {
        const { task: { tasks: data }, loading, category, user } = this.props;
        const columns = [
            {
                title: '序号',
                width: 100,
                key: 'taskId',
                fixed: 'left',
                align: 'center',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
            }, {
                title: '任务名称',
                dataIndex: 'taskName',
                key: 'taskName',
                width: 100,
            }, {
                title: '患者数量',
                dataIndex: 'patientNum',
                key: 'patientNum',
                width: 80,
            }, {
                title: '预计完成时间',
                dataIndex: 'estimateTime',
                key: 'estimateTime',
                width: 120,
                render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
            }, {
                title: '任务状态',
                dataIndex: 'taskState',
                key: 'taskState',
                width: 120,
                render(text) {
                    let task = category.taskState.filter(item => item.id == text)[0];
                    return <Badge status={task.status} text={task.name} />;
                },
                align: 'left',
            }];
        const operation = {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => <Link to={`/task/detail?taskId=${record.taskId}`}>{'查看详情'}</Link>
        };
        if (data.callUserId == user.currentUser.id) {
            columns.push(operation);
        }
        return (
            <PageHeaderLayout title="随访任务">
                <Card bordered={false} style={{ marginBottom: 16 }}>
                    {/* <DescriptionList size="large" title="任务信息" style={{ marginBottom: 32 }}>
                        <Description term="随访人员">{data.userName}</Description>
                    </DescriptionList>
                    <Divider style={{ marginBottom: 32 }} /> */}
                    <DescriptionList size="large" title="任务统计" style={{ marginBottom: 32 }}>
                        <Description className={styles.description} term="未开始">
                            {numeral(data.notBeginNum).format('0,0')}
                        </Description>
                        <Description className={styles.description} term="进行中">
                            {numeral(data.goingNum).format('0,0')}
                        </Description>
                    </DescriptionList>
                </Card>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        {
                            data.isAdmin != 0 ?
                                <div className={styles.tableListOperator}>
                                    <Button icon="plus" type="primary" href="/#/task/taskAdd">
                                        新建随访任务
                                    </Button>
                                </div>
                                : ''
                        }
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1050 }}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
