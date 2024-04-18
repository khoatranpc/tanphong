"use client"
import React from 'react';
import CardBoard, { CardBoard as InterfaceCardBoard } from '@/components/CardBoard';
import styles from './Layout.module.scss';

const Board = () => {
    const listCard: InterfaceCardBoard[] = [
        {
            des: 'Xuất hoá đơn sản phẩm cho khách hàng',
            icon: '',
            route: '',
            title: 'Create Invoice',
        },
    ];
    return (
        <div className={styles.listCardBoard}>
            {listCard.map((card, idx) => {
                return !card.disabled && <CardBoard
                    key={idx}
                    data={card}
                    className={`${styles.item}`}
                    onClick={() => {
                        if (card.title === 'Create Invoice') {
                            window.open('https://create-bill-pziw.onrender.com/', 'blank');
                        }
                    }}
                />
            })}
        </div>
    )
}
export default Board;