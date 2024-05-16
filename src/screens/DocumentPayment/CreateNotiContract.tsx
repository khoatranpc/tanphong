"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { DefaultOptionType } from 'antd/es/select';
import { useParams } from 'next/navigation';
import { Button, Input, InputNumber, Select, Table } from 'antd';
import { useFormik } from 'formik';
import { useContract, useContractService, usePaymentContract, useService } from '@/utils/hooks';
import { Obj } from '@/global';
import { toastify, uuid } from '@/utils';
import DocumentNoticontract from './DocumentNoticontract';
import styles from './DocumentPayment.module.scss';

interface Props {
    noNoti: string;
    isCreate?: boolean;
}
const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());
const NotiContract = (props: Props) => {
    const contract = useContract();
    const params = useParams();
    // const crrContract = Array.isArray(contract.state.data as Obj[]) ? (contract.state.data as Obj[])?.find((contract) => String(contract.id_hopdong) === String(params.contractId)) : contract.state.data as Obj;
    const cT = useContractService();
    const crrCT = (cT.state.data as Obj[])?.filter(item => String(item.id_hopdong) === String(params.contractId));
    const service = useService();
    const componentId = useRef(uuid());
    const [signCompany, setSignCompany] = useState('');
    const paymentContract = usePaymentContract();
    const isCreated = useRef(false);
    const { values, setValues } = useFormik({
        initialValues: crrCT?.map((item: Obj, idx) => {
            return {
                dichvu: item?.id_dichvu,
                key: uuid(),
                sosudung: 0,
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
                return index
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
                    disabled={!!crrCT?.[index]}
                    size="small"
                    danger
                    onClick={() => {
                        if (!crrCT?.[index]) {
                            values.splice(index, 1);
                            setValues([...values]);
                        }
                    }}
                >
                    Xoá
                </Button>
            }
        }
    ];
    const getLoading = contract.state.isLoading || cT.state.isLoading || service.state.isLoading;
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
                paymentContract.post?.(componentId.current, {
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
        contract.get?.(componentId.current, {
            params: [String(params?.contractId)],
        });
        paymentContract.get?.(componentId.current);
        if (!cT.state.data) {
            cT.get?.(componentId.current);
        }
        if (!service.state.data) {
            service.get?.(componentId.current);
        }
        return () => {
            contract.get?.();
        }
    }, []);
    useEffect(() => {
        if (cT.state.data) {
            setValues(crrCT?.map((item) => {
                return {
                    dichvu: item?.id_dichvu,
                    key: uuid(),
                    sosudung: 0,
                    ...item,
                }
            }));
        }
    }, [cT.state.data]);
    return (
        <div className={styles.notiContract}>
            {
                props.isCreate ? (getLoading ? <div>Đang tải...</div> :
                    <div className={styles.content}>
                        <div className={`${styles.flex} ${styles.no}`}>Ký hiệu Công ty: <input style={{ marginLeft: '0.8rem', outline: 'none' }} value={signCompany} onChange={(e) => setSignCompany(e.target.value)} /></div>
                        <div className={styles.table}>
                            <div style={{ textAlign: 'right', marginBottom: '1.2rem' }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setValues([...values, {
                                            key: uuid(),
                                            dichvu: '',
                                            sosudung: 0
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
                    </div>) : (<DocumentNoticontract noNoti={props.noNoti} />)
            }

        </div>
    )
}

export default NotiContract;