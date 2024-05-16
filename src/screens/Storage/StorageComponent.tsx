"use client";
import React, { memo, useEffect, useState } from 'react';
import { Button, Input, Popconfirm, Select, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ReloadOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';
import { Obj } from '@/global';
import { ResultHook, toastify } from '@/utils';
import { getColumns, getNameState } from './config';
import Modal from './Modal';
import styles from './Storage.module.scss';

export enum Storages {
    CONTRACT = 'CONTRACT',
    SERVICE = 'SERVICE',
    //hợp đồng dịch vụ
    CT_SV = 'CT_SV',
    // loại dịch vụ
    T_SV = 'T_SV',
    // tài sản
    PT = 'PT',
    // loại tài sản
    T_PT = 'T_PT'
}
export const getIdData: Record<Storages, string> = {
    CONTRACT: 'id_hopdong',
    CT_SV: 'id_hopdongdichvu',
    PT: 'id_taisan',
    SERVICE: 'id_dichvu',
    T_PT: 'id_loaitaisan',
    T_SV: 'id_loaidichvu'
}
const getStorages: Record<string, string> = {
    CONTRACT: 'Hợp đồng',
    SERVICE: 'Dịch vụ',
    T_SV: 'Loại dịch vụ',
    PT: 'Tài sản',
    T_PT: 'Loại tài sản',
}


const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());


