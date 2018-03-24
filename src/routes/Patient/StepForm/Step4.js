import React from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';
import qs from 'query-string';

class Step4 extends React.PureComponent {
    state = {
        type: '',
        title: ''
    }
    componentDidMount() {
        const { location } = this.props;
        let { result } = qs.parse(location.search);
        if (+result) {
            this.setState({
                type: 'success',
                title: '操作成功'
            })
        } else {
            this.setState({
                type: 'error',
                title: '操作失败'
            })
        }

    }
    render() {
        const { dispatch, data } = this.props;
        const {type, title} = this.state;

        const onFinish = () => {
            dispatch(routerRedux.go(-4));
        };
        const onClick = () => {
            dispatch(routerRedux.go(-3));
        };

        const actions = (
            <div>
                {/* <Button type="primary" onClick={onClick}>
                    重新编辑
                 </Button> */}
                <Button type="primary" onClick={onFinish}>
                    返回列表
                 </Button>

            </div>
        );
        return (
            <Result
                type={type}
                title={title}
                actions={actions}
                className={styles.result}
            />
        );
    }
}

export default connect(({ patient }) => ({
    patient: patient.diagnoseInfo,
}))(Step4);
