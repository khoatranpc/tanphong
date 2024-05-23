"use client";
import React, { forwardRef } from 'react';
import { Table } from 'antd';
import { useParams } from 'next/navigation';
import { ColumnsType } from 'antd/es/table';
import { Obj } from '@/global';
import { numberToVNWords, uuid } from '@/utils';
import { useContract, usePaymentContract, useService } from '@/utils/hooks';
import styles from './DocumentPayment.module.scss';

interface Props {
    noNoti: string;
    noPayrequest: string;
    ref: React.RefObject<any>;
    id: string;
}
const PayRequest = (props: Props, ref: any) => {
    const paymentContract = usePaymentContract();
    const params = useParams();
    const contract = useContract();
    const crrContract = Array.isArray(contract.state.data as Obj[]) ? (contract.state.data as Obj[])?.find((contract) => String(contract.id_hopdong) === String(params?.contractId)) : contract.state.data as Obj;
    const service = useService();
    const dataPaymentContract = ((paymentContract.state.data as Obj[])?.find(item => String(item.id_hopdong) === String(params?.contractId) && item.sotbdv === props.noNoti)) as Obj;
    const crrDataPayment: Obj[] = (dataPaymentContract?.thanhtoan as any[])?.map((item) => {
        return {
            ...item,
            dichvu: ((service.state.data as Obj[])?.find(sv => String(sv.id_dichvu) === String(item.dichvu)))?.tendichvu,
            key: uuid()
        }
    });
    const groupTax: Obj = {};
    crrDataPayment?.forEach(element => {
        if (element.loaithue) {
            if (!groupTax[element.loaithue]) {
                groupTax[element.loaithue] = 0;
            }
            groupTax[element.loaithue] += element.thue
        }
    });
    const addRows: Obj[] = [
        {
            dichvu: 'Tổng tiền trước thuế',
            coldichvu: 3,
            coltientruocthue: 0,
            colthue: 0,
            tiensauthue: crrDataPayment?.reduce((prevValue, crrItem) => {
                return {
                    tientruocthue: prevValue.tientruocthue + crrItem.tientruocthue
                }
            }, {
                tientruocthue: 0
            }).tientruocthue,
            key: uuid()
        },
        ...Object.keys(groupTax).length ? Object.keys(groupTax).map((item, idx) => {
            return {
                dichvu: `Tiền thuế (${item}%)`,
                coldichvu: 3,
                coltientruocthue: 0,
                colthue: 0,
                tiensauthue: groupTax[item],
                key: uuid()
            }
        }) : [],
        {
            dichvu: 'Giảm trừ',
            coldichvu: 3,
            coltientruocthue: 0,
            colthue: 0,
            key: uuid(),
            tiensauthue: dataPaymentContract?.giamtru
        },
        {
            dichvu: 'Tổng tiền sau thuế',
            coldichvu: 3,
            coltientruocthue: 0,
            colthue: 0,
            tiensauthue: crrDataPayment?.reduce((prevValue, crrItem) => {
                return {
                    tiensauthue: prevValue.tiensauthue + crrItem.tiensauthue
                }
            }, {
                tiensauthue: 0
            }).tiensauthue,
            key: uuid()
        },
        {
            dichvu: 'Số đề nghị thanh toán',
            coldichvu: 3,
            coltientruocthue: 0,
            colthue: 0,
            tiensauthue: crrDataPayment?.reduce((prevValue, crrItem) => {
                return {
                    tiensauthue: prevValue.tiensauthue + crrItem.tiensauthue
                }
            }, {
                tiensauthue: 0
            }).tiensauthue - dataPaymentContract?.giamtru,
            key: uuid()
        },
    ];
    crrDataPayment?.push(...addRows);
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
                    colSpan: data.colSpan,
                }
            }
        },
        {
            key: 'SV',
            title: 'Nội dung',
            dataIndex: 'dichvu',
            className: 'text-center',
            render(value) {
                return value ?? ''
            },
            onCell(data) {
                return {
                    colSpan: data['coldichvu'] ?? 1,
                    className: 'text-left'
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
            onCell(data) {
                return {
                    colSpan: data['coltientruocthue'] ?? 1,
                }
            }
        },
        {
            key: 'TAX',
            title: 'Thuế',
            dataIndex: 'thue',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(data) {
                return {
                    colSpan: data['colthue'] ?? 1,
                }
            }
        },
        {
            key: 'AFTAX',
            title: 'Tiền sau thuế',
            dataIndex: 'tiensauthue',
            className: 'text-center',
            render(value, record, index) {
                return value ? (Number(value) ? Number(value).toLocaleString(undefined, { minimumIntegerDigits: 2 }) : value) : ''
            },
            onCell(_, idx) {
                return {
                    style: {
                        fontWeight: idx === crrDataPayment?.length - 1 ? 'bold' : 'unset'
                    }
                }
            }
        },
    ];
    return (
        <div ref={ref}>
            <div className={styles.payRequest} id={props.id} >
                <div className={styles.logo}>
                    <img alt='' src={`/hp.png`} className={styles.imgLogo} />
                    <div className={styles.companyInfo}>
                        <h2>CÔNG TY CỔ PHẦN TÂN PHONG</h2>
                        <div className={styles.address}>
                            <p style={{ textAlign: 'center' }}>Địa chỉ: Khu 15, TT Hùng Sơn, Huyện Lâm Thao, Tỉnh Phú Thọ</p>
                            <p className={styles.connect}>{'Website: www.tanphonggroup.com.vn    Email: tanphongtea@gmail.com'}</p>
                            <p>Tel:  {'(+84) 904 527 527'}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.notiPayrequest}>
                    <div className={styles.backgroundColor}></div>
                    <div className={styles.contentNoti}>
                        <h2 style={{ marginBottom: '0.3rem' }}>ĐỀ NGHỊ THANH TOÁN</h2>
                        <p>Số: <i>{props.noPayrequest}</i></p>
                    </div>
                </div>
                <p className={styles.date}>
                    <i>Phú Thọ, Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</i>
                </p>
                <div className={styles.contentDocPayment}>
                    <p className={`text-center`}>
                        <u><i>Kính gửi</i></u>: <b>{crrContract?.ten}</b>
                    </p>
                    <ul>
                        <li>Căn cứ hợp đồng số: {crrContract && <>{crrContract?.sohd} Ngày {new Date(crrContract?.ngayghi).getDate()} tháng {new Date(crrContract?.ngayghi).getMonth() + 1} năm {new Date(crrContract?.ngayghi).getFullYear()}</>};</li>
                        <li>Căn cứ tình hình hoạt động và sử dụng các dịch vụ cung cấp tại Cụm công nghiệp Đồng Lạng, xã Phú Ninh, huyện Phù Ninh, tỉnh Phú Thọ.</li>
                        <li>Căn cứ vào các biên bản nghiệm thu khối lượng sử dụng và các bảng xác định giá trị khối lượng sử dụng hoàn thành theo Thông báo phí dịch vụ số {props.noNoti};</li>
                    </ul>
                    <p>Công ty Cổ Phần Tân Phong xin đề nghị Quý {crrContract?.ten} thanh toán tiền phí sử dụng dịch vụ tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()} với nội dung như sau:</p>
                    <Table
                        className={styles.tableView}
                        columns={columns}
                        dataSource={crrDataPayment}
                        pagination={false}
                        bordered
                    />
                    <p style={{ textAlign: 'right', marginTop: '1.2rem', marginBottom: '1.2rem' }}>(Bằng chữ: <i>{numberToVNWords(crrDataPayment?.[crrDataPayment?.length - 1]?.tiensauthue as number)} đồng</i>)</p>
                    <ul className={styles.bank}>
                        <li>Tên tài khoản: <b>CÔNG TY CỔ PHẦN TÂN PHONG</b></li>
                        <li>Số tài khoản: <b>0801 000 000 666 tại Ngân hàng Thương mại cổ phần Ngoại thương Việt Nam- Chi nhánh Phú Thọ, tỉnh Phú Thọ ( Vietcombank)</b>
                        </li>
                        <li>Đề nghị Quý Công ty quyết toán cho chúng tôi theo thông báo này bằng tiền mặt hoặc chuyển khoản trước ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</li>
                    </ul>
                    <p>Sau ngày này nếu chưa thanh toán. Công ty Cổ phần Tân Phong sẽ ngưng cung cấp các dịch vụ trên</p>
                    <p>Rất mong nhận được sự xem xét của Quý {crrContract?.ten}!</p>
                    <div className={styles.end}>
                        <div className={styles.from}>
                            Nơi gửi:
                            <div className='text-center'>
                                Như trên
                                <br />
                                Lưu văn thư
                            </div>
                        </div>
                        <div className={styles.signCompany}>
                            CÔNG TY CỔ PHẦN TÂN PHONG
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(PayRequest);