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
import qs from 'query-string'

import styles from './questList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ patient, loading, quest, category }) => ({
    patient,
    quest,
    loading: loading.models.quest,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {

    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let { patientCode, name } = qs.parse(location.search);
        if (!patientCode) {
            return
        }
        this.setState({ patientCode, name });
        dispatch({
            type: 'quest/fetch',
            payload: {
                currentPage: 1,
                pageSize: 10,
                patientCode
            }
        });
    }

    render() {
        const { quest: { data }, loading } = this.props;
        const { patientCode, name } = this.state;
        const columns = [
            {
                title: '序号',
                width: 80,
                key: 'id',
                fixed: 'left',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
            }, {
                title: '填写时间',
                dataIndex: 'fillInTimeStr',
                key: 'fillInTimeStr',
                width: 80,
                render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
            }, {
                title: '操作',
                key: 'operation',
                width: 100,
                // fixed: 'right',
                render: (text, record) => <Link to={`/system/tpl/wj?id=${record.id}`}>{'查看'}</Link>
            }]
        return (
            <PageHeaderLayout title={`${name}的历史调查问卷`}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1070 }}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
