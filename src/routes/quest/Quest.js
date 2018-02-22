import { Form, Input, Icon, Button, Row, Col, Card, Divider} from 'antd';
const FormItem = Form.Item;
import styles from './style.less';
import Quest from './Quest';
import C_Select from '../../components/c_select';
const QuestType = [
    { id: 1, name: '单选题' },
    { id: 2, name: '多选题' },
    { id: 3, name: '填空题' },
    { id: 4, name: '问答题' }
];
import Option from './Option';
import { retry } from 'rxjs/operator/retry';

export default class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 1,
            wJId: props.wJId,
            data: props.value,
            uuid: props.quests.length,
            keys: Array.from(props.quests, (x, index) => `questKey${index}`),
            quests: props.quests
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.wJId == this.props.wJId) return false;
        this.setState({
            wJId: nextProps.wJId,
            data: nextProps.value,
            uuid: nextProps.quests.length,
            keys: Array.from(nextProps.quests, (x, index) => `questKey${index}`),
            quests: nextProps.quests
        })
    }
    remove = (k) => {
        const { form } = this.props;
        const keys = this.state.keys;
        if (keys.length === 1) {
            return;
        }
        this.setState({
            keys: keys.filter(key => key !== k),
        })
    }

    add = () => {
        const { form } = this.props;
        const { keys, uuid, quests } = this.state;
        const nextKeys = keys.concat(`questKey${uuid}`);
        const newquests = quests.concat({
            type: 1,
            text: '',
            weight: '',
            option: [{
                optionContent: '',
            }]
        });
        this.setState({
            uuid: uuid + 1,
            keys: nextKeys,
            quests: newquests
        })
    }
    handleType = (type) => {
        this.setState({
            type
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const titleId = this.props.titleId;
        const { keys, quests, wJId, type } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const formItems = keys.map((questId, index) => {
            return (
                <div key={questId} >
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={22} sm={24} offset={2}>
                            <FormItem
                                {...(formItemLayout)}
                                label={'题目'}
                                required={false}
                            >
                                {getFieldDecorator(`titles[${titleId}].quest[${questId}].text`, {
                                    initialValue: quests[index].text,
                                    validateTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: "Please input passenger's name or delete this field.",
                                    }],
                                })(
                                    <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
                                )}
                                <Icon
                                    className={styles.dynamicButton}
                                    type="plus-circle-o"
                                    onClick={() => this.add()}
                                />
                                <Icon
                                    className={styles.dynamicButton}
                                    type="minus-circle-o"
                                    onClick={() => this.remove(questId)}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24} offset={2}>
                            <FormItem
                                {...(formItemLayout1)}
                                label={'题型'}
                                required={false}
                            >
                                {getFieldDecorator(`titles[${titleId}].quest[${questId}].type`, {
                                    initialValue: quests[index].type,
                                    validateTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                        required: true,
                                        message: "Please input passenger's name or delete this field.",
                                    }],
                                })(
                                    <C_Select data={QuestType} style={{ width: '80%' }} onSelect={this.handleType} />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={10} sm={24}>
                            {
                                type < 3 &&
                                <FormItem
                                    {...(formItemLayout)}
                                    label={'权重'}
                                    required={false}
                                    colon={false}
                                >
                                    {getFieldDecorator(`titles[${titleId}].quest[${questId}].weight`, {
                                        initialValue: quests[index].weight,
                                        validateTrigger: ['onChange', 'onBlur']
                                    })(
                                        <Input style={{ width: '200px', color: '#999' }} type='number' />
                                    )}
                                </FormItem>
                            }
                        </Col>
                    </Row>
                    <Option form={this.props.form} options={quests[index].option} titleId={titleId} questId={questId} wJId={wJId} type={type} />
                </div>
            );
        });
        return (
            <div>
                {formItems}
            </div>
        );
    }
}
