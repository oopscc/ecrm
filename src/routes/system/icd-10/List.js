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
    Divider, Tag
} from 'antd';
const {
    RangePicker
} = DatePicker;
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;


const CreateForm = Form.create()((props) => {
    const {
        modalVisible,
        form,
        handleAdd,
        handleModalVisible
    } = props;
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

@connect(({ system, loading, category }) => ({
    icds: system.ICDs,
    system,
    loading: loading.models.user,
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
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'system/fetchICDs',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const { dispatch, form, icds } = this.props;
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

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'rule/add',
            payload: {
                description: fields.desc,
            },
        });

        message.success('添加成功');
        this.setState({
            modalVisible: false,
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
    edit(id) {
        window.location.hash = `/system/icd-10/info?id=${id}`;
    }

    delete(id){
        this.props.dispatch({
            type: 'system/deleteICD',
            payload: { id },
        });
    }

    render() {
        const { icds: data, loading } = this.props;
        const { modalVisible } = this.state;

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
            }, {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    return <div>
                        <Tag color="#2db7f5" onClick={this.edit.bind(this, record.id)}>编辑</Tag>
                        <Tag color="#f50" onClick={this.delete.bind(this, record.id)}>删除</Tag>
                    </div>
                }
            }]

        return (
            <PageHeaderLayout title="疾病列表">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" href="/#/system/icd-10/info">
                                添加疾病
                            </Button>
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1000 }}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
