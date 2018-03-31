import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, Radio, Checkbox } from 'antd';
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
const CheckboxGroup = Checkbox.Group;

class Quest extends PureComponent {
    state = {
        width: '100%',
        id: '',
        wJ: {
            id: '',
            questionnaireName: '',
            questionnaireDesc: '',
            createPerson: '',
            createTime: '',
            titleArray: [{
                id: '',
                titleContent: '',
                questionArray: [{
                    id: '',
                    questionType: 1,
                    questionContent: '',
                    optionArray: [{
                        id: '',
                        optionContent: '',
                        answerContent: ''
                    }]
                }]
            }]

        }
    };
    componentDidMount() {
        window.addEventListener('resize', this.resizeFooterToolbar);
        const { dispatch, location } = this.props;
        let { id, preview } = qs.parse(location.search);
        if (!id) {
            return
        }
        if (preview) {
            dispatch({
                type: 'quest/get',
                payload: {id},
                callback: data => {
                    let wJ = data.data;
                    this.setState({
                        id:wJ.id, wJ, doneFlag: 1
                    })
                }
            });
            return
        }
        dispatch({
            type: 'quest/getWJ',
            payload: {
                id
            },
            callback: data => {
                let wJ = data.data;
                this.setState({
                    id:wJ.id, wJ, doneFlag: +wJ.doneFlag
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
    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch, location} = this.props;
        const { id } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const answers = values.answer;
                const options = Object.values(values.options);
                const answerArr = options.filter(option => {
                    let questId = option.questionId;
                    let answer = answers[questId];
                    // 过滤掉问题下没有选中的答案，同时赋值答案, 如果答案是数组，便利赋值
                    if (option.type == 2) {
                        answer.map(item => {
                            if (option.optionId == item) {
                                option.answerContent = item;
                            }
                        })
                    } else if (option.type == 1) {
                        if (option.optionId == answer) {
                            option.answerContent = answer;
                        }
                    } else {
                        option.answerContent = answer;
                        return true;
                    }
                    return option.answerContent;
                });
                dispatch({
                    type: 'quest/submitWJ',
                    payload: {
                        id,
                        answerArr
                    }
                })
            }
        });
    }
    render() {
        const { form, dispatch, submitting, isMobile} = this.props;
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
        const { wJ, doneFlag } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4, offset: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        const getOption = (type, options, wjId, titleId, questId) => {
            const Option = options.map(option => {
                getFieldDecorator(`options[${option.id}]`, {
                    initialValue: {
                        questionnaireId: wjId,
                        titleId,
                        questionId: questId,
                        optionId: option.id,
                        type
                    }
                });
                const radioStyle = {
                    display: 'block',
                    padding: '6px',
                    whiteSpace: 'normal'
                  };
                if (type == 1) {
                    return (
                        <Radio style={radioStyle} key={option.id} value={option.id}>{option.optionContent}</Radio>
                    )
                } else {
                    return (
                        <Checkbox style={radioStyle} key={option.id} value={option.id}>{option.optionContent}</Checkbox>
                    )
                }


            })
            const getAnswer = type => {
                switch (type) {
                    case 1:
                        return (
                            !!doneFlag
                                ? < Radio.Group disabled>
                                    {Option}
                                </Radio.Group >
                                : < Radio.Group >
                                    {Option}
                                </Radio.Group >
                        )
                        break;
                    case 2:
                        return (
                            !!doneFlag
                                ? < Checkbox.Group disabled>
                                    {Option}
                                </Checkbox.Group >
                                : < Checkbox.Group >
                                    {Option}
                                </Checkbox.Group >
                        )
                        break;
                    case 3:
                        return (
                            !!doneFlag ? < Input disabled /> : < Input />
                        )
                        break;
                    case 4:
                        return (
                            !!doneFlag ? < TextArea disabled /> : < TextArea />
                        )
                        break;

                    default:
                        break;
                }
            }
            const Answer = getAnswer(type);
            let answers = options.filter(item => item.answerContent);
            answers = Array.from(answers, (x) => x.answerContent);
            answers = type == 2 ? answers : answers[0] ? answers[0] : '';
            return (
                <FormItem
                    {...formItemLayout}
                    label=""
                >
                    <div style={{ marginTop: '8px', marginLeft: '32px' }}>
                        {getFieldDecorator(`answer[${questId}]`, {
                            initialValue: answers,
                            rules: [{
                                required: true,
                                message: "请选择答案...",
                            }],
                        })(
                            getAnswer(type)
                        )}
                    </div>
                </FormItem>
            )
        };

        const getQuest = (quests, wjId, titleId) => {
            const Quest = quests.map((quest, index) => {
                return (
                    <div key={quest.id} style={{ marginLeft: '16px' }}>
                        <div>{+index + 1}.{quest.questionContent}</div>
                        {getOption(quest.questionType, quest.optionArray, wjId, titleId, quest.id)}
                    </div>
                )
            })
            return (
                <div>
                    {Quest}
                </div>
            )
        };
        // {getQuest(title.questionArray)}
        const Title = wJ.titleArray.map((title, index) => {
            return (
                <Card key={title.id} title={(+index + 1) + '.' + title.titleContent} className={styles.card} bordered={false}>
                    {getQuest(title.questionArray, wJ.id, title.id)}
                </Card>
            )
        });
        return (
            <PageHeaderLayout
                title={wJ.questionnaireName}
                content={wJ.questionnaireDesc}
                wrapperClassName={styles.advancedForm}
            >
                <Form onSubmit={this.handleSubmit}>
                    {Title}
                    <FormItem style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" style={doneFlag ? {display: 'block'} : {}}>
                            提交
                        </Button>
                    </FormItem>
                </Form>
            </PageHeaderLayout>
        );
    }
}

export default connect(({ global, loading }) => ({
    collapsed: global.collapsed,
    submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Quest));
