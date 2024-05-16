"use client";
import React, { useEffect, useState } from 'react';
import { Obj } from '@/global';
import { useParams } from 'next/navigation';
import { Button } from 'antd';
import NotiContract from './CreateNotiContract';
import PayRequest from './PayRequest';
import { useContract, useContractService, usePaymentContract, useService } from '@/utils/hooks';
import { groupPaymentByNo } from './config';
import styles from './DocumentPayment.module.scss';

export interface TypeDocument {
    NOTI_CONTRACT: string;
    PAY_REQUEST: string;
}
enum Document {
    NOTI_CONTRACT = "NOTI_CONTRACT",
    PAY_REQUEST = "PAY_REQUEST"
}

const DocumentLabel: Record<Document, string> = {
    NOTI_CONTRACT: 'Thông báo dịch vụ',
    PAY_REQUEST: 'Đề nghị thanh toán'
}

const DocumentPayment = () => {
    const [crrDoc, setCrrDoc] = useState<Document>(Document.NOTI_CONTRACT);
    const params = useParams();
    const paymentContract = usePaymentContract();
    const crrDataPayment = (paymentContract.state.data as Obj[])?.filter(item => String(item.id_hopdong) === String(params.contractId)) ?? [];
    const selectGroup = groupPaymentByNo(crrDataPayment);
    const [noNotiContract, setNoNoticontract] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const contract = useContract();
    const cT = useContractService();
    const service = useService();


    const contentDoc: Record<Document, React.ReactNode> = {
        NOTI_CONTRACT: <NotiContract noNoti={noNotiContract} isCreate={isCreate} />,
        PAY_REQUEST: <PayRequest />
    }
    const getLoading = contract.state.isLoading || cT.state.isLoading || service.state.isLoading;

    return (
        <div className={styles.documentPayment}>
            <div className={styles.list}>
                <h2>Danh sách <Button
                    size="small"
                    onClick={() => {
                        setIsCreate(true);
                        setNoNoticontract("");
                        setCrrDoc(Document.NOTI_CONTRACT);
                    }}
                >
                    Tạo
                </Button>
                </h2>
                {
                    getLoading ? <p>Đang tải...</p> : (!!Object.keys(selectGroup).length ? Object.keys(selectGroup).map((item, idx) => {
                        return <p
                            key={idx}
                            className={`${styles.item} ${item.split("$")[0] === noNotiContract ? styles.active : ''}`}
                            onClick={() => {
                                setNoNoticontract(item.split("$")[0]);
                                setIsCreate(false);
                            }}
                        >
                            {
                                item.split("$")[0]
                            }
                        </p>
                    }) :
                        <p>Chưa có thông tin văn bản thông báo</p>)
                }
            </div>
            <div className={styles.contentDocument}>
                <div className={styles.tabSide}>
                    {Object.keys(DocumentLabel).map((item) => {
                        return <span
                            key={item}
                            onClick={() => {
                                setCrrDoc(item as Document);
                            }}
                            className={`${crrDoc === item ? styles.active : ''}`}
                        >
                            {DocumentLabel[item as Document]}
                        </span>
                    })}
                </div>
                {contentDoc[crrDoc]}
            </div>
        </div>
    )
}

export default DocumentPayment;