"use client";
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { DefaultOptionType } from 'antd/es/select';
import { useParams } from 'next/navigation';
import { Button, Input, InputNumber, Select, Switch, Table } from 'antd';
import { useFormik } from 'formik';
import { useContract, useContractService, usePaymentContract, useService } from '@/utils/hooks';
import { Obj } from '@/global';
import { toastify, uuid } from '@/utils';
import DocumentNoticontract from './DocumentNoticontract';
import styles from './DocumentPayment.module.scss';

interface Props {
    noNoti: string;
    isCreate?: boolean;
    isUpdate?: boolean;
    ref: React.RefObject<any>;
}
const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());
const NotiContract = (props: Props, ref: any) => {
    const contract = useContract();
    const params = useParams();
    const cT = useContractService();
    const service = useService();
    const paymentContract = usePaymentContract();
    const crrCT = props.isCreate ? (cT.state.data as Obj[])?.filter(item => String(item.id_hopdong) === String(params.contractId)) : ((paymentContract.state.data as Obj[])?.filter(item => String(item.id_hopdong) === String(params?.contractId) && item.sotbdv === props.noNoti))?.map((item) => {
        return {
            ...item,
            dichvu: ((service.state.data as Obj[])?.find(sv => String(sv.id_dichvu) === String(item.dichvu)))?.tendichvu,
            key: uuid()
        }
    }) as Obj[];
    const componentId = useRef(uuid());
    const [signCompany, setSignCompany] = useState(props.noNoti.split("ĐNTT-DV/")[1] ?? '');
    const [isViewDoc, setIsViewDoc] = useState(false);

    const isCreated = useRef(false);
    const { values, setValues } = useFormik({
        initialValues: crrCT?.map((item: Obj, idx) => {
            return {
                dichvu: item?.id_dichvu,
                key: uuid(),
                sosudung: 1,
                ...item,
            }
        }),
        onSubmit() {
        }
    });
    const columns: ColumnsType = [
        {
            key: 'STT',
            title: 'STT',
            render(_, __, index) {
                return index + 1;
            },
            className: 'text-center'
        },
        {
            key: 'SV',
            title: 'Diễn giải',
            dataIndex: 'dichvu',
            render(value, record, idx) {
                return record ? <Select
                    value={value}
                    size="small"
                    filterOption={filterOptionSelect}
                    showSearch
                    style={{ width: '15rem' }}
                    placeholder="Chọn dịch vụ"
                    options={(service.state.data as Obj[])?.map((item) => {
                        return {
                            label: item.tendichvu,
                            value: item.id_dichvu
                        }
                    })}
                    onChange={(value) => {
                        (values[idx] as Obj)!.dichvu = value as string;
                        setValues([...values]);
                    }}
                /> : ''
            },
        },
        {
            key: 'DVT',
            title: 'ĐVT',
            dataIndex: 'donvitinh',
            render(value, record, index) {
                return <Input size="small" placeholder="VD: Tháng, Đồng, USD,..." value={value} onChange={(e) => {
                    (values[index] as Obj)!.donvitinh = e.target.value;
                    setValues([...values]);
                }} />
            },
            width: 150
        },
        {
            key: 'CS',
            title: 'Chỉ số cũ',
            dataIndex: 'chisocu',
            render(value, record, index) {
                return <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    size="small"
                    value={value}
                    onChange={(value) => {
                        (values[index] as Obj)!.chisocu = value;
                        setValues([...values]);
                    }}
                />
            },
        },
        {
            key: 'CSN',
            title: 'Chỉ số mới',
            dataIndex: 'chisomoi',
            render(value, record, index) {
                return <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    size="small"
                    value={value}
                    onChange={(value) => {
                        (values[index] as Obj)!.chisomoi = value;
                        setValues([...values]);
                    }}
                />
            },
        },
        {
            key: 'HS',
            title: 'Hệ số',
            dataIndex: 'heso',
            render(value, record, index) {
                return <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    size="small"
                    value={value}
                    onChange={(value) => {
                        (values[index] as Obj)!.heso = value;
                        setValues([...values]);
                    }}
                />
            },
        },
        {
            key: 'DV',
            title: 'Đơn giá',
            dataIndex: 'dongia',
            render(value, record, index) {
                return <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    size="small"
                    value={value}
                    onChange={(value) => {
                        (values[index] as Obj)!.dongia = value;
                        setValues([...values]);
                    }}
                />
            },
        },
        {
            key: 'SSD',
            title: 'Số sử dụng',
            dataIndex: 'sosudung',
            render(value, record, index) {
                return <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    size="small"
                    value={value}
                    onChange={(value) => {
                        (values[index] as Obj)!.sosudung = value;
                        setValues([...values]);
                    }}
                    min={1}
                />
            },
        },
        {
            key: 'TAX',
            title: 'Thuế',
            dataIndex: 'loaithue',
            render(value, record, index) {
                return <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    size="small"
                    value={value}
                    onChange={(value) => {
                        (values[index] as Obj)!.loaithue = value;
                        setValues([...values]);
                    }}
                />
            },
        },
        {
            key: 'ACT',
            title: 'Hành động',
            render(_, __, index) {
                return <Button
                    size="small"
                    danger
                    onClick={() => {
                    }}
                >
                    Xoá
                </Button>
            }
        }
    ];
    const getLoading = contract.state.isLoading || cT.state.isLoading || service.state.isLoading || paymentContract.state.isLoading;
    const handleSubmit = () => {
        const isInValid = values.some((item: Obj) => {
            return !(item.dongia && item.loaithue) || !(Number(item.dongia) && Number(item.loaithue));
        });
        if (isInValid) {
            toastify('Bạn chưa điền một số thông tin về đơn giá hoặc loại thuế!', {
                type: 'error'
            });
        } else {
            if (!signCompany) {
                toastify('Bạn chưa điền ký hiệu công ty!', {
                    type: 'error'
                });
            } else {
                isCreated.current = true;
                const data = values.map((item) => {
                    return {
                        ...item,
                        sodntt: `${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}/${new Date().getFullYear()}/TB-DV/${signCompany}`,
                        sotbdv: `${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}/${new Date().getFullYear()}/ĐNTT-DV/${signCompany}`,
                        id_hopdong: params.contractId
                    }
                });
                (paymentContract[props.isCreate ? 'post' : 'put'])?.(componentId.current, {
                    body: data
                });
            }
        }
    }
    useEffect(() => {
        if (paymentContract.state.data && isCreated.current) {
            isCreated.current = false;
            if (paymentContract.state.success) {
                toastify('Lưu thông tin thanh toán thàn công!', {
                    type: 'success'
                });
                paymentContract.clear();
            } else {
                toastify('Lưu thông tin thất bại, vui lòng thử lại sau!', {
                    type: 'error'
                });
                paymentContract.clear(); paymentContract.clear();
            }
        }
    }, [paymentContract.state.data]);
    useEffect(() => {
        setSignCompany(!props.isCreate ? props.noNoti.split("ĐNTT-DV/")[1] : '');
    }, [props.noNoti, props.isCreate]);
    useEffect(() => {
        if (crrCT) {
            setValues([...crrCT as any]);
        }
    }, [props.isUpdate, props.isCreate, props.noNoti, cT.state.data, paymentContract.state.data]);
    return (
        <div className={styles.notiContract} >
            {!props.isCreate && <Switch checkedChildren="Chỉnh sửa" unCheckedChildren="Văn bản" className={styles.switch} defaultChecked={!isViewDoc} onChange={(checked) => setIsViewDoc(!checked)} />}
            {
                isViewDoc ?
                    <DocumentNoticontract noNoti={props.noNoti} ref={props.ref} /> :
                    <div className={styles.content}>
                        <div className={`${styles.flex} ${styles.no}`}>Ký hiệu TBDV: <input style={{ marginLeft: '0.8rem', outline: 'none' }} value={signCompany} onChange={(e) => {
                            if (!props.isUpdate) {
                                setSignCompany(e.target.value);
                            }
                        }} /></div>
                        <div className={styles.table}>
                            <div style={{ textAlign: 'right', marginBottom: '1.2rem' }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setValues([...values, {
                                            key: uuid(),
                                            dichvu: '',
                                            sosudung: 1
                                        }]);
                                    }}
                                >
                                    Thêm
                                </Button>
                            </div>
                            <Table
                                className={styles.tableContent}
                                columns={columns}
                                dataSource={values}
                                pagination={false}
                                loading={getLoading}
                            />
                            <div style={{ textAlign: 'right', marginTop: '1.2rem' }}>
                                <Button size="small" onClick={() => {
                                    handleSubmit();
                                }}
                                    loading={paymentContract.state.isLoading}
                                >
                                    Lưu
                                </Button>
                            </div>
                        </div>
                    </div>
            }

        </div>
    )
}

export default forwardRef(NotiContract);