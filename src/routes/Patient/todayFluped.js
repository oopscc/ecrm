import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
const { RangePicker } = DatePicker;
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DropOption from '../../components/DropOption';
import { Link } from 'react-router-dom';
import C_Select from '../../components/c_select';
import numeral from 'numeral';
import styles from './willFlup.less';

const FormItem = Form.Item;
const { Option } = Select;

// 随访阶段，病种id（模糊查询）
@connect(({ callRecord, loading, category }) => ({
    callRecord,
    category,
    loading: loading.models.callRecord,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        isAdmin: 0,
        callConut: 0,
        todayCallNum: 0,
        calledNum: 0,
        callTaskNum: 0
    };
    componentDidMount() {
        const { dispatch } = this.props;
        let self = this;
        dispatch({
            type: 'callRecord/getWillNum',
            callback: data => {
                self.setState({
                    ...this.state,
                    ...data.data
                })
            }
        });
        dispatch({
            type: 'callRecord/fetchToadyCalls',
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
            type: 'patient/fetchToadyCalls',
            payload: {},
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const { dispatch, form, callRecord } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: callRecord.willCallList.pagination.pageSize,
                currentPage: callRecord.willCallList.pagination.currentPage,
                beginTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[0].format('YYYY-MM-DD') : '',
                endTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[1].format('YYYY-MM-DD') : '',
            };
            console.log(values)
            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'callRecord/fetchToadyCalls',
                payload: values,
            });
        });
    }

    renderSimpleForm() {
        const { form, category } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={5} sm={24}>
                        <FormItem label="随访阶段">
                            {getFieldDecorator('callStage')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="病种名称">
                            {getFieldDecorator('diseaseId')(
                                <C_Select data={category.Diseases} needAll={true} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="确诊时间">
                            {getFieldDecorator('diagnoseTime')(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={5} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { form, category } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="随访阶段">
                            {getFieldDecorator('callStage')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="病种名称">
                            {getFieldDecorator('diseaseId')(
                                <C_Select data={category.Diseases} needAll={true} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="确诊时间">
                            {getFieldDecorator('diagnoseTime')(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

                    <Col md={8} sm={24}>
                        <FormItem label="患者姓名">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入姓名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="病案号">
                            {getFieldDecorator('patientCode')(
                                <Input placeholder="请输入病案号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="原发性诊断名称">
                            {getFieldDecorator('diagnoseName')(
                                <Input placeholder="请输入诊断名称" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

                    <Col md={8} sm={24}>
                        <FormItem label="原发性诊断疾病编码">
                            {getFieldDecorator('diagnoseCode')(
                                <Input placeholder="请输入疾病编码" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="原发性病理诊断名称">
                            {getFieldDecorator('pathologyName')(
                                <Input placeholder="请输入名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="原发性病理诊断编码">
                            {getFieldDecorator('pathologyCode')(
                                <Input placeholder="请输入诊断编码" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24} offset={16}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                收起 <Icon type="up" />
                            </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    batchSms() {

    }
    render() {
        const { callRecord: { todayCallList: data }, loading } = this.props;
        const { selectedRows, modalVisible, callConut, todayCallNum, calledNum, callTaskNum } = this.state;

        const Info = ({ title, value, bordered, path }) => (
            <div className={styles.headerInfo} style={{ textAlign: 'center' }}>
                <span>{title}</span>
                <Link to={path}>
                    <p style={{ fontSize: 20, textAlign: 'center', paddingTop: 8, margin: 0 }}>{value}</p>
                </Link>
                {bordered && <em />}
            </div>
        );
        const columns = [
            {
                title: '序号',
                width: 80,
                fixed: 'left',
                align: 'center',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
            }, {
                title: '病案号',
                dataIndex: 'patientCode',
                key: 'patientCode',
                width: 100,
                fixed: 'left'
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 100,
                fixed: 'left'
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
                width: 130
            }, {
                title: '病种',
                dataIndex: 'diseaseName',
                key: 'diseaseName',
                width: 120
            }, {
                title: '确诊时间',
                dataIndex: 'diagnoseTime',
                key: 'diagnoseTime',
                width: 150,
                render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
            }, {
                title: '原发性诊断名称',
                dataIndex: 'diagnoseName',
                key: 'diagnoseName',
                width: 150
            }, {
                title: '原发性病理诊断名称',
                dataIndex: 'pathologyName',
                key: 'pathologyName',
                width: 150
            }, {
                title: '治疗方式',
                dataIndex: 'cureModeStr',
                key: 'cureModeStr',
                width: 100
            }, {
                title: '主治医师',
                dataIndex: 'treatmentDoctor',
                key: 'treatmentDoctor',
                width: 120
            }, {
                title: '随访时间',
                dataIndex: 'callTime',
                key: 'callTime',
                width: 150,
            }, {
                title: '随访结果',
                dataIndex: 'callResult',
                key: 'callResult',
                width: 100,
            }, {
                title: '随访方式',
                dataIndex: 'callMode',
                key: 'callMode',
                width: 100,
                render: val => +val ? '电话' : '短信'
            }];

        return (
            <PageHeaderLayout title="今日已随访患者">
                <Card bordered={false} style={{ marginBottom: 16 }}>
                    <Row>
                        <Col sm={6} xs={24}>
                            <Info title="待随访患者总数"
                                value={numeral(callConut).format('0,0')}
                                path={'/patient/willFlup'}
                                bordered />
                        </Col>
                        <Col sm={6} xs={24}>
                            <Info title="今日已随访人数"
                                value={numeral(todayCallNum).format('0,0')}
                                path={'/patient/todayFluped'}
                                bordered />
                        </Col>
                        <Col sm={6} xs={24}>
                            <Info title="已随访总人数"
                                value={numeral(calledNum).format('0,0')}
                                path={'/patient/fluped'}
                                bordered />
                        </Col>
                        <Col sm={6} xs={24}>
                            <Info title="我的待随访任务"
                                value={numeral(calledNum).format('0,0')}
                                path={'/task/list'}
                            />
                        </Col>
                    </Row>
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
                                        {/* <Button onClick={this.batchSms}>批量短信</Button> */}
                                    </span>
                                )
                            }
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1350 }}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
