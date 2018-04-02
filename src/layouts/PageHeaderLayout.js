import React from 'react';
import { Link, routerRedux } from 'dva/router';
import PageHeader from '../components/PageHeader';
import styles from './PageHeaderLayout.less';
import { Button, Icon } from 'antd';


export default ({ children, wrapperClassName, top, props, needBack, ...restProps }) => {
    const back = () => {
        props.dispatch(routerRedux.goBack());
    }
    const action = <Button size="small" type="primary" onClick={back}><Icon type="left" />返回</Button>
    return (
        <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
            {top}
            <PageHeader key="pageheader" {...restProps} linkElement={Link} action={needBack ? action : null} />
            {children ? <div className={styles.content}>{children}</div> : null}
        </div>)
};
