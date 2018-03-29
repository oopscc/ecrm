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
    Tag
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';

import styles from './List.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
            title="新增科室"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="科室名称"
            >
                {form.getFieldDecorator('deptName', {
                    rules: [{ required: true, message: '请输入科室名称...' }],
                })(
                    <Input placeholder="请输入科室名称" />
                )}
            </FormItem>
        </Modal>
    );
});

@connect(({system,loading,category}) => ({
    depts: system.depts,
    loading: loading.models.depts,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        currentDeptId: '',
    };

    componentDidMount() {
        this.props.dispatch({
            type: 'system/fetchDepts',
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
            type: 'system/fetchDepts',
            payload: {},
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const { dispatch,form,depts} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: depts.pagination.pageSize,
                currentPage: depts.pagination.currentPage,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'system/fetchDepts',
                payload: values,
            });
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
            currentDeptId: ''
        });
    }

    editDept = id => {
        this.setState({
            modalVisible: true,
            currentDeptId: id
        });
    }

    deleteDept = id => {
        this.props.dispatch({
            type: 'system/deleteDept',
            payload: { id },
        });
    }


    handleAdd = (fields) => {
        if (!this.state.currentDeptId) {
            this.props.dispatch({
                type: 'system/addDept',
                payload: {
                    deptName: fields.deptName,
                },
            });
        } else {
            this.props.dispatch({
                type: 'system/editDept',
                payload: {
                    deptName: fields.deptName,
                    id: this.state.currentDeptId
                },
            });
        }
        this.setState({
            modalVisible: false,
            currentDeptId: ''
        });
    }

    renderSimpleForm() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="科室名称">
                            {getFieldDecorator('deptName')(
                                <Input placeholder="请输入科室名称" />
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
        const {depts: data,loading} = this.props;
        const {modalVisible} = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };

        const columns = [{
                title: '序号',
                width: '20%',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
                align: 'center'
            }, {
                title: '科室名称',
                dataIndex: 'deptName',
                key: 'deptName',
                width: '40%',
                align: 'center'
            }, {
                title: '操作',
                key: 'operation',
                align: 'center',
                render: (text, record) => {
                    return <div>
                        <Tag color="#2db7f5" onClick={this.editDept.bind(this, record.id)}>编辑</Tag>
                        <Tag color="#f50" onClick={this.deleteDept.bind(this, record.id)}>删除</Tag>
                    </div>
                }
            }]

        return (
            <PageHeaderLayout title="科室列表">
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
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
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
