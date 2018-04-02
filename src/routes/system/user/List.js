import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Popconfirm, Tag, Switch } from 'antd';
const { RangePicker } = DatePicker;
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';

import styles from './List.less';
import C_Select from '../../../components/c_select';

const FormItem = Form.Item;
const { Option } = Select;



const CreateForm = Form.create()((props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, roles, rolePayload } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleAdd({
                ...rolePayload,
                ...fieldsValue
            });
        });
    };
    return (
        <Modal
            title="修改角色"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="请选择角色"
            >
                {form.getFieldDecorator('roleId', {
                    initialValue: rolePayload.roleId,
                    rules: [{ required: true, message: 'Please input some description...' }],
                })(
                    <C_Select data={roles} style={{ width: '80%' }} />
                )}
            </FormItem>
        </Modal>
    );
});

@connect(({ user, loading, category }) => ({
    user,
    category,
    loading: loading.models.user,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        formValues: {},
        rolePayload: {}
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/fetchUsers',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleAdd = (payload) => {
        this.props.dispatch({
            type: 'user/updateRole',
            payload,
            callback(res) {
                if (res && !res.result) {
                    message.success('修改成功');
                }
            }
        });
        this.setState({
            modalVisible: false,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const { dispatch, form, user } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: user.users.pagination.pageSize,
                currentPage: user.users.pagination.current,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'user/fetchUsers',
                payload: values,
            });
        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'user/fetchUsers',
            payload: {},
        });
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="用户名">
                            {getFieldDecorator('userName')(
                                <Input placeholder="请输入用户名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="姓名">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入姓名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="是否锁定">
                            {getFieldDecorator('lockFlag')(
                                <Select placeholder="是否锁定" style={{ width: '100%' }}>
                                    <Option value="">不限</Option>
                                    <Option value="0">未锁定</Option>
                                    <Option value="1">已锁定</Option>
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

    editUserLock(id, lockFlag) {
        let data = {};
        data[`switchId_${id}`] = true
        this.setState(data);
        this.props.dispatch({
            type: 'user/editUserLock',
            payload: { id, lockFlag: lockFlag ? 1 : 0 },
            callback: res => {
                let data = {};
                data[`switchId_${id}`] = false;
                this.setState(data);
                if (res && !res.result) {
                    message.success('修改成功');
                }
            }
        });

    }
    resetPassword(id) {
        this.props.dispatch({
            type: 'user/resetPassword',
            payload: { id },
            callback(res) {
                if (res && !res.result) {
                    message.success('修改成功');
                }
            }
        });
    }
    updateRole(id, roleId) {
        this.setState({
            modalVisible: true,
            rolePayload: {
                id, roleId
            }
        });
    }

    handleOptionClick = (record, e) => {
        if (e.key === '1') {
            window.location.hash = `/system/user/info?id=${record.id}`;
        } else if (e.key === '2') {
            this.resetPassword(record.id);
        } else if (e.key === '3') {
            this.updateRole(record.id, record.role);
        }
    }
    render() {
        const { user: { users: data, currentUser }, loading, category } = this.props;
        const { modalVisible, rolePayload } = this.state;
        let columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: 80,
                align: 'center',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
                width: 100,
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 80,
            }, {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: 60,
                render: val => val ? <span>男</span> : <span>女</span>
            }, {
                title: '科室',
                dataIndex: 'dept',
                key: 'dept',
                width: 100
            }, {
                title: '职称',
                dataIndex: 'job',
                key: 'job',
                width: 80
            }, {
                title: '职务',
                dataIndex: 'duty',
                key: 'duty',
                width: 100,
                // render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
            }, {
                title: '手机',
                dataIndex: 'userPhone',
                key: 'userPhone',
                width: 100
            }, {
                title: '角色',
                dataIndex: 'roleId',
                key: 'roleId',
                width: 100,
                render: (roleId, record) => {
                    return <div>{category.Roles.filter(item => item.id == roleId)[0].name}</div>
                }
            }];
        if (currentUser.auth === 'admin') {
            const operation = [
                {
                    title: '锁定',
                    dataIndex: 'lockFlag',
                    key: 'lockFlag',
                    width: 100,
                    render: (text, record) => {
                        return <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={!!+text} onChange={this.editUserLock.bind(this, record.id)} checked={!!+record.lockFlag}
                            loading={this.state[`switchId_${record.id}`]}
                        />
                    }
                }, {
                    title: '操作',
                    key: 'operation',
                    width: 100,
                    fixed: 'right',
                    render: (text, record) => {
                        return <DropOption onMenuClick={e => this.handleOptionClick(record, e)}
                            menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '重置密码' }, { key: '3', name: '修改角色' }]} />
                    }
                }]
            columns = [...columns, ...operation];
        }
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };

        return (
            <PageHeaderLayout title="随访人员管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" href="/#/system/user/info">
                                新建
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
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                    rolePayload={rolePayload}
                    roles={category.Roles}
                />
            </PageHeaderLayout>
        );
    }
}
