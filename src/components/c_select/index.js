import React, { PureComponent } from 'react';
import { Button, Select } from 'antd';

import styles from './index.less';

export default class C_select extends PureComponent {
    static defaultProps = {
        placeholder: '请选择',
        mode: "radio",
        data: [],
        kv: ['id', 'name'],
        style: {
            margin: '0'
        },
        needAll: false
    };
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { placeholder, mode, data, kv, style, needAll } = this.props;
        const [id , value] = kv;
        let all = {};
        let list = [];
        if (needAll) {
            all[id] = '';
            all[value] = '全部';
            list = [all, ...data]
        } else {
            list = [ ...data];
        }
        return (
            <Select
                {...this.props}
                >
                {list.map(item => {
                    return <Select.Option key={item[id] || Math.random()} value={item[id]}>{item[value]}</Select.Option>
                })}
            </Select>
        );
    }
};
