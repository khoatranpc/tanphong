import { ModalProps, Modal as ModalComponent, Form, Input, InputNumber, Table, Button, Select } from 'antd';
import React from 'react';
import { DefaultOptionType } from 'antd/es/select';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Obj } from '@/global';
import { uuid } from '@/utils';
import { useContract, useContractService, useProperty, useService, useTypeProperty, useTypeService } from '@/utils/hooks';
import { getColumns, getDataDetail } from './config';
import styles from './Storage.module.scss';
import { Storages } from './StorageComponent';

interface Props {
    modalProps: ModalProps;
    type: Storages;
    id?: string | number;
    typeModal: 'VIEW' | 'CREATE';
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
    SERVICE: {},
    T_PT: {},
    T_SV: {}
}
const initvalues: Record<Storages, Obj> = {
    CONTRACT: {
        "ten": "",
        "sohd": "",
        "thoigianthue": '',
        "kythanhtoan_thang_lan_field": '',
        "tongthu": '',
        "chuthich": "",
        "ngayghi": new Date().toString(),
        contractServices: []
    },
    CT_SV: {},
    PT: {},
    SERVICE: {},
    T_PT: {},
    T_SV: {}
}


const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());

const Modal = (props: Props) => {
    const validationSchema = yup.object({
        ...schema[props.type]
    });
    const contractStorage = useContract();
    const serviceStorage = useService();
    const contractService = useContractService();
    const typeService = useTypeService();
    const propertyStorage = useProperty();
    const typePropertyStorage = useTypeProperty();

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
        CT_SV: () => ({}),
        PT: () => ({}),
        SERVICE: () => ({}),
        T_PT: () => ({}),
        T_SV: () => ({})
    };
    const { values, errors, handleSubmit, handleChange, setFieldValue, touched, handleBlur, setValues } = useFormik({
        initialValues: props.typeModal === 'VIEW' ? recordData[props.type]() : initvalues[props.type],
        validationSchema,
        onSubmit(values) {
            console.log(values);
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
                chuthich: 'ahihi'
            };
            (values.contractServices as Obj[])?.push(newRecordCTSV);
            setValues({ ...values });
        }
    };
    const formDate: Record<Storages, React.ReactNode> = {
        CONTRACT: <>
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
                    dataSource={values.contractServices.map((item: Obj) => (item))}
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
        </>,
        CT_SV: <></>,
        PT: <></>,
        SERVICE: <></>,
        T_PT: <></>,
        T_SV: <></>
    };
    return (
        <ModalComponent
            {...props.modalProps}
            onOk={() => {
                handleSubmit();
            }}
        >
            <Form
            >
                {formDate[props.type]}
            </Form>
        </ModalComponent>
    )
}

export default Modal;