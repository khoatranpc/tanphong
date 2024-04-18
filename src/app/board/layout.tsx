import React from 'react';
import styles from './Layout.module.scss';

interface Props {
    children: React.ReactNode;
}
const BoardLayout = (props: Props) => {
    return (
        <div className={`${styles.boardLayout ?? ''} ${styles.paddingBase}`}>
            {props.children}
        </div>
    )
}

export default BoardLayout;