import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Upload, notification } from 'antd';
const { RangePicker } = DatePicker;
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DropOption from '../../components/DropOption';
import { Link } from 'react-router-dom';
import C_Select from '../../components/c_select';
import {c_upload} from '../../utils/request';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const columns = [
    {
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
        width: 120
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
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
    }, {
        title: '随访结果',
        dataIndex: 'callResult',
        key: 'callResult',
        width: 100,
        fixed: 'right',
        render: (text, record) => <Link to={`/patient/flupList?patientCode=${record.patientCode}&name=${record.name}`}>{record.callResult}</Link>
    }, {
        title: '操作',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
            return <DropOption onMenuClick={e => handleOptionClick(record, e)}
                menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '住院信息' }, { key: '3', name: '调查问卷' }]} />
        }
    }]
const handleOptionClick = (record, e) => {
    // const { dispatch } = this.props;
    if (e.key === '1') {
        window.location.hash = `/patient/info?patientCode=${record.patientCode}`;
        // console.log(record);
        // dispatch(routerRedux.push({
        //   pathname: '/patient/add',
        //   query: {
        //     page: 2,
        //   },
        // }))
    } else if (e.key === '2') {
        window.location.hash = `/patient/diagnoseList?patientCode=${record.patientCode}&name=${record.name}`;
    } else if (e.key === '3') {
        window.location.hash = `/patient/questList?patientCode=${record.patientCode}&name=${record.name}`;
    }
}


@connect(({ patient, loading, category }) => ({
    patient,
    diseases: category.Diseases,
    loading: loading.models.patient,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        expandForm: false,
        formValues: {},
    };
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'patient/fetch',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'patient/fetch',
            payload: params,
        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'patient/fetch',
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
        const { dispatch, form, patient } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: patient.data.pagination.pageSize,
                currentPage: patient.data.pagination.current,
                beginTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[0].format('YYYY-MM-DD') : '',
                endTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[1].format('YYYY-MM-DD') : '',
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'patient/fetch',
                payload: values,
            });
        });
    }

    batchExport() {
        const { dispatch, form, patient } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                beginTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[0].format('YYYY-MM-DD') : '',
                endTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[1].format('YYYY-MM-DD') : '',
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'patient/batchExport',
                payload: values,
            });
        });
    }

    renderSimpleForm() {
        const {form, diseases} = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="病种名称">
                            {getFieldDecorator('diseaseId')(
                                <C_Select data={diseases} needAll={true}/>
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
                    <Col md={8} sm={24}>
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
        const {form, diseases} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="病种名称">
                            {getFieldDecorator('diseaseId')(
                                <C_Select data={diseases} needAll={true}/>
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
                    <Col md={8} sm={24}>
                        <FormItem label="原发性诊断疾病编码">
                            {getFieldDecorator('diagnoseCode')(
                                <Input placeholder="请输入疾病编码" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                    <Col md={8} sm={24}>
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

    render() {
        const { patient: { data }, loading } = this.props;
        return (
            <PageHeaderLayout title="全部患者列表">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" href="/#/patient/info">
                                新建患者
                            </Button>
                            <Upload
                                accept="application/vnd.ms-excel,
                                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                application/vnd.openxmlformats-officedocument.spreadsheetml.template"
                                action="patient/batchImport"
                                showUploadList={false}
                                customRequest={c_upload}
                                name="fileData"
                                style={{display: 'inline-block'}}>
                                <Button icon="upload" type="primary">
                                    Excel导入
                                </Button>
                            </Upload>
                            <Button icon="download" type="primary"
                                href='/hospitalCRM/patient/exportPatientList.do'
                            >
                                Excel导出
                            </Button>
                            <Upload
                                accept="application/vnd.ms-excel,
                                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                application/vnd.openxmlformats-officedocument.spreadsheetml.template"
                                action="patient/batchUpHistory"
                                showUploadList={false}
                                customRequest={c_upload}
                                name="fileData"
                                style={{display: 'inline-block'}}>
                                <Button icon="upload" type="primary">
                                    患者随访历史导入
                                </Button>
                            </Upload>
                            <Button icon="download" type="primary"
                                href='/hospitalCRM/patient/downloadExcelTemplate.do'
                            >
                                患者信息模版
                            </Button>
                            <Button icon="download" type="primary"
                                href='/hospitalCRM/callRecord/downloadExcelTemplate.do'
                            >
                                随访历史模版
                            </Button>
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1560 }}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
