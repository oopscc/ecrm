import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, Switch } from 'antd';
import qs from 'query-string';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import TableForm from './TableForm';
import styles from './style.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Quest extends PureComponent {
    state = {
        width: '100%',
        id: '',
        wjType: 0,
        wJ: {
            name: '',
            desc: '',
            wjType: 0,
            titles: [{
                content: '',
                mydType: 1,
                quest: [{
                    type: 1,
                    text: '',
                    weight: '',
                    option: [{
                        optionContent: ''
                    }]
                }]
            }]
        }
    };
    componentDidMount() {
        window.addEventListener('resize', this.resizeFooterToolbar);
        const { dispatch, location } = this.props;
        let { id } = qs.parse(location.search);
        if (!id) {
            return
        }
        dispatch({
            type: 'quest/get',
            payload: {
                id
            },
            callback: data => {
                let wJ = data.data;
                wJ.titleArray.map(item => {
                    item.questionArray.map(quest => {
                        quest.option = quest.optionArray;
                        quest.type = quest.questionType;
                        quest.text = quest.questionContent;
                        delete quest.optionArray;
                        delete quest.questionType;
                        delete quest.questionContent;
                    });
                    item.content = item.titleContent;
                    item.quest = item.questionArray;
                    delete item.titleContent;
                    delete item.questionArray;
                });
                wJ.name = wJ.questionnaireName ;
                wJ.desc = wJ.questionnaireDesc;
                wJ.titles = wJ.titleArray;
                delete wJ.questionnaireName;
                delete wJ.questionnaireDesc;
                delete wJ.titleArray;
                this.setState({
                    id, wJ, wjType: wJ.wjType
                })
            }
        });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFooterToolbar);
    }
    resizeFooterToolbar = () => {
        const sider = document.querySelectorAll('.ant-layout-sider')[0];
        const width = `calc(100% - ${sider.style.width})`;
        if (this.state.width !== width) {
            this.setState({ width });
        }
    }
    handleWjType = type => {
        this.setState({
            wjType: type ? 1 : 0
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch, location } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Object.values(values.titles).map(item => {
                    Object.values(item.quest).map(quest => {
                        quest.optionArray = Object.values(quest.option);
                        quest.questionType = quest.type;
                        quest.questionContent = quest.text;
                        delete quest.option;
                        delete quest.type;
                        delete quest.text;
                    });
                    item.titleContent = item.content;
                    item.questionArray = Object.values(item.quest);
                    delete item.content;
                    delete item.quest;
                });
                values.questionnaireName = values.name;
                values.questionnaireDesc = values.desc;
                values.titleArray = Object.values(values.titles);
                values.wjType = values.wjType ? 1 : 0;
                delete values.titles;
                delete values.name;
                delete values.desc;
                console.log('Received values of form: ', values);
                if(this.state.id) {
                    dispatch({
                        type: 'quest/edit',
                        payload: {
                            id: this.state.id,
                            ...values
                        },
                        callback: () => {
                            window.location.hash = '/system/tpl/questionTpl'
                        }
                    })
                } else {
                    dispatch({
                        type: 'quest/add',
                        payload: {
                            ...values
                        },
                        callback: () => {
                            window.location.hash = '/system/tpl/questionTpl'
                        }
                    })
                }
            }
        });
    }
    render() {
        const { form, dispatch, submitting } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    // submit the values
                    dispatch({
                        type: 'form/submitAdvancedForm',
                        payload: values,
                    });
                }
            });
        };
        const {id: wJId, wJ, wjType} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        return (
            <PageHeaderLayout
                title="高级表单"
                content="高级表单常见于一次性输入和提交大批量数据的场景。"
                wrapperClassName={styles.advancedForm}
            >
                <Card title="新增问卷" className={styles.card} bordered={false}>
                    <Form onSubmit={this.handleSubmit}>

                        <FormItem
                            {...formItemLayout1}
                            label="是否为满意度问卷"
                            style={{position: 'absolute',
                            top: '8px',
                            right: '0',
                            fontSize: '12px',
                            width: '300px'}}
                        >
                            {getFieldDecorator('wjType', {
                                valuePropName: 'checked',
                                initialValue: !!wjType,
                                rules: [{
                                    required: true, message: '请选择问卷类型',
                                }],
                            })(
                                <Switch onChange={this.handleWjType}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="问卷名称"
                        >
                            {getFieldDecorator('name', {
                                initialValue: wJ.name,
                                rules: [{
                                    required: true, message: '请输入问卷名称',
                                }],
                            })(
                                <Input placeholder="给问卷起个名字" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="问卷描述"
                        >
                            {getFieldDecorator('desc', {
                                initialValue: wJ.desc,
                            })(
                                <TextArea style={{ minHeight: 32 }} placeholder="请输入你的问卷描述" rows={4} />
                            )}
                        </FormItem>
                        <TableForm form={this.props.form} titles={wJ.titles} wJId={wJId} wjType={wjType}/>
                        <FormItem>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderLayout>
        );
    }
}

export default connect(({ global, loading }) => ({
    collapsed: global.collapsed,
    submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Quest));
