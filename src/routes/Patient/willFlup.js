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

import styles from './willFlup.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

// 随访阶段，病种id（模糊查询）
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

@connect(({ callRecord, loading,  }) => ({
  callRecord,
  loading: loading.models.callRecord,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    isAdmin: 0,
    callConut: 0,
    todayCallNum: 0,
    calledNum: 0,
    callTaskNum: 0
  };

  componentDidMount() {
    const { dispatch } = this.props;
    let self = this;
    dispatch({
      type: 'callRecord/getWillNum',
      callback: data => {
        self.setState({
          ...this.state,
          ...data.data
        })
      }
    });
    dispatch({
      type: 'callRecord/fetchWillCalls',
      payload: {
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
      type: 'patient/fetchWillCalls',
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
      type: 'patient/fetchWillCalls',
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
    const { dispatch, form,  callRecord} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageSize: callRecord.willCallList.pagination.pageSize,
        currentPage: callRecord.willCallList.pagination.currentPage,
        beginTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[0].format('YYYY-MM-DD') : '',
        endTime: fieldsValue.diagnoseTime ? fieldsValue.diagnoseTime[1].format('YYYY-MM-DD'): '',
      };
      console.log(values)
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'callRecord/fetchWillCalls',
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
          <Col md={8} sm={24}>
            <FormItem label="随访阶段">
              {getFieldDecorator('callStage')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="病种名称">
              {getFieldDecorator('diseaseId')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="确诊时间">
              {getFieldDecorator('diagnoseTime')(
                <RangePicker />
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
// 待随访患者总数， 今日已随访人数， 已随访总人数， 我的待随访任务

  render() {
    const { callRecord: { willCallList: data}, loading } = this.props;
    const { selectedRows, modalVisible, callConut, todayCallNum, calledNum, callTaskNum } = this.state;

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

    const columns = [
    {
      title: '序号',
      width: 80,
      fixed: 'left',
      render: (text, record, index) => {
          let {currentPage: current, pageSize: size} = data.pagination;
          return (current - 1) * size + +index + 1;
      },
    },{
      title: '病案号',
      dataIndex: 'patientCode',
      key: 'patientCode',
      width: 80,
      fixed: 'left'
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      fixed: 'left'
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
      title: '原发性病理诊断名称',
      dataIndex: 'pathologyName',
      key: 'pathologyName',
      width: 100
    },{
      title: '治疗方式',
      dataIndex: 'cureModeStr',
      key: 'cureModeStr',
      width: 80
    },{
      title: '主治医师',
      dataIndex: 'treatmentDoctor',
      key: 'treatmentDoctor',
      width: 80
    },{
      title: '随访阶段',
      dataIndex: 'callStageStr',
      key: 'callStageStr',
      width: 80,
    },{
      title: '短信状态',
      dataIndex: 'smsStageStr',
      key: 'smsStageStr',
      width: 80,
    },{
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => 
      {
        return <div>
                  <Link style={{marginRight: 8}} to={`/task/call?patientCode=${record.patientCode}&id=${record.id}`}>{'电话'}</Link>
                  <Link to={`/task/sms?patientCode=${record.patientCode}`}>{'短信'}</Link>
               </div>
      }
    }];

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <Row>
            <Col sm={6} xs={24}>
              <Info title="待随访患者总数" value={callConut} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="今日已随访人数" value={todayCallNum} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="已随访总人数" value={calledNum} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="我的待随访任务" value={callTaskNum}  />
            </Col>
          </Row>
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
              scroll={{ x: 1350 }}
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
