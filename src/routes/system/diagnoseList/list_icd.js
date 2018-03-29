import React, {
    PureComponent,
    Fragment
} from 'react';
import {
    connect
} from 'dva';
import {
    routerRedux
} from 'dva/router';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider
} from 'antd';
const {
    RangePicker
} = DatePicker;
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';

import styles from './List.less';

const FormItem = Form.Item;
const {
    Option
} = Select;


@connect(({system,loading}) => ({
    icds: system.ICDs,
    system,
    loading: loading.models.user,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        selectedRows: [],
        formValues: {},
    };

    componentDidMount() {
        const {
            dispatch
        } = this.props;
        dispatch({
            type: 'system/fetchICDs',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleFormReset = () => {
        const {form,dispatch} = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'system/fetchICDs',
            payload: {},
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
        this.props.onSelectRow(rows);
    }

    handleSearch = (e) => {
        e.preventDefault();
        const {dispatch,form,icds} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: icds.pagination.pageSize,
                currentPage: icds.pagination.current,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'system/fetchICDs',
                payload: values,
            });
        });
    }


    renderSimpleForm() {
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="疾病名称">
                            {getFieldDecorator('illnessName')(
                                <Input placeholder="请输入疾病名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="疾病编码">
                            {getFieldDecorator('illnessCode')(
                                <Input placeholder="请输入疾病编码" />
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
        const {icds: data,loading,onSelectRow} = this.props;
        const {selectedRows} = this.state;

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
                align: 'center'
            }, {
                title: '疾病名称',
                dataIndex: 'illnessName',
                key: 'illnessName',
                width: '15%'
            }, {
                title: '疾病编码',
                dataIndex: 'illnessCode',
                key: 'illnessCode',
                width: '15%'
            }, {
                title: '助记码',
                dataIndex: 'memoryCode',
                key: 'memoryCode',
                width: '15%'
            }, {
                title: '性别限制',
                dataIndex: 'sexLimit',
                key: 'sexLimit',
                width: '10%',
                render: val => +val ? <span>男</span> : <span>女</span>
            }, {
                title: '疗效限制',
                dataIndex: 'lxLimit',
                key: 'lxLimit',
                width: '15%'
            }]

        return (
            <PageHeaderLayout>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 800 }}
                            onSelectRow={this.handleSelectRows}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