export interface StorageComponentProps {
    contractStorage: ResultHook;
    serviceStorage: ResultHook;
    contractService: ResultHook;
    typeService: ResultHook;
    propertyStorage: ResultHook;
    typePropertyStorage: ResultHook;
    typeStorage: Storages | string;
    setTypeStorage: React.Dispatch<React.SetStateAction<any>>;
    componentId: string;
}
const StorageComponent = (props: StorageComponentProps) => {

    const contractStorage = props.contractStorage;
    const serviceStorage = props.serviceStorage;
    const contractService = props.contractService;
    const typeService = props.typeService;
    const propertyStorage = props.propertyStorage;
    const typePropertyStorage = props.typePropertyStorage;
    const [searchValue, setSeachValue] = useState<string>('');
    const [delSuccess, setDelSuccess] = useState(false);
    const router = useRouter();
    const dataState: Record<Storages, ResultHook> = {
        CONTRACT: contractStorage,
        SERVICE: serviceStorage,
        CT_SV: contractService,
        T_SV: typeService,
        PT: propertyStorage,
        T_PT: typePropertyStorage,
    }
    const [modal, setModal] = useState<{
        open: boolean;
        type: 'VIEW' | 'CREATE';
        id?: string | number
    }>({
        open: false,
        type: 'CREATE',
        id: -1
    });

    const getTitleModal: Record<Storages, string> = {
        CONTRACT: modal.type === 'CREATE' ? 'Tạo hợp đồng' : 'Thông tin hợp đồng',
        SERVICE: modal.type === 'CREATE' ? 'Tạo dịch vụ' : ('Thông tin dịch vụ'),
        CT_SV: modal.type === 'CREATE' ? 'Tạo Hợp đồng - Dịch vụ' : 'Cập nhật Hợp đồng - Dịch vụ',
        PT: modal.type === 'CREATE' ? 'Tạo tài sản' : 'Cập nhật tài sản',
        T_PT: modal.type === 'CREATE' ? 'Tạo loại tài sản' : 'Cập nhật loại tài sản',
        T_SV: modal.type === 'CREATE' ? 'Tạo loại dịch vụ' : 'Cập nhật loại dịch vụ',
    }
    const listTypeStorage: DefaultOptionType[] = Object.keys(getStorages).map((key) => {
        return {
            value: key,
            label: getStorages[key as Storages] as string
        }
    });
    const data: Record<Storages, Array<any>> = {
        CONTRACT: contractStorage.state.data as Array<any> ?? [],
        CT_SV: contractService.state.data ? (contractService.state.data as Array<any>)?.map(item => {
            const crrContract = ((contractStorage.state.data as Array<any>) ? (contractStorage.state.data as Array<any>) : []).find(contract => contract.id_hopdong === item.id_hopdong);
            const crrService = ((serviceStorage.state.data as Array<any>) ? (serviceStorage.state.data as Array<any>) : []).find(service => service.id_dichvu === item.id_dichvu);
            return {
                ...item,
                id_hopdong: crrContract,
                id_dichvu: crrService
            }
        }) ?? [] : [],
        PT: propertyStorage.state.data ? (propertyStorage.state.data as Array<any>)?.map((item) => {
            const typeProperty = ((typePropertyStorage.state.data as Array<any>) ? (typePropertyStorage.state.data as Array<any>) : []).find((typeProperty) => typeProperty.id_loaitaisan === item.id_loaitaisan)
            return {
                ...item,
                typeProperty
            }
        }) ?? [] : [],
        SERVICE: serviceStorage.state.data ? (serviceStorage.state.data as Array<any>)?.map((item) => {
            const crrTypeService = ((typeService.state.data as Array<any>) ? (typeService.state.data as Array<any>) : []).find(typeService => typeService.id_loaidichvu === item.id_loaidichvu)
            return {
                ...item,
                loaidichvu: crrTypeService
            }
        }) ?? [] : [],
        T_PT: typePropertyStorage.state.data as Array<any> ?? [],
        T_SV: typeService.state.data as Array<any> ?? []
    }
    const labelSearch: Record<Storages, string> = {
        CONTRACT: 'Nhập tên khách hàng hoặc số hợp đồng',
        CT_SV: 'Nhập số hợp đồng hoặc tên dịch vụ',
        PT: 'Nhập tên tài sản',
        SERVICE: 'Nhập tên dịch vụ',
        T_PT: 'Nhập tên loại tài sản',
        T_SV: 'Nhập loại dịch vụ'
    }
    const conditionFilter = {
        CONTRACT: (item: Obj) => String(item.ten).trim().toLowerCase().includes(searchValue.toLowerCase().trim()) || String(item.sohd).trim().toLowerCase().includes(searchValue.toLowerCase().trim()),
        CT_SV: (item: Obj) => String(item.id_hopdong?.sohd).trim().toLowerCase().includes(searchValue.toLowerCase().trim()) || String(item.id_dichvu.tendichvu).trim().toLowerCase().includes(searchValue.toLowerCase().trim()),
        PT: (item: Obj) => String(item.tentaisan).trim().toLowerCase().includes(searchValue.toLowerCase().trim()),
        SERVICE: (item: Obj) => String(item.tendichvu).trim().toLowerCase().includes(searchValue.toLowerCase().trim()),
        T_PT: (item: Obj) => String(item.tenloaitaisan).trim().toLowerCase().includes(searchValue.toLowerCase().trim()),
        T_SV: (item: Obj) => String(item.tenloaidichvu).trim().toLowerCase().includes(searchValue.toLowerCase().trim())
    }
    const getLoading = contractStorage.state.isLoading || serviceStorage.state.isLoading || contractService.state.isLoading || typeService.state.isLoading || propertyStorage.state.isLoading || typePropertyStorage.state.isLoading;
    const getDataSource = (data[props.typeStorage as Storages] ? data[props.typeStorage as Storages] : [])?.filter((item) => {
        return conditionFilter[props.typeStorage as Storages](item);
    }).map((item, idx) => {
        return {
            ...item,
            key: idx
        }
    });
    const getDisabled = contractStorage.state.isLoading || serviceStorage.state.isLoading || contractService.state.isLoading || typeService.state.isLoading || typePropertyStorage.state.isLoading || propertyStorage.state.isLoading || !props.typeStorage;
    const onChangeSearchSelect = (value: Storages) => {
        setSeachValue('');
        props.setTypeStorage(value);
    };
    const handleModalData = (id?: string | number, type?: 'VIEW' | 'CREATE') => {
        setModal({
            open: true,
            type: type ?? 'CREATE',
            id
        });
    };
    const handleQueryData = (isReload?: boolean) => {
        switch (props.typeStorage) {
            case Storages.CONTRACT:
                if (isReload) {
                    contractStorage.get?.(props.componentId, undefined, isReload);
                    contractService.get?.(props.componentId, undefined, isReload);
                    serviceStorage.get?.(props.componentId, undefined, isReload);
                } else {
                    if (!contractStorage.state.data) {
                        contractStorage.get?.(props.componentId, undefined, isReload);
                    }
                    if (!contractService.state.data) {
                        contractService.get?.(props.componentId, undefined, isReload,);
                    }
                    if (!serviceStorage.state.data) {
                        serviceStorage.get?.(props.componentId, undefined, isReload,);
                    }
                }
                break;
            case Storages.SERVICE:
                if (isReload) {
                    serviceStorage.get?.(props.componentId, undefined, isReload);
                    typeService.get?.(props.componentId, undefined, isReload);
                } else {
                    if (!serviceStorage.state.data) {
                        serviceStorage.get?.(props.componentId, undefined, isReload);
                    }
                    if (!typeService.state.data) {
                        typeService.get?.(props.componentId, undefined, isReload);
                    }
                }
                break;
            case Storages.T_SV:
                if (isReload) {
                    typeService.get?.(props.componentId, undefined, isReload);
                } else {
                    if (!typeService.state.data) {
                        typeService.get?.(props.componentId, undefined, isReload);
                    }
                }
            case Storages.PT:
                if (isReload) {
                    propertyStorage.get?.(props.componentId, undefined, isReload);
                    typePropertyStorage.get?.(props.componentId, undefined, isReload);
                } else {
                    if (!propertyStorage.state.data) {
                        propertyStorage.get?.(props.componentId, undefined, isReload);
                    }
                    if (!typePropertyStorage.state.data) {
                        typePropertyStorage.get?.(props.componentId, undefined, isReload);
                    }
                }
            case Storages.T_PT:
                if (isReload) {
                    typePropertyStorage.get?.(props.componentId, undefined, isReload);

                } else {
                    if (!typePropertyStorage.state.data) {
                        typePropertyStorage.get?.(props.componentId, undefined, isReload);
                    }
                }
            default:
                break;
        }
    }
    const handleDeleteRecord = (idx: number, record: Obj) => {
        const id = record[getIdData[props.typeStorage as Storages]] as string;
        dataState[props.typeStorage as Storages].delete?.(props.componentId, {
            params: [id]
        }, undefined, (isSuccess) => {
            toastify(isSuccess ? 'Xoá thông tin thành công' : 'Có lỗi xảy ra!');
            if (isSuccess) setDelSuccess(true);
        });
    }
    useEffect(() => {
        handleQueryData();
    }, [props.typeStorage]);
    useEffect(() => {
        if (delSuccess) {
            handleQueryData(true);
            setDelSuccess(false);
        }
    }, [delSuccess]);
    useEffect(() => {
        switch (props.typeStorage) {
            case Storages.CONTRACT:
                // console.log(props.componentId);
                // console.log(contractStorage.state.componentId);
                break;
            default:
                break;
        }
    }, [props.typeStorage, contractStorage.state]);
    return (
        <div className={styles.storage}>
            <div className={styles.setType}>
                <Select
                    style={{ width: '100%' }}
                    filterOption={filterOptionSelect}
                    placeholder={"Type to search"}
                    options={listTypeStorage}
                    showSearch
                    onChange={onChangeSearchSelect}
                />
            </div>
            <div className={styles.contentType}>
                <div className={styles.actionData}>
                    <Input
                        className={styles.search}
                        placeholder={labelSearch[props.typeStorage as Storages]}
                        disabled={getDisabled}
                        value={searchValue}
                        onChange={(e) => {
                            setSeachValue(e.target.value);
                        }}
                    />
                    <div className={styles.groupBtn}>
                        <Button
                            disabled={getDisabled}
                            onClick={() => handleQueryData(true)}
                        >
                            <ReloadOutlined />
                        </Button>
                        <Button
                            disabled={getDisabled}
                            onClick={() => handleModalData()}
                        >
                            Tạo
                        </Button>
                    </div>
                </div>
                <Table
                    className={styles.table}
                    bordered
                    dataSource={getDataSource}
                    loading={getLoading}
                    columns={getColumns(props.typeStorage as Storages, (record: any, idx) => {
                        return <div className={styles.groupBtnAction}>
                            <Button
                                size="small"
                                loading={getLoading}
                                onClick={() => {
                                    handleModalData(record[getIdData[props.typeStorage as Storages]], 'VIEW');
                                }}
                            >
                                Chi tiết
                            </Button>
                            {props.typeStorage === Storages.CONTRACT && <Button size="small" onClick={() => {
                                const contractId = record.id_hopdong;
                                router.push(`/storage/contract/${contractId}/document-payment`);
                            }}
                            >
                                VBTT
                            </Button>}
                            <Popconfirm
                                title="Xoá thông tin"
                                description="Bạn có chắc chắn muốn xoá thông tin?"
                                okText="Xoá"
                                cancelText="Huỷ"
                                okButtonProps={{
                                    loading: false
                                }}
                                onConfirm={() => {
                                    handleDeleteRecord(idx as number, record);
                                }}
                            >
                                <Button danger size="small">Xoá</Button>
                            </Popconfirm>
                        </div>;
                    })}
                    rowClassName={styles.rowTable}
                />
            </div>
            {modal.open && <Modal
                modalProps={{
                    open: modal.open,
                    centered: true,
                    onCancel() {
                        setModal({
                            ...modal,
                            open: false,
                        });
                    },
                    title: <h2>{getTitleModal[props.typeStorage as Storages]}</h2>,
                    wrapClassName: `${styles.modalStorage} ${styles[props.typeStorage]}`
                }}
                type={props.typeStorage as Storages}
                id={modal.id}
                typeModal={modal.type}
                closeModal={() => {
                    setModal({
                        ...modal,
                        open: false,
                    });
                    handleQueryData(true);
                }}
            />}
        </div>
    )
}

export default memo(StorageComponent, (prevProps: StorageComponentProps, nextProps: StorageComponentProps) => {
    const getPrevTypeStorage = prevProps.typeStorage;
    const getNextTypeStorage = nextProps.typeStorage;
    if (getPrevTypeStorage !== getNextTypeStorage) {
        return false;
    }

    const getState = getNameState[getNextTypeStorage as any] as keyof StorageComponentProps;
    if (!(prevProps[getState] as ResultHook)?.state?.componentId) {
        return false;
    } else if ((prevProps[getState] as ResultHook).state.componentId && (prevProps.componentId === (nextProps[getState] as ResultHook).state.componentId)) {
        return false;
    }
    return true;
});