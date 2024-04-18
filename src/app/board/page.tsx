import CardBoard, { CardBoard as InterfaceCardBoard } from '@/components/CardBoard';
import styles from './Layout.module.scss';
import React from 'react';

const Board = () => {
    const listCard: InterfaceCardBoard[] = [
        {
            des: 'Xuất hoá đơn sản phẩm cho khách hàng',
            icon: '',
            route: '/product',
            title: 'Product'
        },
        {
            des: 'Quản lý thông tin sản phẩm',
            icon: '',
            route: '/product',
            title: 'Product'
        },
        {
            des: 'Quản lý thông tin sản phẩm',
            icon: '',
            route: '/product',
            title: 'Product'
        },
        {
            des: 'Quản lý thông tin sản phẩm',
            icon: '',
            route: '/product',
            title: 'Product'
        },
    ]
    return (
        <div className={styles.listCardBoard}>
            {listCard.map((card, idx) => {
                return !card.disabled && <CardBoard
                    key={idx}
                    data={card}
                    className={`${styles.item}`}
                />
            })}
        </div>
    )
}
export default Board;