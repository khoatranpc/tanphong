"use client";
import React, { forwardRef } from 'react';
import { useParams } from 'next/navigation';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Obj } from '@/global';
import { uuid } from '@/utils';
import { useContract, usePaymentContract, useService } from '@/utils/hooks';
import styles from './DocumentPayment.module.scss';

interface Props {
    noNoti: string;
    ref: React.RefObject<any>;
    id: string;
}
const DocumentNoticontract = (props: Props, ref: any) => {
    const contract = useContract();
    const params = useParams();
    const crrContract = Array.isArray(contract.state.data as Obj[]) ? (contract.state.data as Obj[])?.find((contract) => String(contract.id_hopdong) === String(params?.contractId)) : contract.state.data as Obj;
    const paymentContract = usePaymentContract();
    const service = useService();
    const dataPaymentContract = ((paymentContract.state.data as Obj[])?.find(item => String(item.id_hopdong) === String(params?.contractId) && item.sotbdv === props.noNoti)) as Obj;
    const crrDataPayment: Obj[] = dataPaymentContract?.thanhtoan?.map((item: any) => {
        return {
            ...item,
            dichvu: ((service.state.data as Obj[])?.find(sv => String(sv.id_dichvu) === String(item.dichvu)))?.tendichvu,
            key: uuid()
        }
    });
    const lastRow = [
        {
            stt: 'Tổng tiền trước thuế',
            tientruocthue: crrDataPayment?.reduce((prevValue, crrItem) => {
                return {
                    tientruocthue: prevValue.tientruocthue + crrItem.tientruocthue
                }
            }, {
                tientruocthue: 0
            }).tientruocthue,
            colSpan: 8,
            coldichvu: 0,
            coldonvitinh: 0,
            colchisocu: 0,
            colchisomoi: 0,
            colheso: 0,
            coldongia: 0,
            colsosudung: 0,
            mergeCol: true,
            key: uuid()
        },
        {
            stt: 'Tổng tiền sau thuế',
            tientruocthue: crrDataPayment?.reduce((prevValue, crrItem) => {
                return {
                    tiensauthue: prevValue.tiensauthue + crrItem.tiensauthue
                }
            }, {
                tiensauthue: 0
            }).tiensauthue,
            colSpan: 8,
            coldichvu: 0,
            coldonvitinh: 0,
            colchisocu: 0,
            colchisomoi: 0,
            colheso: 0,
            coldongia: 0,
            colsosudung: 0,
            mergeCol: true,
            key: uuid()
        },
    ];
    crrDataPayment?.push(...lastRow);
    const columns: ColumnsType = [
        {
            key: 'STT',
            title: 'STT',
            className: 'text-center',
            dataIndex: 'stt',
            render(value, record, index) {
                return !record.mergeCol ? index + 1 : value
            },
            onCell(data) {
                return {
                    colSpan: data.colSpan
                }
            }
        },
        {
            key: 'SV',
            title: 'Diễn giải',
            dataIndex: 'dichvu',
            className: 'text-center',
            render(value) {
                return value ?? ''
            },
            onCell(data) {
                return {
                    colSpan: data['coldichvu'] ?? 1
                }
            }
        },
        {
            key: 'DVT',
            title: 'ĐVT',
            dataIndex: 'donvitinh',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            width: 90,
            onCell(data) {
                return {
                    colSpan: data['coldonvitinh'] ?? 1
                }
            }
        },
        {
            key: 'CS',
            title: 'Chỉ số cũ',
            dataIndex: 'chisocu',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(data) {
                return {
                    colSpan: data['colchisocu'] ?? 1
                }
            }
        },
        {
            key: 'CSN',
            title: 'Chỉ số mới',
            dataIndex: 'chisomoi',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(data) {
                return {
                    colSpan: data['colchisomoi'] ?? 1
                }
            }
        },
        {
            key: 'HS',
            title: 'Hệ số',
            dataIndex: 'heso',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(data) {
                return {
                    colSpan: data['colheso'] ?? 1
                }
            }
        },
        {
            key: 'DV',
            title: 'Đơn giá',
            dataIndex: 'dongia',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(data) {
                return {
                    colSpan: data['coldongia'] ?? 1
                }
            }
        },
        {
            key: 'SSD',
            title: 'Số sử dụng',
            dataIndex: 'sosudung',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(data) {
                return {
                    colSpan: data['colsosudung'] ?? 1
                }
            }
        },
        {
            key: 'TTT',
            title: 'Tiền trước thuế',
            dataIndex: 'tientruocthue',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
        },
    ];
    return (
        <div className={styles.documentPayment} id={props.id} ref={ref}>
            {!props.noNoti ? <p>Lựa chọn danh sách mã đề nghị để xem văn bản hoặc tạo thông tin văn bản mới!</p> :
                <div className={`boundary ${styles.boundary}`}>
                    <div className={`document ${styles.document}`}>
                        <div className={`flex headerNotiDoc ${styles.headerNotiDoc} ${styles.flex} `}>
                            <div className={`flex directionColumn ${styles.flex} ${styles.directionColumn} `}>
                                <h3>
                                    CÔNG TY CỔ PHẦN
                                    <br />
                                    <span>
                                        TÂN PHONG
                                    </span>
                                    <hr style={{ maxWidth: '70%', margin: 'auto', borderTop: 'none', borderBottom: '1px solid black' }} />
                                </h3>
                                <p>Số: {props.noNoti}</p>
                            </div>
                            <div>
                                <div className={`flex directionColumn slogan ${styles.flex} ${styles.directionColumn} ${styles.slogan}`} style={{ marginBottom: '0.8rem' }}>
                                    <h3>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
                                    <h3>
                                        <b>Độc Lập - Tự Do - Hạnh Phúc</b>
                                        <hr style={{ maxWidth: '50%', margin: 'auto', borderTop: 'none', borderBottom: '1px solid black' }} />
                                    </h3>
                                </div>
                                <p style={{ fontSize: '1.6rem', textAlign: 'right' }} >Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <div className={`content ${styles.content}`}>
                            <h3>THÔNG BÁO PHÍ DỊCH VỤ<br />(Tính đến tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()})</h3>
                            <p>Kính gửi: {crrContract?.ten}</p>
                            <p>Công ty Cổ Phần Tân Phong хin gửi đến Quý Công ty lời lời cảm ơn chân thành ᴠì ѕự quan tâm, ủng hộ ᴠà tin tưởng sử dụng dịch vụ của chúng tôi trong ѕuốt thời gian qua.</p>
                            <p style={{ marginBottom: '1.2rem' }}>Bằng Văn bản nàу, chúng tôi хin thông báo phí sử dụng dịch vụ với các nội dung ѕau:</p>
                            <div className={`table ${styles.table}`}>
                                <Table
                                    columns={columns}
                                    className={styles.tableView}
                                    bordered
                                    dataSource={crrDataPayment}
                                    pagination={false}
                                />
                            </div>
                            <p style={{ marginTop: '1.2rem' }}>Xin chân trọng cám ơn!</p>
                            <div className={`end ${styles.end}`}>
                                <div className={`from ${styles.from}`}>
                                    Nơi gửi:
                                    <div className='text-center'>
                                        Như trên
                                        <br />
                                        Lưu văn thư
                                    </div>
                                </div>
                                <div className={`signCompany ${styles.signCompany}`}>
                                    CÔNG TY CỔ PHẦN TÂN PHONG
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default forwardRef(DocumentNoticontract);