"use client";
import { ModalProps, Modal as ModalComponent, Form, Input, InputNumber, Table, Button, Select } from 'antd';
import React, { useEffect, useRef } from 'react';
import { DefaultOptionType } from 'antd/es/select';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Obj } from '@/global';
import { formatDateToString, toastify, uuid } from '@/utils';
import { useContract, useContractService, useProperty, useService, useTypeProperty, useTypeService } from '@/utils/hooks';
import { getColumns, getDataDetail } from './config';
import { Storages } from './StorageComponent';
import styles from './Storage.module.scss';

interface Props {
    modalProps: ModalProps;
    type: Storages;
    id?: string | number;
    typeModal: 'VIEW' | 'CREATE';
    closeModal: () => void;
}
const schema: Record<Storages, Obj> = {
    CONTRACT: {
        "ten": yup.string().required('Thiếu tên khách!'),
        "sohd": yup.string().required('Thiếu số hợp đồng!'),
        "thoigianthue": yup.number().required('Thiếu thời gian thuê (năm)!'),
        "kythanhtoan_thang_lan_field": yup.number().required('Thiếu kỳ thanh toán (tháng/lần)!'),
        "tongthu": yup.number().required('Thiếu tổng tiền thu!'),
    },
    CT_SV: {},
    PT: {},
    SERVICE: {
        tendichvu: yup.string().required('Chưa nhập tên dịch vụ!'),
        id_loaidichvu: yup.string().required('Chưa có loại dịch vụ!')
    },
    T_PT: {},
    T_SV: {
        tenloaidichvu: yup.string().required('Chưa nhập tên loại dịch vụ!')
    }
}
const initvalues: Record<Storages, Obj> = {
    CONTRACT: {
        "ten": "",
        "sohd": "",
        "thoigianthue": '',
        "kythanhtoan_thang_lan_field": '',
        "tongthu": '',
        "chuthich": "",
        "ngayghi": formatDateToString(new Date()),
        contractServices: []
    },
    SERVICE: {
        id_loaidichvu: '',
        chuthich: '',
        tendichvu: ''
    },
    T_SV: {
        chuthich: '',
        tenloaidichvu: ''
    },
    CT_SV: {},
    PT: {},
    T_PT: {
        tenloaitaisan: '',
        chuthich: ''
    },
}


const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());

