"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import CardBoard, { CardBoard as InterfaceCardBoard } from '@/components/CardBoard';
import styles from './Layout.module.scss';

const Board = () => {
    const router = useRouter();
    const listCard: InterfaceCardBoard[] = [
        {
            des: 'Xuất hoá đơn sản phẩm cho khách hàng',
            icon: '',
            route: '',
            title: 'Create Invoice',
        },
        {
            des: 'Lưu trữ các thông tin thuộc về công ty',
            icon: '',
            route: '/storage',
            title: 'Quản lý lưu trữ thông tin'
        }
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
                        } else {
                            router.push(card.route);
                        }
                    }}
                />
            })}
        </div>
    )
}
export default Board;