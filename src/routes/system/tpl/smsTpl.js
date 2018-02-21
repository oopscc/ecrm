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
    Divider,
    Tag,
    Radio,
    Switch
} from 'antd';
const {
    RangePicker
} = DatePicker;
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';

import styles from './smsTpl.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];


const CreateForm = Form.create()((props) => {
    const {
        modalVisible,
        form,
        handleAdd,
        handleModalVisible,
        tplInfo
    } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            title="新增短信模版"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="短信模版名称"
            >
                {form.getFieldDecorator('smsName', {
                    rules: [{ required: true, message: '请输入模版名称...' }],
                    initialValue: tplInfo ? tplInfo.smsName : ''
                })(
                    <Input placeholder="请输入模版名称" />
                )}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="短信内容"
            >
                {form.getFieldDecorator('smsContent', {
                    rules: [{ required: true, message: '请输入短信内容...' }],
                    initialValue: tplInfo ? tplInfo.smsContent : ''
                })(
                    <TextArea placeholder="请输入短信内容" />
                )}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="是否需要回复"
            >
                {form.getFieldDecorator('canReply', {
                    rules: [{ required: true, message: '请选择是否需要回复...' }],
                    initialValue: tplInfo && tplInfo.canReply
                })(
                    <Switch />
                )}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="回复内容"
            >
                {form.getFieldDecorator('subContent', {
                    // rules: [{ required: true, message: '请输入科室名称...' }],
                    initialValue: tplInfo ? tplInfo.subContent : ''
                })(
                    <TextArea placeholder="请输入科室名称" />
                )}
            </FormItem>
        </Modal>
    );
});

@connect(({
    system,
    loading
}) => ({
    SMSTpls: system.SMSTpls,
    loading: loading.models.SMSTpls,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        currenSMSId: '',
        tplInfo: false
    };

    componentDidMount() {
        const {
            dispatch
        } = this.props;
        dispatch({
            type: 'system/fetchSMSTpls',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleFormReset = () => {
        const {
            form,
            dispatch
        } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'system/fetchSMSTpls',
            payload: {},
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const {
            dispatch,
            form,
            SMSTpls
        } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: SMSTpls.pagination.pageSize,
                currentPage: SMSTpls.pagination.currentPage,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'system/fetcSMSTpls',
                payload: values,
            });
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
            currenSMSId: '',
            tplInfo: false
        });
    }

    editTpl = id => {
        const { dispatch } = this.props;
        dispatch({
            type: 'system/getSMSTpl',
            payload: { id },
            callback: (data) => {
                this.setState({
                    modalVisible: true,
                    currenSMSId: id,
                    tplInfo: data.data
                });
            }
        });
    }

    deleteTpl = id => {
        this.props.dispatch({
            type: 'system/deleteSMSTpl',
            payload: {
                id,
            },
        });
    }

    handleAdd = (fields) => {
        fields = {
            ...fields,
            canReply: fields.canReply ? 1 : 0
        }
        if (!this.state.currenSMSId) {
            this.props.dispatch({
                type: 'system/addSMSTpl',
                payload: {
                    ...fields,
                },
            });
        } else {
            this.props.dispatch({
                type: 'system/editSMSTpl',
                payload: {
                    ...fields,
                    id: this.state.currenSMSId
                },
            });
        }
        this.setState({
            modalVisible: false,
            currenSMSId: '',
            tplInfo: false
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
                        <FormItem label="模版名称">
                            {getFieldDecorator('smsName')(
                                <Input placeholder="请输入模版名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="是否需要回复">
                            {getFieldDecorator('canReply')(
                                <Select>
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
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
        const {
            SMSTpls: data,
            loading
        } = this.props;
        const {
            selectedRows,
            modalVisible,
            tplInfo
        } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            tplInfo
        };

        const columns = [{
            title: '序号',
            width: '10%',
            render: (text, record, index) => {
                let { currentPage: current, pageSize: size } = data.pagination;
                console.log(current, size, data)
                return (current - 1) * size + +index + 1;
            },
        }, {
            title: '短信模版名称',
            dataIndex: 'smsName',
            key: 'smsName',
            width: '15%',
        }, {
            title: '短信内容',
            dataIndex: 'smsContent',
            key: 'smsContent',
        }, {
            title: '是否需要回复',
            dataIndex: 'canReply',
            key: 'canReply',
            width: '15%',
            render: val => val ? <span>是</span> : <span>否</span>
        }, {
            title: '操作',
            key: 'operation',
            width: '15%',
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
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
							</Button>
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            // scroll={{ x: 1000 }}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                />
            </PageHeaderLayout>
        );
    }
}
