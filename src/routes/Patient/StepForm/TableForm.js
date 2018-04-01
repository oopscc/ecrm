import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Select } from 'antd';
import styles from './style.less';
import C_Select from '../../../components/c_select';
const diseaseType = [{
    id: 0, name: '主要诊断'
}, {
    id: 1, name: '其他诊断'
}]
const admissionState = [
    {
        id: 1, name: '有'
    }, {
        id: 2, name: '临床未确定'
    },
    {
        id: 3, name: '情况不明'
    }, {
        id: 4, name: '无'
    }
]
const judge = [{
    id: 0, name: '否'
}, {
    id: 1, name: '是'
}]

export default class TableForm extends PureComponent {
    constructor(props) {
        super(props);
        const data = (props.value.diagnoseRecords || []).map(item => {
            return { ...item, key: item.id }
        })
        const icds = props.value.icds;
        this.state = {
            data,
            cures: diseaseType || [],
            diseases: admissionState || [],
            loading: false,
            icds
        };
    }

    componentWillReceiveProps(nextProps) {
        // if ('value' in nextProps) {
        //     this.setState({
        //         data: nextProps.value.diagnoseRecords,
        //     });
        // }
    }
    getRowByKey(key, newData) {
        return (newData || this.state.data).filter(item => item.key === key)[0];
    }
    index = 0;
    cacheOriginData = {};
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'form/submit',
                    payload: values,
                });
            }
        });
    }
    toggleEditable = (e, key) => {
        e.preventDefault();
        const newData = this.state.data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if (target) {
            // 进入编辑状态时保存原始数据
            if (!target.editable) {
                this.cacheOriginData[key] = { ...target };
            }
            target.editable = !target.editable;
            this.setState({ data: newData });
            this.props.onChange(newData);
        }
    }
    remove(key) {
        const newData = this.state.data.filter(item => item.key !== key);
        this.setState({ data: newData });
        this.props.onChange(newData);
    }
    newMember = () => {
        const newData = this.state.data.map(item => ({ ...item }));
        newData.push({
            key: `NEW_Dis_ID_${this.index}`,
            name: '',
            editable: true,
            isNew: true,
        });
        this.index += 1;
        this.setState({ data: newData });
    }
    handleKeyPress(e, key) {
        if (e.key === 'Enter') {
            this.saveRow(e, key);
        }
    }
    handleFieldChange(value, fieldName, key) {
        const newData = this.state.data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if (target) {
            target[fieldName] = value;
            if (fieldName === 'diagnoseCode' && value) {
                target.diagnoseName = this.state.icds.filter(item => item.id == value)[0].name
            }
            if (fieldName === 'pathologyCode' && value) {
                target.pathologyName = this.state.icds.filter(item => item.id == value)[0].name
            }
            this.setState({ data: newData });
        }
    }
    saveRow(e, key) {
        // e.persist();
        this.setState({
            loading: true,
        });
        // save field when blur input
        setTimeout(() => {
            if (document.activeElement.tagName === 'INPUT' &&
                document.activeElement !== e.target) {
                this.setState({
                    loading: false,
                });
                return;
            }
            if (this.clickedCancel) {
                this.clickedCancel = false;
                this.setState({
                    loading: false,
                });
                return;
            }
            const target = this.getRowByKey(key) || {};
            // if (!target.workId || !target.name || !target.department) {
            //   message.error('请填写完整成员信息。');
            //   e.target.focus();
            //   this.setState({
            //     loading: false,
            //   });
            //   return;
            // }
            delete target.isNew;
            // this.toggleEditable(e, key);
            this.props.onChange({
                ...this.state,
                diagnoseRecords: this.state.data
            });
            this.setState({
                loading: false,
            });
        }, 500);
    }
    cancel(e, key) {
        this.clickedCancel = true;
        e.preventDefault();
        const newData = this.state.data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            target.editable = false;
            delete this.cacheOriginData[key];
        }
        this.setState({ data: newData });
    }
    render() {
        const { cures, diseases, icds } = this.state;
        const columns = [{
            title: '诊断类型',
            dataIndex: 'diagnoseMode',
            key: 'diagnoseMode',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <C_Select data={cures} defaultValue={text}
                            autoFocus
                            onChange={e => this.handleFieldChange(e, 'diagnoseMode', record.key)}
                        />
                    );
                }
                let names = cures.filter(item => item.id == text)[0];
                return names ? names.name : '';
            },
        }, {
            title: '是否设置为原发诊断',
            dataIndex: 'primaryFlag',
            key: 'primaryFlag',
            width: '10%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <C_Select data={judge} defaultValue={text}
                            onChange={e => this.handleFieldChange(e, 'primaryFlag', record.key)}
                        />
                    );
                }
                let names = judge.filter(item => item.id == text)[0];
                return names ? names.name : '';
            },
        }, {
            title: '诊断名称',
            dataIndex: 'diagnoseCode',
            key: 'diagnoseCode',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Select
                            showSearch
                            defaultValue={text}
                            onChange={e => this.handleFieldChange(e, 'diagnoseCode', record.key)}
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            }
                        >
                            {icds.map(item => {
                                return <Select.Option key={item['id'] || Math.random()} value={item['id']}>{item['name']}</Select.Option>
                            })}
                        </Select>
                    );
                }
                return record.diagnoseName;
            },
        }, {
            title: '病理诊断名称',
            dataIndex: 'pathologyCode',
            key: 'pathologyCode',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Select
                            showSearch
                            onChange={e => this.handleFieldChange(e, 'pathologyCode', record.key)}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            }
                        >
                            {icds.map(item => {
                                return <Select.Option key={item['id'] || Math.random()} value={item['id']}>{item['name']}</Select.Option>
                            })}
                        </Select>
                    );
                }
                return record.pathologyName;
            },
        }, {
            title: '入院病情',
            dataIndex: 'admissionState',
            key: 'admissionState',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <C_Select data={diseases} defaultValue={text}
                            onChange={e => this.handleFieldChange(e, 'admissionState', record.key)}
                        />
                    );
                }
                let names = diseases.filter(item => item.id == text)[0];
                return names ? names.name : '';
            },
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                if (!!record.editable && this.state.loading) {
                    return null;
                }
                if (record.editable) {
                    if (record.isNew) {
                        return (
                            <span>
                                <a onClick={e => this.toggleEditable(e, record.key)}>保存</a>
                                <Divider type="vertical" />
                                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                        );
                    }
                    return (
                        <span>
                            <a onClick={e => this.toggleEditable(e, record.key)}>保存</a>
                            <Divider type="vertical" />
                            <a onClick={e => this.cancel(e, record.key)}>取消</a>
                        </span>
                    );
                }
                return (
                    <span>
                        <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                );
            },
        }];

        return (
            <div>
                <Table
                    loading={this.state.loading}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                    rowClassName={(record) => {
                        return record.editable ? styles.editable : '';
                    }}
                />
                <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    onClick={this.newMember.bind(this)}
                    icon="plus"
                >
                    新增诊断
                </Button>
            </div>
        );
    }
}
