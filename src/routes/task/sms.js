import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, TimePicker
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './sms.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, sms, category }) => ({
    sms,
    category,
    submitting: loading.effects['sms/send'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        smsId: '',
        smsContent: '',
        callIdArray: [],
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        dispatch({
            type: 'category/fetchSMSTpls',
        });
        let { id } = qs.parse(location.search);
        if (!id) {
            return;
        }
        this.setState({ callIdArray: [id] });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const sendDate = values.sendDate ? values.sendDate.format('YYYY-MM-DD') : '';
                const sendTime = values.sendTime.format('HH:mm:ss');
                const fieldsValue = {
                    ...values,
                    'sendTimeStr': `${sendDate} ${sendTime}`
                };
                this.props.dispatch({
                    type: 'sms/send',
                    payload: {
                        ...fieldsValue,
                        ...this.state
                    },
                    callback() {
                        // TODO,发送成功失败确认页面
                        alert('发送成功');
                    }
                });
            }
        });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }
    onTplChange = (smsId) => {
        const {category : {SMSTpls} } = this.props;
        const smsTpl = SMSTpls.filter(sms => sms.id == smsId);
        this.setState({
            smsId,
            smsContent: smsTpl[0] ? smsTpl[0].smsContent : ''
        })
    }
    render() {
        const { submitting, form, category } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { patient } = this.state;

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
        return (
            <PageHeaderLayout title={'短信随访页面'} content="选择合适的短信模版，发送时间，执行短信随访任务">
                <Card bordered={false}>
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem {...formItemLayout}
                            label="短信模版名称">
                            {getFieldDecorator('smsId', {
                                rules: [{ required: true, message: '请选择短信模版' }],
                            })(
                                <Select
                                    mode="radio"
                                    placeholder="请选择短信模版"
                                    onChange={this.onTplChange}
                                    style={{
                                        margin: '8px 0'
                                    }}
                                >
                                    {category.SMSTpls.map((tpl) =>
                                        <Option key={tpl.id} value={tpl.id}>{tpl.smsName}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="短信内容"
                        >
                            {getFieldDecorator('smsContent', {
                                initialValue: this.state.smsContent,
                            })(
                                <TextArea style={{ minHeight: 32 }} rows={4} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='发送日期'
                        >
                            {getFieldDecorator('sendDate', {

                            })(
                                <DatePicker />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='发送时间'
                        >
                            {getFieldDecorator('sendTime', {
                                initialValue: moment('08:00:00', 'HH:mm:ss'),
                            })(
                                <TimePicker />
                            )}
                        </FormItem>


                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                发送
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderLayout>
        );
    }
}
