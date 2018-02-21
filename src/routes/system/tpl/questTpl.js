import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Tag } from 'antd';
const { RangePicker } = DatePicker;
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';

import styles from './questTpl.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({ quest, loading }) => ({
    loading: loading.models.quest,
    quests: quest.tplList
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
            type: 'quest/fetchTpls',
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
            type: 'quest/fetchTpls',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const {
            dispatch,
            form,
            quests
        } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: quests.pagination.pageSize,
                currentPage: quests.pagination.currentPage,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'quest/fetchTpls',
                payload: values,
            });
        });
    }

    editTpl = id => {
        window.location.hash = `/system/Tpl/questionInfo/?id=${id}`;
    }

    deleteTpl = id => {
        this.props.dispatch({
            type: 'quest/delete',
            payload: {
                id,
            },
        });
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="问卷名称">
                            {getFieldDecorator('questionnaireName')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>

                    <Col md={8} sm={24}>
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
        const { quests: data, loading } = this.props;
        const { selectedRows, modalVisible } = this.state;

        const columns = [{
            title: '序号',
            width: '20%',
            render: (text, record, index) => {
                let { currentPage: current, pageSize: size } = data.pagination;
                return (current - 1) * size + +index + 1;
            },
        }, {
            title: '问卷名称',
            dataIndex: 'questionnaireName',
            key: 'questionnaireName',
            width: '20%',
        }, {
            title: '创建人员',
            dataIndex: 'createPerson',
            key: 'createPerson',
            width: '20%',
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '20%',
            render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return <div>
                    <Tag color="#2db7f5" onClick={this.editTpl.bind(this, record.id)}>编辑</Tag>
                    <Tag color="#f50" onClick={this.deleteTpl.bind(this, record.id)}>删除</Tag>
                </div>
            }
        }]
        return (
            <PageHeaderLayout title="查询表格">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" href="/#/system/Tpl/questionInfo">
                                新建
                            </Button>
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 800 }}

                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
