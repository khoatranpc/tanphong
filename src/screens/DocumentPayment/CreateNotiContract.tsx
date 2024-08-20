"use client";
import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { DefaultOptionType } from 'antd/es/select';
import { useParams } from 'next/navigation';
import { Button, Input, InputNumber, Select, Switch, Table } from 'antd';
import { useFormik } from 'formik';
import { useContract, useContractService, useContractServiceForThanhToan, usePaymentContract, useService } from '@/utils/hooks';
import { Obj } from '@/global';
import { ResultHook, toastify, uuid } from '@/utils';
import DocumentNoticontract from './DocumentNoticontract';
import styles from './DocumentPayment.module.scss';
import { optionUnit } from '../Storage/config';

interface Props {
    noNoti: string;
    isCreate?: boolean;
    isUpdate?: boolean;
    ref: React.RefObject<any>;
    paymentContract: ResultHook;
    parentComponentId: string;
    id: string;
}
const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());
const NotiContract = (props: Props, ref: any) => {
    const contract = useContract();
    const params = useParams();
    const cT = useContractService();
    const service = useService();
    const paymentContract = props.paymentContract;
    const tmpDataPayment = usePaymentContract();
    const contractServiceForThanhToan = useContractServiceForThanhToan();
    const getDataCSfTT = contractServiceForThanhToan.state.data?.data as Obj[];
    const dataPaymentContract = ((paymentContract.state.data as Obj[])?.find(item => String(item.id_hopdong) === String(params?.contractId) && item.sotbdv === props.noNoti)) as Obj;
    const crrCT = props.isCreate ? getDataCSfTT?.map((item) => {
        return {
            sosudung: item.soluong ?? 1,
            ...item,
            heso: item.heso ?? 1,
            loaithue: item.loaithue ?? 10,
            dichvu: ((service.state.data as Obj[])?.find(sv => {
                return String(sv.id_dichvu) === String(item.id_dichvu)
            }))?.id_dichvu,
            key: uuid()
        }
    }) : (dataPaymentContract?.thanhtoan as Obj[])?.map((item) => {
        return {
            sosudung: item.soluong ?? 1,
            ...item,
            heso: item.heso ?? 1,
            loaithue: item.loaithue ?? 10,
            dichvu: ((service.state.data as Obj[])?.find(sv => String(sv.id_dichvu) === String(item.dichvu)))?.id_dichvu,
            key: uuid()
        }
    }) as Obj[];
    const componentId = useRef(uuid());
    const [signCompany, setSignCompany] = useState(props.noNoti.split("ĐNTT-DV/")[1] ?? '');
    const [isViewDoc, setIsViewDoc] = useState(false);
    const [discount, setDiscount] = useState(2);
    const isCreated = useRef(false);
    const mapValues = crrCT?.map((item: any, idx) => {
        return {
            dichvu: item?.id_dichvu,
            key: uuid(),
            ...item,
        }
    });
    const { values, setValues } = useFormik({
        initialValues: mapValues,
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
                    style={{ width: '100%' }}
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
                return <Select
                    value={value}
                    size='small'
                    style={{ width: '8rem' }}
                    options={optionUnit.map((item) => {
                        return {
                            value: item,
                            label: item
                        }
                    })}
                    onChange={(value) => {
                        (values[index] as Obj)!.donvitinh = value;
                        setValues([...values]);
                    }}
                />
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
                        if (record.id_dichvu === 7 || record.id_dichvu === 32 || record.id_dichvu === 33 || record.id_dichvu == 34) {
                            if ((values[index] as Obj)!.chisomoi) {
                                (values[index] as Obj)!.sosudung = Number((values[index] as Obj)!.chisomoi) - Number((values[index] as Obj)!.chisocu);
                            }
                        }
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
                        if (record.id_dichvu === 7 || record.id_dichvu === 32 || record.id_dichvu === 33 || record.id_dichvu == 34) {
                            if ((values[index] as Obj)!.chisocu >= 0) {
                                (values[index] as Obj)!.sosudung = Number((values[index] as Obj)!.chisomoi) - Number((values[index] as Obj)!.chisocu);
                            }
                        }
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
                    min={1}
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
                    min={0}
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
            className: 'text-center',
            render(_, record: any, index) {
                return <Button
                    size="small"
                    danger
                    onClick={() => {
                        console.log(record);
                        if (!isViewDoc) {
                            if (crrCT?.[index]) {
                                if (record.id) {
                                    paymentContract.delete?.(componentId.current, {
                                        params: [record.id]
                                    }, undefined, undefined, 'DELETE');
                                } else {
                                    values.splice(index, 1);
                                    setValues([...values]);
                                }
                            } else {
                                values.splice(index, 1);
                                setValues([...values]);
                            }
                        }
                    }}
                >
                    Xoá
                </Button>
            }
        }
    ];
    const getLoading = contract.state.isLoading || cT.state.isLoading || service.state.isLoading || paymentContract.state.isLoading || tmpDataPayment.state.isLoading;
    const handleSubmit = () => {
        const isInValid = values.some((item: Obj) => {
            return !(typeof item.dongia === 'number' && typeof item.loaithue === 'number');
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
                const sodntt = `${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}/${new Date().getFullYear()}/TB-DV/${signCompany}`;
                const sotbdv = `${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}/${new Date().getFullYear()}/ĐNTT-DV/${signCompany}`;
                const payload = {
                    thanhtoan: values,
                    ...props.isCreate ? {
                        thoigiantao: new Date(),
                        sodntt,
                        sotbdv,
                        id_hopdong: params.contractId
                    } : {
                        id: dataPaymentContract?.id,
                        sodntt: dataPaymentContract?.sodntt,
                        sotbdv: dataPaymentContract?.sotbdv,
                    },
                    giamtru: discount
                };
                (paymentContract[props.isCreate ? 'post' : 'put'])?.(props.parentComponentId, {
                    body: payload
                }, undefined, undefined, props.isCreate ? 'post' : 'put');
            }
        }
    }
    useEffect(() => {
        setSignCompany(!props.isCreate ? props.noNoti.split("ĐNTT-DV/")[1] : '');
    }, [props.noNoti, props.isCreate]);
    useEffect(() => {
        contractServiceForThanhToan.get?.(componentId.current, {
            queryParams: {
                id_hopdong: params?.contractId
            }
        });
    }, []);
    useEffect(() => {
        if (crrCT) {
            setValues([...crrCT as any]);
        }
        if (paymentContract.state.data) {
            setDiscount(dataPaymentContract?.giamtru ?? 2);
        }
    }, [props.isUpdate, props.isCreate, props.noNoti, cT.state.data, paymentContract.state.data]);
    useEffect(() => {
        if (tmpDataPayment.state.method === 'DELETE' && tmpDataPayment.state.success) {
            toastify('Xoá thông tin thành công', {
                type: 'success'
            });
            tmpDataPayment.get?.(props.parentComponentId, {
                queryParams: {
                    id_hopdong: params?.contractId
                }
            }, undefined, undefined, "GET");
        }
        if (tmpDataPayment.state.data && tmpDataPayment.state.data.error && !tmpDataPayment.state.isLoading) {
            toastify(tmpDataPayment.state.data.message, {
                type: 'error'
            });
            tmpDataPayment.get?.(props.parentComponentId, {
                queryParams: {
                    id_hopdong: params?.contractId
                }
            }, undefined, undefined, "GET");
        }
        if (tmpDataPayment.state.data && tmpDataPayment.state.method === 'put' && !tmpDataPayment.state.isLoading) {
            if (tmpDataPayment.state.success) {
                toastify('Lưu thông tin thanh toán thành công!', {
                    type: 'success'
                });
            } else {
                toastify('Lưu thông tin thất bại, vui lòng thử lại sau!', {
                    type: 'error'
                });
            }
        }
    }, [tmpDataPayment.state]);
    return (
        <div className={styles.notiContract} >
            {!props.isCreate && <Switch checkedChildren="Chỉnh sửa" unCheckedChildren="Văn bản" className={styles.switch} defaultChecked={!isViewDoc} onChange={(checked) => setIsViewDoc(!checked)} />}
            {
                isViewDoc ?
                    <DocumentNoticontract noNoti={props.noNoti} ref={ref} id={props.id} /> :
                    <div className={styles.content}>
                        <div className={`${styles.flex} ${styles.no}`}>Ký hiệu TBDV: {props.noNoti ? props.noNoti : <Input disabled={!crrCT} size="small" style={{ marginLeft: '0.8rem', outline: 'none', width: '60rem' }} value={signCompany} onChange={(e) => {
                            setSignCompany(e.target.value);
                        }} />}</div>
                        <div className={styles.table}>
                            <div style={{ textAlign: 'right', marginBottom: '1.2rem' }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setValues([...values, {
                                            key: uuid(),
                                            dichvu: '',
                                            sosudung: 1,
                                            id_hopdongthanhtoan: dataPaymentContract?.id,
                                            heso: 1,
                                            loaithue: 10
                                        }]);
                                    }}
                                    disabled={!crrCT}
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
                            <div className={styles.discount}>
                                <label>Phần trăm giảm trừ:</label>
                                <InputNumber<number>
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                    size="small"
                                    value={discount}
                                    min={0}
                                    onChange={(value) => {
                                        setDiscount(value ?? 0);
                                    }}
                                    disabled={!crrCT}
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '1.2rem' }}>
                                <Button
                                    size="small"
                                    disabled={!crrCT}
                                    onClick={() => {
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

export default memo(forwardRef(NotiContract), (prevProps, nextProps) => {
    if (!prevProps.paymentContract.state.componentId) {
        return false;
    }
    if (prevProps.paymentContract.state.componentId && nextProps.paymentContract.state.componentId && prevProps.paymentContract.state.componentId === nextProps.paymentContract.state.componentId) {
        return false;
    }
    return true;
});