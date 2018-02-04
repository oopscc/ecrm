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

import styles from './list.less';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const columns = [
  {
    title: '病案号',
    dataIndex: 'patientCode',
    key: 'patientCode',
    width: 80,
  },{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 80,
  },{
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 80,
    render: val => val ? <span>女</span> : <span>男</span>
  },{
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 100
  },{
    title: '病种',
    dataIndex: 'diseaseName',
    key: 'diseaseName',
    width: 100
  },{
    title: '确诊时间',
    dataIndex: 'diagnoseTime',
    key: 'diagnoseTime',
    width: 100,
    render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
  },{
    title: '原发性诊断名称',
    dataIndex: 'diagnoseName',
    key: 'diagnoseName',
    width: 100
  },{
    title: '治疗方式',
    dataIndex: 'cureModeStr',
    key: 'cureModeStr',
    width: 100
  },{
    title: '主治医师',
    dataIndex: 'treatmentDoctor',
    key: 'treatmentDoctor',
    width: 100
  },{
    title: '随访时间',
    dataIndex: 'callTime',
    key: 'callTime',
    width: 100,
    render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : ''
  },{
    title: '随访结果',
    dataIndex: 'callResult',
    key: 'callResult',
    width: 100
  },{
    title: '随访方式',
    dataIndex: 'callModeStr',
    key: 'callModeStr',
    width: 100
  },{
    title: '操作',
    key: 'operation',
    width: 100,
    fixed: 'right',
    render: (text, record) => {
      <div>
        <Link to={`/callRecord/call?patientCode=${record.patientCode}`}>{'电话'}</Link>
        <Link to={`/callRecord/sms?patientCode=${record.patientCode}`}>{'短信'}</Link>
      </div>
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
    }else if (e.key === '3') {
      alert('问卷');
    }
  }
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

@connect(({ task, loading }) => ({
  task,
  loading: loading.models.task,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    taskId: ''
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    let {taskId} = qs.parse(location.search);
    if (!taskId) {
      return
    }
    this.setState({
      taskId
    })
    dispatch({
      type: 'task/getTask',
      payload: {
        taskId,
        currentPage: 1,
        pageSize: 10
      }
    });
    dispatch({
      type: 'task/getTaskPatients',
      payload: {
        taskId,
        currentPage: 1,
        pageSize: 10
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
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
      type: 'patient/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'patient/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

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
    const { dispatch, form,  task} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageSize: patient.data.pagination.pageSize,
        currentPage: patient.data.pagination.current
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'task/getTaskPatients',
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="患者姓名">
              {getFieldDecorator('patientName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="病案号">
              {getFieldDecorator('patientCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="随访状态">
              {getFieldDecorator('callState')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
    const { getFieldDecorator } = this.props.form;
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
    const { task: { patientList: data, taskInfo }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    console.log(this.props.task);
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

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <PageHeaderLayout title="查询表格">
        <Card>
          <div>
              <Info title="随访任务" value={taskInfo.taskName} bordered />
              <Info title="随访人员" value={taskInfo.userName} bordered />
              <Info title="预计完成时间" value={taskInfo.estimateTime} bordered />
              <Info title="患者数量" value={taskInfo.patientNum} bordered />
          </div>
          <div>
              任务统计: 
              <Info title="已完成" value={taskInfo.completedNum} bordered />
              <Info title="未完成" value={taskInfo.undoneNum} bordered />
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" href="/#/patient/add">
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
              scroll={{ x: 1250 }}
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
