import React from 'react';
import Doc from '../icons/Doc';
import styles from './CardBoard.module.scss';


export interface CardBoard {
    route: string;
    title: string;
    icon: React.ReactNode;
    des: string;
    disabled?: boolean;
};

interface Props {
    data: CardBoard;
    className?: string;
    onClick?: () => void;
}
const CardBoard = (props: Props) => {
    return (
        <div className={styles.cardBoard} onClick={() => { props.onClick?.() }}>
            <div className={styles.icon}>{props.data.icon ? props.data.icon : <Doc className={styles.iconCard} />}</div>
            <div className={styles.contentCard}>
                <p><b>Chức năng</b>: {props.data.title}</p>
                <p><b>Mô tả</b>: {props.data.des}</p>
            </div>
        </div>
    )
}

export default CardBoard;