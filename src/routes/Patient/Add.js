import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './add.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['patient/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'patient/add',
          payload: values,
        });
      }
    });
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };


// 
// patientCode
// String
// ●
// 病案号
// name
// String
// ●
// 病人姓名
// sex
// Int
// ●
// 性别 0:女 1:男
// mobile
// String
// ●
// 联系人电话
// birthdayStr
// String

// 出生日期 yyyy-MM-dd
// nationality
// String

// 国籍
// region
// String

// 地区
// nation
// String

// 民族
// marriage
// String

// 婚姻状态
// idNumber
// String

// 身份证号
// homeAddress
// String

// 家庭住址
// hometown
// String

// 籍贯
// diagnoseTimeStr
// String

// 最近门诊时间 yyyy-MM-dd
// canCall
// Int
// ●
// 是否可以随访 0：否、1:是
// patientState
// Int
// ●
// 死亡状态
// deathTimeStr
// String

// 死亡时间 yyyy-MM-dd
// deathDesc
// String

// 死亡原因

    return (
      <PageHeaderLayout title="新增患者" content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="病案号"
            >
              {getFieldDecorator('patientCode', {
                rules: [{
                  required: true, message: '请输入病案号',
                }],
              })(
                <Input placeholder="病案号" />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="病人姓名"
            >
              {getFieldDecorator('name ', {
                rules: [{
                  required: true, message: '请输入病人姓名',
                }],
              })(
                <Input placeholder="病人姓名" />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="病人性别"
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '0',
                })(
                  <Radio.Group>
                    <Radio value="0">女</Radio>
                    <Radio value="1">男</Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="电话号码"
            >
              {getFieldDecorator('mobile', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="出生日期"
            >
              {getFieldDecorator('birthday', {
                rules: [{ required: true, message: '请选择出生日期!' }],
              })(
                <DatePicker />
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="起止日期"
            >
              {getFieldDecorator('date', {
                rules: [{
                  required: true, message: '请选择起止日期',
                }],
              })(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="目标描述"
            >
              {getFieldDecorator('goal', {
                rules: [{
                  required: true, message: '请输入目标描述',
                }],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入你的阶段性工作目标" rows={4} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="衡量标准"
            >
              {getFieldDecorator('standard', {
                rules: [{
                  required: true, message: '请输入衡量标准',
                }],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入衡量标准" rows={4} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  客户
                  <em className={styles.optional}>
                    （选填）
                    <Tooltip title="目标的服务对象">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('client')(
                <Input placeholder="请描述你服务的客户，内部客户直接 @姓名／工号" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<span>邀评人<em className={styles.optional}>（选填）</em></span>}
            >
              {getFieldDecorator('invites')(
                <Input placeholder="请直接 @姓名／工号，最多可邀请 5 人" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<span>权重<em className={styles.optional}>（选填）</em></span>}
            >
              {getFieldDecorator('weight')(
                <InputNumber placeholder="请输入" min={0} max={100} />
              )}
              <span>%</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="目标公开"
              help="客户、邀评人默认被分享"
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">公开</Radio>
                    <Radio value="2">部分公开</Radio>
                    <Radio value="3">不公开</Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder="公开给"
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">同事甲</Option>
                      <Option value="2">同事乙</Option>
                      <Option value="3">同事丙</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
