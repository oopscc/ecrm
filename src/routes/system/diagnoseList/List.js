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
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const columns = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: '10%'
}, {
    title: '病种名称',
    dataIndex: 'diseaseName',
    key: 'diseaseName',
    width: '15%'
}, {
    title: '编码列表',
    dataIndex: 'codeList',
    key: 'codeList',
    width: '15%'
}, {
    title: '诊断列表',
    dataIndex: 'illnessList',
    key: 'illnessList',
    width: '15%'
}, {
    title: '维护人员',
    dataIndex: 'createPerson',
    key: 'createPerson',
    width: '15%'
}, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
        return <DropOption onMenuClick={e => handleOptionClick(record, e)} 
        menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
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
        alert('问卷');
    }
}
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

@connect(({
    system,
    loading
}) => ({
    diseases: system.diseases,
    loading: loading.models.system,
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
            type: 'system/fetchDiseases',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const {
            dispatch
        } = this.props;
        const {
            formValues
        } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj
            };
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
            type: 'system/fetchDiseases',
            payload: params,
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
            type: 'system/fetchDiseases',
            payload: {},
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleMenuClick = (e) => {
        const {
            dispatch
        } = this.props;
        const {
            selectedRows
        } = this.state;

        if (!selectedRows) return;

        switch (e.key) {
            case 'remove':
                dispatch({
                    type: 'rule/remove',
                    payload: {
                        no: selectedRows.map(row => row.no).join(','),
                    },
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                    },
                });
                break;
            default:
                break;
        }
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
            patient
        } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: diseases.pagination.pageSize,
                currentPage: diseases.pagination.current
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'system/fetchDiseases',
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
					<Col md={8} sm={24}>
						<FormItem label="病种名称">
							{getFieldDecorator('diseaseName')(
								<Input placeholder="请输入" />
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
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="规则编号">
							{getFieldDecorator('no')(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="使用状态">
							{getFieldDecorator('status')(
								<Select placeholder="请选择" style={{ width: '100%' }}>
									<Option value="0">关闭</Option>
									<Option value="1">运行中</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="调用次数">
							{getFieldDecorator('number')(
								<InputNumber style={{ width: '100%' }} />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="更新日期">
							{getFieldDecorator('date')(
								<DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="使用状态">
							{getFieldDecorator('status3')(
								<Select placeholder="请选择" style={{ width: '100%' }}>
									<Option value="0">关闭</Option>
									<Option value="1">运行中</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="使用状态">
							{getFieldDecorator('status4')(
								<Select placeholder="请选择" style={{ width: '100%' }}>
									<Option value="0">关闭</Option>
									<Option value="1">运行中</Option>
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<div style={{ overflow: 'hidden' }}>
					<span style={{ float: 'right', marginBottom: 24 }}>
						<Button type="primary" htmlType="submit">查询</Button>
						<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
						<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
							收起 <Icon type="up" />
						</a>
					</span>
				</div>
			</Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const {
            patient: {
                data
            },
            loading
        } = this.props;
        const {
            selectedRows,
            modalVisible
        } = this.state;

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
            <PageHeaderLayout title="查询表格">
				<Card bordered={false}>
					<div className={styles.tableList}>
						<div className={styles.tableListForm}>
							{this.renderForm()}
						</div>
						<div className={styles.tableListOperator}>
							<Button icon="plus" type="primary" href="/#/system/diagnoseList/info">
								新建
							</Button>
							{
								selectedRows.length > 0 && (
									<span>
										<Button>批量操作</Button>
										<Dropdown overlay={menu}>
											<Button>
												更多操作 <Icon type="down" />
											</Button>
										</Dropdown>
									</span>
								)
							}
						</div>
						<StandardTable
							selectedRows={selectedRows}
							loading={loading}
							data={data}
							columns={columns}
							size="small"
							scroll={{ x: 1650 }}
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