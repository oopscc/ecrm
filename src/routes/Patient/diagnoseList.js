import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Alert } from 'antd';
const { RangePicker } = DatePicker;
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DropOption from '../../components/DropOption';
import { Link } from 'react-router-dom';
import qs from 'query-string'

import styles from './diagnoseList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const columns = [
    {
        title: '诊断时间',
        dataIndex: 'diagnoseTime',
        key: 'diagnoseTime',
        width: 120,
        align: 'center',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
    }, {
        title: '诊断科别',
        dataIndex: 'diagnoseDept',
        key: 'diagnoseDept',
        width: 120
    }, {
        title: '第几次住院',
        dataIndex: 'admissionNumber',
        key: 'admissionNumber',
        width: 120
    }, {
        title: '入院时间',
        dataIndex: 'admissionTime',
        key: 'admissionTime',
        width: 150,
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
    }, {
        title: '入院科别',
        dataIndex: 'admissionDept',
        key: 'admissionDept',
        width: 150
    }, {
        title: '主要诊断',
        dataIndex: 'diagnoseName',
        key: 'diagnoseName',
        width: 150
    }, {
        title: '主治医师',
        dataIndex: 'treatmentDoctor',
        key: 'treatmentDoctor',
        width: 120
    }, {
        title: '出院时间',
        dataIndex: 'outTime',
        key: 'outTime',
        width: 150,
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
    }, {
        title: '出院科别',
        dataIndex: 'outDept',
        key: 'outDept',
        width: 100,
    }, {
        title: '操作',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record) => <Link to={`/patient/diagnoseInfo?id=${record.id}`}>{'查看'}</Link>
    }]

const CreateForm = Form.create()((props) => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            title="新建规则"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="描述"
            >
                {form.getFieldDecorator('desc', {
                    rules: [{ required: true, message: 'Please input some description...' }],
                })(
                    <Input placeholder="请输入" />
                )}
            </FormItem>
        </Modal>
    );
});

@connect(({ patient, loading }) => ({
    patient,
    loading: loading.models.patient,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        patientCode: '',
        name: ''
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let { patientCode, name } = qs.parse(location.search);
        if (!patientCode) {
            return
        }
        this.setState({
            patientCode,
            name
        })
        dispatch({
            type: 'patient/fetchDiagnose',
            payload: {
                currentPage: 1,
                pageSize: 10,
                patientCode,
                name
            }
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { patientCode, name } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            patientCode,
            name,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'patient/fetchDiagnose',
            payload: params,
        });
    }

    render() {
        const { patient: { diagnosesData }, loading, location } = this.props;
        const { patientCode, name } = this.state;

        return (
            <PageHeaderLayout needBack={true} title="住院信息管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <Alert message={`患者病案号：${patientCode} 患者姓名：${name}`} type="info" />
                        <Button
                            style={{ marginTop: 10 }}
                            icon="plus" type="primary" href={"/#/patient/diagnoseInfo" + location.search}>
                            添加信息
                        </Button>
                        <StandardTable
                            loading={loading}
                            data={diagnosesData}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1050 }}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
