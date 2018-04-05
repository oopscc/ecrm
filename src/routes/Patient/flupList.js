import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
const { RangePicker } = DatePicker;
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DropOption from '../../components/DropOption';
import qs from 'query-string'
import { Link } from 'react-router-dom';

import styles from './flupList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


const columns = [
    {
        title: '病案号',
        dataIndex: 'patientCode',
        key: 'patientCode',
        width: '10%',
        align: 'center'
    }, {
        title: '随访时间',
        dataIndex: 'callTime',
        key: 'callTime',
        width: '10%',
        align: 'center',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
    }, {
        title: '主要诊断',
        dataIndex: 'diagnoseName',
        key: 'diagnoseName',
        align: 'center',
        width: '15%'
    }, {
        title: '随访结果',
        dataIndex: 'callResult',
        key: 'callResult',
        align: 'center',
        width: '13%'
    }, {
        title: '随访方式',
        dataIndex: 'callMode',
        key: 'callMode',
        align: 'center',
        width: '13%',
        render: val => {
            return +val ? '电话' : '短信'
        }
    }, {
        title: '随访人员',
        dataIndex: 'callPerson',
        key: 'callPerson',
        align: 'center',
        width: '15%'
    }, {
        title: '联系电话',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
        width: '13%'
    }, {
        title: '操作',
        key: 'operation',
        width: 120,
        fixed: 'right',
        align: 'center',
        render: (text, record) => <Link to={`/patient/flupInfo?patientCode=${record.patientCode}&name=${record.name}&id=${record.id}`}>{'编辑'}</Link>
    }]

@connect(({ patient, loading, category }) => ({
    patient,
    loading: loading.models.patient,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        formValues: {},
        patientCode: '',
        name: ''
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let self = this;
        let { patientCode, name } = qs.parse(location.search);
        if (!patientCode) {
            return
        }
        this.setState({
            patientCode,
            name
        })
        dispatch({
            type: 'patient/fetchFlupList',
            payload: {
                currentPage: 1,
                pageSize: 10,
                patientCode
            }
        });
    }

    render() {
        const { patient: { flup: data }, loading } = this.props;
        const { patientCode, name } = this.state;
        return (
            <PageHeaderLayout needBack={true} title={`${name}的历史随访纪录`}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" href={`/#/patient/flupInfo?patientCode=${patientCode}&name=${name}`}>
                                新建
                            </Button>

                        </div>
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