const Modal = (props: Props) => {
    const validationSchema = yup.object({
        ...schema[props.type]
    });
    const componentId = useRef(uuid());
    const contractStorage = useContract();
    const serviceStorage = useService();
    const contractService = useContractService();
    const typeService = useTypeService();
    const propertyStorage = useProperty();
    const typePropertyStorage = useTypeProperty();

    const getLoading = contractStorage.state.isLoading || serviceStorage.state.isLoading || contractService.state.isLoading || typeService.state.isLoading || propertyStorage.state.isLoading || typePropertyStorage.state.isLoading;
    const recordData: Record<Storages, () => Obj> = {
        CONTRACT: () => {
            const crrContract = getDataDetail(props.id, contractStorage.state.data as Array<any>, props.type);
            const crrContractServices = getDataDetail(props.id, contractService.state.data as Array<any>, props.type, true);
            return {
                ...crrContract,
                contractServices: crrContractServices?.map((item: Obj, idx: number) => {
                    return {
                        key: idx,
                        ...item,
                        id_hopdong: { ...crrContract },
                        id_dichvu: getDataDetail(item.id_dichvu, serviceStorage.state.data as Array<any>, Storages.SERVICE)

                    }
                })
            }
        },
        SERVICE: () => {
            const crrService = getDataDetail(props.id, serviceStorage.state.data as Array<any>, props.type);
            return {
                ...crrService,
            }
        },
        T_SV: () => {
            const crrTypeService = getDataDetail(props.id, typeService.state.data as Array<any>, props.type);
            return {
                ...crrTypeService
            }
        },
        CT_SV: () => ({}),
        PT: () => ({}),
        T_PT: () => {
            const crrTypePT = getDataDetail(props.id, typePropertyStorage.state.data as Array<any>, props.type);
            return {
                ...crrTypePT
            }
        },
    };
    const { values, errors, handleSubmit, handleChange, setFieldValue, touched, handleBlur, setValues, setTouched } = useFormik({
        initialValues: props.typeModal === 'VIEW' ? recordData[props.type]() : initvalues[props.type],
        validationSchema,
        onSubmit(values) {
            switch (props.type) {
                case Storages.CONTRACT:
                    contractStorage.post?.(componentId.current, {
                        body: values
                    });
                    break;
            }
        }
    });
    const handleCreateNewRowCTSV = () => {
        if (props.type == Storages.CONTRACT) {
            const newRecordCTSV = {
                key: uuid(),
                id_hopdong: {
                    sohd: values.sohd
                },
                dientich_soluong: 0,
                dongia: 0,
                chuthich: ''
            };
            (values.contractServices as Obj[])?.push(newRecordCTSV);
            setValues({ ...values });
        }
    };
    const formData: Record<Storages, React.ReactNode> = {
        CONTRACT: props.type === Storages.CONTRACT ? <>
            <Form.Item>
                <label>Tên khách <span className='error'>*</span></label>
                <Input size="small" name='ten' value={values.ten} onChange={handleChange} onBlur={handleBlur} />
                {errors?.ten && touched?.ten && <p className="error">{errors?.ten as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Số HĐ <span className='error'>*</span></label>
                <Input size="small" name='sohd' value={values.sohd} onChange={(e) => {
                    handleChange(e);
                    (values.contractServices as Obj[]).forEach(ctsv => {
                        ctsv.id_hopdong = {
                            sohd: e.target.value
                        };
                    })
                }} onBlur={handleBlur} />
                {errors?.sohd && touched?.sohd && <p className="error">{errors?.sohd as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Thời gian thuê {'(năm)'} <span className='error'>*</span></label>
                <br />
                <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    onChange={(value) => {
                        setFieldValue('thoigianthue', value);
                    }}
                    name='thoigianthue'
                    value={values.thoigianthue}
                    size="small"
                    onBlur={handleBlur}
                    min={0}
                />
                {errors?.thoigianthue && touched?.thoigianthue && <p className="error">{errors?.thoigianthue as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Kỳ hạn thanh toán {'(tháng/lần)'} <span className='error'>*</span></label>
                <br />
                <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    onChange={(value) => {
                        setFieldValue('kythanhtoan_thang_lan_field', value);
                    }}
                    name='kythanhtoan_thang_lan_field'
                    value={values.kythanhtoan_thang_lan_field}
                    size="small"
                    onBlur={handleBlur}
                    min={0}
                />
                {errors?.kythanhtoan_thang_lan_field && touched?.kythanhtoan_thang_lan_field && <p className="error">{errors?.kythanhtoan_thang_lan_field as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Tổng thu <span className='error'>*</span></label>
                <br />
                <InputNumber<number>
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    onChange={(value) => {
                        setFieldValue('tongthu', value);
                    }}
                    name='tongthu'
                    value={values.tongthu}
                    size="small"
                    onBlur={handleBlur}
                    min={0}
                    style={{ minWidth: '20rem' }}
                />
                {errors?.tongthu && touched?.tongthu && <p className="error">{errors?.tongthu as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Chú thích</label>
                <Input.TextArea size="small" name="chuthich" value={values.chuthich} onChange={handleChange} />
            </Form.Item>
            <div className={styles.tableModal}>
                <Table
                    className={styles.table}
                    bordered
                    columns={(getColumns(Storages.CT_SV, <div>
                        <Button size="small">Xoá</Button>
                    </div>)).filter((col: Obj) => {
                        return col.dataIndex !== 'id_hopdongdichvu'
                    }).map((col: Obj) => {
                        return {
                            ...col,
                            render(value, record: Obj, idx) {
                                return col.key === 'id_hopdong' ? value.sohd : (col.key === 'action' ? <div>
                                    <Button size="small">Xoá</Button>
                                </div> : (col.dataIndex === 'id_dichvu' ? <Select
                                    filterOption={filterOptionSelect}
                                    showSearch
                                    style={{ width: '15rem' }}
                                    placeholder="Chọn dịch vụ"
                                    options={(serviceStorage.state.data as Obj[])?.map((item) => {
                                        return {
                                            label: item.tendichvu,
                                            value: item.id_dichvu
                                        }
                                    })}
                                    value={value?.id_dichvu}
                                    onChange={(value) => {
                                        const crrService = getDataDetail(value, serviceStorage.state.data, Storages.SERVICE);
                                        record.id_dichvu = {
                                            ...crrService
                                        };
                                        setValues({ ...values });
                                    }}
                                /> : (col.key !== 'chuthich' ? <InputNumber<number>
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                    size="small"
                                    value={col.key === 'id_hopdong' ? value.sohd : value}
                                    name={col.dataIndex}
                                    style={{ width: '100%' }}
                                    onChange={(e) => {
                                        const crrService = values.contractServices[idx];
                                        crrService[col.key] = e;
                                        setValues({ ...values });
                                    }} /> : <Input
                                    size="small"
                                    value={value}
                                    name={col.dataIndex}
                                    style={{ width: '100%' }}
                                    onChange={(e) => {
                                        const crrService = values.contractServices[idx];
                                        crrService[col.key] = e.target.value;
                                        setValues({ ...values });
                                    }}
                                />))
                                )
                            }
                        }
                    })}
                    dataSource={values.contractServices?.map((item: Obj) => (item))}
                />
                <Button
                    size="small"
                    disabled={!values.sohd}
                    onClick={() => {
                        handleCreateNewRowCTSV();
                    }}
                >
                    Thêm
                </Button>
            </div>
        </> : <></>,
        SERVICE: props.type === Storages.SERVICE ? <>
            <Form.Item>
                <label>Tên dịch vụ <span className='error'>*</span></label>
                <Input size="small" value={values.tendichvu} name='tendichvu' onChange={handleChange} onBlur={handleBlur} />
                {errors?.tendichvu && <p className="error">{errors?.tendichvu as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Loại dịch vụ <span className='error'>*</span></label>
                <br />
                <Select
                    size="small"
                    filterOption={filterOptionSelect}
                    showSearch
                    style={{ minWidth: '15rem', width: 'fit-content' }}
                    placeholder="Chọn loại dịch vụ"
                    options={(typeService.state.data as Array<Obj>)?.map((sv) => {
                        console.log(sv);
                        return {
                            label: sv.tenloaidichvu,
                            value: sv.id_loaidichvu
                        }
                    })}
                    value={values.id_loaidichvu}
                    onBlur={() => {
                        setTouched({
                            ...touched,
                            'id_loaidichvu': true
                        });
                    }}
                    onChange={(value) => {
                        setFieldValue('id_loaidichvu', value);
                    }}
                />
                {errors?.id_loaidichvu && <p className="error">{errors?.id_loaidichvu as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>
                    Chú thích
                </label>
                <Input.TextArea name='chuthich' onChange={handleChange} />
            </Form.Item>
        </> : <></>,
        T_SV: props.type === Storages.T_SV ? <>
            <Form.Item>
                <label>Tên loại dịch vụ <span className='error'>*</span></label>
                <Input size="small" value={values.tenloaidichvu} name='tenloaidichvu' onChange={handleChange} onBlur={handleBlur} />
                {errors?.tenloaidichvu && <p className="error">{errors?.tenloaidichvu as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>
                    Chú thích
                </label>
                <Input.TextArea name='chuthich' onChange={handleChange} />
            </Form.Item>
        </> : <></>,
        CT_SV: props.type === Storages.CT_SV ? <></> : <></>,
        PT: props.type === Storages.PT ? <></> : <></>,
        T_PT: props.type === Storages.T_PT ? <>
            <Form.Item>
                <label>Tên loại tài sản <span className='error'>*</span></label>
                <Input size="small" value={values.tenloaitaisan} name='tenloaitaisan' onChange={handleChange} onBlur={handleBlur} />
                {errors?.tenloaitaisan && <p className="error">{errors?.tenloaitaisan as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>
                    Chú thích
                </label>
                <Input.TextArea name='chuthich' onChange={handleChange} />
            </Form.Item>
        </> : <></>,
    };
    const handleQueryCreateContractService = () => {
        const getContractId = contractStorage.state.data.id_hopdong;
        const contractServices = (values.contractServices as Array<Obj>)?.map((item) => {
            return {
                ...item,
                id_hopdong: getContractId,
                id_dichvu: (item.id_dichvu as Obj)?.id_dichvu
            }
        });
        if (contractServices.length !== 0) {
            contractService.post?.(componentId.current, {
                body: contractServices
            });
            contractStorage.clear();
        } else {
            props.closeModal();
            toastify('Thêm hợp đồng thành công!', {
                type: 'success'
            });
        }
    }
    useEffect(() => {
        switch (props.type) {
            case Storages.CONTRACT:
                if (props.typeModal === 'CREATE') {
                    if (contractStorage.state.componentId === componentId.current && contractStorage.state.success && !contractService.state.error) {
                        handleQueryCreateContractService();
                    }
                    if (contractStorage.state.error) {
                        toastify(contractStorage.state.error, {
                            type: 'error'
                        });
                    }
                }
        }
    }, [props.type, contractStorage.state, props.typeModal]);
    useEffect(() => {
        if (props.type === Storages.CONTRACT) {
            if (props.typeModal === 'CREATE') {
                if (contractService.state.componentId === componentId.current && contractService.state.success) {
                    contractService.clear();
                    toastify('Thêm hợp đồng thành công!', {
                        type: 'success'
                    });
                    props.closeModal();
                }
                if (contractService.state.error) {
                    toastify(contractService.state.error, {
                        type: 'error'
                    });
                }
            }
        }
    }, [props.type, contractService.state, props.typeModal]);
    return (
        <ModalComponent
            {...props.modalProps}
            onOk={() => {
                handleSubmit();
            }}
            okText="Lưu"
            confirmLoading={getLoading}
        >
            <Form
            >
                {formData[props.type]}
            </Form>
        </ModalComponent>
    )
}

export default Modal;