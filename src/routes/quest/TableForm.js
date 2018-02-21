import { Form, Input, Icon, Button, Row, Col, Divider } from 'antd';
const FormItem = Form.Item;
import styles from './style.less';
import Quest from './Quest';
import C_Select from '../../components/c_select';
const mydTypes = [
    { id: 1, name: '医院满意度' },
    { id: 2, name: '科室满意度' },
    { id: 3, name: '医生满意度' }
];

export default class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wJId: props.wJId,
            data: props.value,
            uuid: props.titles.length,
            keys: Array.from(props.titles, (x, index) => `titleKey${index}`),
            titles: props.titles
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.wJId == this.props.wJId) return false;
        this.setState({
            wJId: nextProps.wJId,
            data: nextProps.value,
            uuid: nextProps.titles.length,
            keys: Array.from(nextProps.titles, (x, index) => `titleKey${index}`),
            titles: nextProps.titles
        })
    }
    remove = (k) => {
        const { form } = this.props;
        const {keys} = this.state;
        if (keys.length === 1) {
            return;
        }
        this.setState({
            keys: keys.filter(key => key !== k),
        })
    }
    add = () => {
        const { form } = this.props;
        const { keys, uuid, titles } = this.state;
        const nextKeys = keys.concat(`titleKey${uuid}`);
        const newTitles = titles.concat({
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
        });
        this.setState({
            uuid: uuid + 1,
            keys: nextKeys,
            titles: newTitles
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
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { keys, titles, wJId } = this.state;
        const {wjType} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const formItems = keys.map((titleId, index) => {
            return (
                <div key={titleId} >
                                                        <Divider/>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={14} sm={24} offset={1}>

                    <FormItem
                        {...(formItemLayout)}
                        label={'标题'}
                        required={false}
                    >
                        {getFieldDecorator(`titles[${titleId}].content`, {
                            initialValue: titles[index].content,
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
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
                            onClick={() => this.remove(titleId)}
                        />
                    </FormItem>
                    </Col>
					<Col md={9} sm={24}>
                    {!!wjType && <FormItem
                            {...formItemLayout1}
                            label="调查类型"
                        >
                            {getFieldDecorator(`titles[${titleId}].mydType`, {
                                initialValue: titles[index].mydType,
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: !!wjType, message: '请选择标题满意度类型',
                                }],
                            })(
                                <C_Select data={mydTypes} style={{ width: '200px' }}/>
                            )}
                        </FormItem>
                    }
					</Col>
                    </Row>

                    { <Quest form={this.props.form} quests={titles[index].quest} titleId={titleId} wJId={wJId}/> }
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
