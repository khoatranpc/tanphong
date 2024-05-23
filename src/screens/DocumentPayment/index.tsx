"use client";
import React, { memo, useEffect, useRef, useState } from 'react';
import { Obj } from '@/global';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// Gán các font cho pdfmake
import { useParams } from 'next/navigation';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import PayRequest from './PayRequest';
import { ResultHook, toastify, uuid } from '@/utils';
import { useContract, useContractService, usePaymentContract, useSendMailBillContract, useService } from '@/utils/hooks';
import { groupPaymentByNo } from './config';
import CreateNotiContract from './CreateNotiContract';
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
interface Props {
    paymentContract: ResultHook;
}
const BoudaryComponent = (props: Props) => {
    const [crrDoc, setCrrDoc] = useState<Document>(Document.NOTI_CONTRACT);
    const params = useParams();
    const paymentContract = props.paymentContract;
    const crrDataPayment = (paymentContract.state.data as Obj[])?.filter(item => String(item.id_hopdong) === String(params.contractId)) ?? [];
    const selectGroup = groupPaymentByNo(crrDataPayment);
    const [noNotiContract, setNoNoticontract] = useState("");
    const [noPayrequest, setPayrequest] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const contract = useContract();
    const componentId = useRef(uuid());
    const cT = useContractService();
    const service = useService();
    const docRef = useRef(null);
    const sendmailBillContract = useSendMailBillContract();
    const handlePrint = useReactToPrint({
        content: () => docRef.current,
        bodyClass: 'printPageBill'
    });


    const contentDoc: Record<Document, React.ReactNode> = {
        NOTI_CONTRACT: <CreateNotiContract id="print" ref={docRef} noNoti={noNotiContract} isCreate={isCreate} paymentContract={paymentContract} parentComponentId={componentId.current} />,
        PAY_REQUEST: <PayRequest id="print" noNoti={noNotiContract} noPayrequest={noPayrequest} ref={docRef} />
    }
    const getLoading = contract.state.isLoading || cT.state.isLoading || service.state.isLoading;
    const generatePdf = async () => {
        const content = docRef.current as any;
        if (content) {
            const canvas = await html2canvas(content);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF(crrDoc === Document.NOTI_CONTRACT ? 'l' : 'p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            pdf.addImage(imgData, '', 0, crrDoc === Document.NOTI_CONTRACT ? 12 : 0, pdfWidth, 0);
            // pdf.save(noNotiContract);
            const pdfBlob = pdf.output('blob');
            handlePrint();
            const formData = new FormData();
            formData.append('file', pdfBlob, `${noNotiContract}.pdf`);
            formData.append('mahopdong', noNotiContract)
            sendmailBillContract.post?.(undefined, {
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        }
    };
    useEffect(() => {
        contract.get?.(componentId.current, {
            params: [String(params?.contractId)],
        });
        paymentContract.get?.(componentId.current, {
            queryParams: {
                id_hopdong: params?.contractId
            }
        });
        cT.get?.(componentId.current);
        service.get?.(componentId.current);
        return () => {
            contract.get?.();
            paymentContract.get?.();
            cT.get?.();
            service.get?.();
        }
    }, []);
    useEffect(() => {
        if (sendmailBillContract.state.data) {
            if (sendmailBillContract.state.success) {
                toastify('Đã gửi thông báo tới khách hàng!', {
                    type: 'success'
                });
            } else {
                toastify('Có lỗi xảy ra, vui lòng thử lại!', {
                    type: 'error'
                });
            }
            sendmailBillContract.clear();
        }
    }, [sendmailBillContract.state.data]);
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
                                setPayrequest(item.split("$")[1]);
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
                            className={`${crrDoc === item ? styles.active : ''} ${styles.itemTab}`}
                        >
                            {DocumentLabel[item as Document]}
                        </span>
                    })}
                    {crrDoc && <Button
                        style={{ marginLeft: 'auto' }}
                        onClick={() => {
                            if (docRef.current) {
                                generatePdf();
                            }
                        }}
                        loading={sendmailBillContract.state.isLoading}
                    >
                        <PrinterOutlined />
                    </Button>}
                </div>
                {contentDoc[crrDoc]}
            </div>
        </div>
    )
}
const MemoBoudaryComponent = memo(BoudaryComponent, (prevProps, nextProps) => {
    if (((!prevProps.paymentContract.state.componentId || !nextProps.paymentContract.state.componentId) || (prevProps.paymentContract.state.componentId && nextProps.paymentContract.state.componentId && prevProps.paymentContract.state.componentId === nextProps.paymentContract.state.componentId)) && nextProps.paymentContract.state.data && !nextProps.paymentContract.state.data.error) {
        return false;
    }
    return true;
});
const DocumentPayment = () => {
    const paymentContract = usePaymentContract();
    return <MemoBoudaryComponent paymentContract={paymentContract} />
}

export default DocumentPayment;