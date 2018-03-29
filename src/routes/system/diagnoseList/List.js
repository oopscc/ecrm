import React, {
    PureComponent,
    Fragment
} from 'react';
import {
    connect
} from 'dva';
import {
    routerRedux
} from 'dva/router';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider, Tag
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';
import Icds from './list_icd';

import styles from './List.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;


@connect(({system,loading,category}) => ({
    diseases: system.diseases,
    loading: loading.models.system,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        seleceedIcds: [],
        formValues: {},
        icds: [],
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'system/fetchDiseases',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleFormReset = () => {
        const {
            form,
            dispatch
        } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'system/fetchDiseases',
            payload: {
                currentPage: 1,
                pageSize: 10
            }
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const {dispatch,form,diseases} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                pageSize: diseases.pagination.pageSize,
                currentPage: diseases.pagination.current
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'system/fetchDiseases',
                payload: values,
            });
        });
    }

    handleSelectIcds = icds => {
        this.setState({
            seleceedIcds: icds
        });
    }

    handleAdd = () => {
        const selectedIcds = this.state.seleceedIcds;
        const icdIds = Array.from(selectedIcds, item => item.id);
        this.setState({
            icds: [...this.state.icds.filter(icd => !icdIds.includes(icd.id)), ...selectedIcds],
            modalVisible: false,
        });
    }

    renderSimpleForm() {
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="病种名称">
                            {getFieldDecorator('diseaseName')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>

                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
    }

    edit(id) {
        window.location.hash = `/system/diagnoseList/info?id=${id}`;
    }

    delete(id){
        this.props.dispatch({
            type: 'system/deleteDisease',
            payload: { id },
        });
    }

    render() {
        const {diseases: data,loading} = this.props;
        const {modalVisible} = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            handleSelectIcds: this.handleSelectIcds,
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
                render: (text, record, index) => {
                    let { currentPage: current, pageSize: size } = data.pagination;
                    return (current - 1) * size + +index + 1;
                },
                align: 'center'
            }, {
                title: '病种名称',
                dataIndex: 'diseaseName',
                key: 'diseaseName',
                width: '15%'
            }, {
                title: '编码列表',
                dataIndex: 'codeList',
                key: 'codeList',
                width: '15%'
            }, {
                title: '诊断列表',
                dataIndex: 'illnessList',
                key: 'illnessList',
                width: '15%'
            }, {
                title: '维护人员',
                dataIndex: 'createPerson',
                key: 'createPerson',
                width: '15%'
            }, {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    return <div>
                        <Tag color="#2db7f5" onClick={this.edit.bind(this, record.id)}>编辑</Tag>
                        <Tag color="#f50" onClick={this.delete.bind(this, record.id)}>删除</Tag>
                    </div>
                }
            }]
        return (
            <PageHeaderLayout title="疾病管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" href="/#/system/diagnoseList/info">
                                新建
							</Button>
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                            scroll={{ x: 1250 }}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
