import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Badge, Table, Divider, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import C_Select from '../../components/c_select';
import styles from './call.less';
import qs from 'query-string'
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const CallResult = [{ id: '102002', value: '无人接听' }, { id: '102007', value: '关机' }, { id: '101001', value: '稳定' }];

const progressColumns = [{
    title: '时间',
    dataIndex: 'time',
    key: 'time',
}, {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (
        text === 'success' ? <Badge status="success" text="成功" /> : <Badge status="processing" text="进行中" />
    ),
}, {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
}, {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
}];

@connect(({ callRecord, profile, loading, category }) => ({
    callRecord,
    profile,
    callRes: category.callRes,
    loading: loading.effects['callRecord/getCallData'],
    submitting: loading.effects['callRecord/save']
}))
@Form.create()
export default class BasicProfile extends Component {
    state = {};
    componentDidMount() {
        const { dispatch, location, callRes } = this.props;
        let self = this;
        let { patientCode, id } = qs.parse(location.search);
        this.setState({ patientCode, id });
        dispatch({
            type: 'callRecord/getCallData',
            payload: {patientCode, id},
            callback: data => {
                self.setState({
                    ...data.data
                })
            }
        });
        dispatch({
            type: 'profile/fetchBasic',
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const fieldsValue = {
                    ...values,
                    id: this.state.id
                };
                this.props.dispatch({
                    type: 'callRecord/save',
                    payload: fieldsValue,
                    callback() {
                        // 返回
                        window.location.hash = '/patient/willFlup';
                    }
                });
            }
        });
    }

    render() {
        const { profile, loading, submitting, callRes } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const patient = this.state;
        const { callRecordArray: calls, diagnoseArray: diagnosesData, questionnaireArray: questData, smsInfoArray: smsData, wjRecordArray: wjData } = this.state;
        const { basicGoods, basicProgress } = profile;
        let goodsData = [];
        if (basicGoods.length) {
            let num = 0;
            let amount = 0;
            basicGoods.forEach((item) => {
                num += Number(item.num);
                amount += Number(item.amount);
            });
            goodsData = basicGoods.concat({
                id: '总计',
                num,
                amount,
            });
        }
        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if (index === basicGoods.length) {
                obj.props.colSpan = 0;
            }
            return obj;
        };
        const goodsColumns = [{
            title: '商品编号',
            dataIndex: 'id',
            key: 'id',
            render: (text, row, index) => {
                if (index < basicGoods.length) {
                    return <a href="">{text}</a>;
                }
                return {
                    children: <span style={{ fontWeight: 600 }}>总计</span>,
                    props: {
                        colSpan: 4,
                    },
                };
            },
        }, {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            render: renderContent,
        }, {
            title: '商品条码',
            dataIndex: 'barcode',
            key: 'barcode',
            render: renderContent,
        }, {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: renderContent,
        }, {
            title: '数量（件）',
            dataIndex: 'num',
            key: 'num',
            align: 'right',
            render: (text, row, index) => {
                if (index < basicGoods.length) {
                    return text;
                }
                return <span style={{ fontWeight: 600 }}>{text}</span>;
            },
        }, {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (text, row, index) => {
                if (index < basicGoods.length) {
                    return text;
                }
                return <span style={{ fontWeight: 600 }}>{text}</span>;
            },
        }];
        // const call
        const callColumns = [
            {
                title: '随访时间',
                dataIndex: 'callTimeStr',
                key: 'callTimeStr',
                width: 60,
            }, {
                title: '主要诊断',
                dataIndex: 'diagnoseName',
                key: 'diagnoseName',
                width: 60,
            }, {
                title: '随访结果',
                dataIndex: 'callResult',
                key: 'callResult',
                width: 60,
            }, {
                title: '随访方式',
                dataIndex: 'callMode',
                key: 'callMode',
                width: 60,
            }, {
                title: '随访人员',
                dataIndex: 'callPerson',
                key: 'callPerson',
                width: 60,
            }, {
                title: '联系电话',
                dataIndex: 'mobile',
                key: 'mobile',
                width: 60,
            }];
        const diagnoseColumns = [
            {
                title: '入院日期',
                dataIndex: 'admissionTime',
                key: 'admissionTime',
                width: 60,
            }, {
                title: '出院日期',
                dataIndex: 'outTime',
                key: 'outTime',
                width: 60,
            }, {
                title: '出院科室',
                dataIndex: 'outDept',
                key: 'outDept',
                width: 60,
            }, {
                title: '主要诊断',
                dataIndex: 'diagnoseName',
                key: 'diagnoseName',
                width: 60,
            }, {
                title: '主治医师',
                dataIndex: 'treatmentDoctor',
                key: 'treatmentDoctor',
                width: 60,
            }, {
                title: '治疗方式',
                dataIndex: 'cureModeStr',
                key: 'cureModeStr',
                width: 60,
            }];
        const questColumns = [
            {
                title: '问卷名称',
                dataIndex: 'questionnaireName',
                key: 'questionnaireName',
                width: 60,
                render: (text, record) => <Link to={`/system/tpl/wj?id=${record.id}&doneFlag=${record.fillInTimeStr ? 1 : 0}`}>{record.questionnaireName}</Link>

            }, {
                title: '填写时间',
                dataIndex: 'fillInTimeStr',
                key: 'fillInTimeStr',
                width: 60,
            }];
        const smsColumns = [
            {
                title: '发送时间',
                dataIndex: 'sendTimeStr',
                key: 'sendTimeStr',
                width: 60,
            }, {
                title: '随访模版名称',
                dataIndex: 'smsTitle',
                key: 'smsTitle',
                width: 60,
            }, {
                title: '随访内容',
                dataIndex: 'smsContent',
                key: 'smsContent',
                width: 60,
            }, {
                title: '反馈内容',
                dataIndex: 'replyContent',
                key: 'replyContent',
                width: 60,
            }, {
                title: '反馈状态',
                dataIndex: 'replyState',
                key: 'replyState',
                width: 60,
            }];
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
        /*
        */
        return (
            <PageHeaderLayout title="基础详情页">
                <Card bordered={false}>
                    <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
                        <Description term="病案号">{patient.patientCode}</Description>
                        <Description term="患者姓名">{patient.name}</Description>
                        <Description term="性别">{patient.sex}</Description>
                        <Description term="年龄">{patient.age}</Description>
                        <Description term="身份证">{patient.idNumber}</Description>
                        <Description term="最近诊断日期">{patient.latelyDiagnoseDateStr}</Description>
                        <Description term="家庭住址">{patient.homeAddress}</Description>
                    </DescriptionList>
                    <Divider style={{ marginBottom: 32 }} />
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label='联系电话'
                        >
                            {getFieldDecorator('mobile', {
                                initialValue: '110',
                                rules: [{
                                    required: true, message: '请输入患者联系电话',
                                }],
                            })(
                                <Input placeholder="联系电话" disabled={true} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='显示号码'
                        >
                            {getFieldDecorator('showNo', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: '请输入显示号码',
                                }],
                            })(
                                <Select
                                    mode="radio"
                                    placeholder="请输入显示号码"
                                    style={{
                                        margin: '8px 0'
                                    }}
                                >
                                    {patient && patient.showPhoneArray && patient.showPhoneArray.map(item => {
                                        return <Select.Option key={item.id} value={item.id}>{item.phone}</Select.Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='主叫号码'
                        >
                            {getFieldDecorator('callNo', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: '请选择主叫号码',
                                }],
                            })(
                                <Select
                                    mode="radio"
                                    placeholder="请选择主叫号码"
                                    style={{
                                        margin: '8px 0'
                                    }}
                                >
                                    {patient && patient.callPhoneArray && patient.callPhoneArray.map(item => {
                                        return <Select.Option key={item.id} value={item.id}>{item.phone}</Select.Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='随访结果'
                        >
                            {getFieldDecorator('callResult', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: '请选择随访结果',
                                }],
                            })(
                                <C_Select data={callRes}>
                                </C_Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='备注'
                        >
                            {getFieldDecorator('remark', {
                                initialValue: '',
                                rules: [{
                                    // required: true, message: '请输入病案号',
                                }],
                            })(
                                <TextArea style={{ minHeight: 32 }} placeholder="" rows={4} />
                            )}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                保存
              </Button>
                        </FormItem>
                    </Form>
                    <Divider style={{ marginBottom: 32 }} />
                    <div className={styles.title}>随访历史信息</div>
                    <Table
                        style={{ marginBottom: 24 }}
                        pagination={false}
                        loading={loading}
                        dataSource={calls}
                        columns={callColumns}
                        rowKey="id"
                    />
                    <Divider style={{ marginBottom: 32 }} />
                    <div className={styles.title}>主要诊断信息</div>
                    <Table
                        style={{ marginBottom: 16 }}
                        pagination={false}
                        loading={loading}
                        dataSource={diagnosesData}
                        columns={diagnoseColumns}
                    />
                    <Divider style={{ marginBottom: 32 }} />
                    <div className={styles.title}>填写问卷信息</div>
                    <Table
                        style={{ marginBottom: 24 }}
                        pagination={false}
                        loading={loading}
                        dataSource={questData}
                        columns={questColumns}
                        rowKey="id"
                    />
                    <Divider style={{ marginBottom: 32 }} />
                    <div className={styles.title}>历史问卷信息</div>
                    <Table
                        style={{ marginBottom: 24 }}
                        pagination={false}
                        loading={loading}
                        dataSource={wjData}
                        columns={questColumns}
                        rowKey="id"
                    />
                    <div className={styles.title}>历史短信信息</div>
                    <Table
                        style={{ marginBottom: 24 }}
                        pagination={false}
                        loading={loading}
                        dataSource={smsData}
                        columns={smsColumns}
                        rowKey="id"
                    />
                </Card>
            </PageHeaderLayout>
        );
    }
}
