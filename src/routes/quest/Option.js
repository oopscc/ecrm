import { Form, Input, Icon, Button, Row, Col, Divider } from 'antd';
const FormItem = Form.Item;
import styles from './style.less';
import C_Select from '../../components/c_select';
const CallResult = [{ id: '102002', value: '无人接听' }, { id: '102007', value: '关机' }, { id: '101001', value: '稳定' }];
import Option from './Option';

export default class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wJId: props.wJId,
            data: props.value,
            uuid: props.options.length,
            keys: Array.from(props.options, (x, index) => `optionKey${index}`),
            options: props.options
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.wJId == this.props.wJId) return false;
        this.setState({
            wJId: nextProps.wJId,
            data: nextProps.value,
            uuid: nextProps.options.length,
            keys: Array.from(nextProps.options, (x, index) => `questKey${index}`),
            options: nextProps.options
        })
    }
    remove = (k) => {
        const { form } = this.props;
        const keys = this.state.keys;
        if (keys.length === 1) {
            return;
        }
        this.setState({
            keys: keys.filter(key => key !== k)
        })
    }

    add = () => {
        const { form } = this.props;
        const { keys, uuid, options } = this.state;
        const nextKeys = keys.concat(`optionKey${uuid}`);
        const newoptions = options.concat({
            optionContent: '',
            weight: 1
        });
        this.setState({
            uuid: uuid + 1,
            keys: nextKeys,
            options: newoptions
        })
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
        const { titleId, questId, type } = this.props;
        // const questId  = this.props.questId;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { keys, options, wJId } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2, offset: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 17 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 17 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };

        const formItems = keys.map((optionId, index) => {
            return (
                <div key={optionId} style={type < 3 ? { } : {display: 'none'}}>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24} offset={2}>
                    <FormItem
                        {...(formItemLayout)}
                        label={'选项'}
                        required={false}
                    >
                        {getFieldDecorator(`titles[${titleId}].quest[${questId}].option[${optionId}].optionContent`, {
                            initialValue: options[index].optionContent,
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: type < 3,
                                message: "Please input passenger's name or delete this field.",
                            }],
                        })(
                            <Input placeholder="passenger name" style={{ width: '80%', marginRight: 8 }} />
                        )}
                        <Icon
                            className={styles.dynamicButton}
                            type="plus-circle-o"
                            onClick={() => this.add()}
                        />
                        <Icon
                            className={styles.dynamicButton}
                            type="minus-circle-o"
                            onClick={() => this.remove(optionId)}
                        />
                    </FormItem>
                    </Col>
                    <Col md={9} sm={24}>
                    {
                        type < 3 &&
                        <FormItem
                            {...(formItemLayout1)}
                            label={'权重'}
                            required={false}
                            colon={false}
                        >
                            {getFieldDecorator(`titles[${titleId}].quest[${questId}].option[${optionId}.weight`, {
                                initialValue: options[index].weight,
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: type < 3,
                                    message: "请选择选项权重...",
                                }],
                            })(
                                <Input style={{ width: '200px', color: '#999' }} type='number' />
                            )}
                        </FormItem>
                    }
                    </Col>
                    </Row>
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
