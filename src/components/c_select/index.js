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
            margin: '8px 0'
        }
    };
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { placeholder, mode, data, kv, style } = this.props;
        const [id , value] = kv;
        return (
            <Select
                {...this.props}
            >
                {data.map(item => {
                    return <Select.Option key={item[id]} value={item[id]}>{item[value]}</Select.Option>
                })}
            </Select>
        );
    }
};
