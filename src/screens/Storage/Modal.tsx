import { ModalProps, Modal as ModalComponent, Form, Input, InputNumber, Table } from 'antd';
import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Obj } from '@/global';
import { useContract, useContractService, useProperty, useService, useTypeProperty, useTypeService } from '@/utils/hooks';
import { Storages } from '.';
import { getColumns, getDataDetail } from './config';
import styles from './Storage.module.scss';

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
        "thoigianthue": 0,
        "kythanhtoan_thang_lan_field": 0,
        "tongthu": 0,
        "chuthich": "",
        "ngayghi": new Date().toString()
    },
    CT_SV: {},
    PT: {},
    SERVICE: {},
    T_PT: {},
    T_SV: {}
}

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
                    console.log(item);
                    return {
                        key: idx,
                        ...item,
                        ...crrContract,
                        id_hopdong: crrContract,
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
    }
    const { values, errors, handleSubmit, handleChange, setFieldValue, touched, handleBlur } = useFormik({
        initialValues: props.typeModal === 'VIEW' ? recordData[props.type]() : initvalues[props.type],
        validationSchema,
        onSubmit(values) {
            console.log(values);
        }
    });
    const formDate: Record<Storages, React.ReactNode> = {
        CONTRACT: <>
            <Form.Item>
                <label>Tên khách <span className='error'>*</span></label>
                <Input size="small" name='ten' value={values.ten} onChange={handleChange} onBlur={handleBlur} />
                {errors?.ten && touched?.ten && <p className="error">{errors?.ten as string}</p>}
            </Form.Item>
            <Form.Item>
                <label>Số HĐ <span className='error'>*</span></label>
                <Input size="small" name='sohd' value={values.sohd} onChange={handleChange} onBlur={handleBlur} />
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
            <Table
                className={styles.table}
                bordered
                columns={getColumns(Storages.CT_SV)}
                dataSource={values.contractServices}
            />
        </>,
        CT_SV: <></>,
        PT: <></>,
        SERVICE: <></>,
        T_PT: <></>,
        T_SV: <></>
    }
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