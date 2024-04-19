"use client";
import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Table } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useContract, useContractService, useProperty, useService, useTypeProperty, useTypeService } from '@/utils/hooks';
import { getColumns } from './config';
import styles from './Storage.module.scss';
import { Obj } from '@/global';

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

const getStorages: Record<Storages, string> = {
    CONTRACT: 'Hợp đồng',
    CT_SV: 'Hợp đồng - Dịch vụ',
    SERVICE: 'Dịch vụ',
    T_SV: 'Loại dịch vụ',
    PT: 'Tài sản',
    T_PT: 'Loại tài sản',
}

const filterOptionSelect = (input: string, option?: DefaultOptionType) =>
    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase());

const Storage = () => {
    const [typeStorage, setTypeStorage] = useState<Storages | string>('');
    const contractStorage = useContract();
    const serviceStorage = useService();
    const contractService = useContractService();
    const typeService = useTypeService();
    const propertyStorage = useProperty();
    const typePropertyStorage = useTypeProperty();
    const [searchValue, setSeachValue] = useState<string>('');
    const listTypeStorage: DefaultOptionType[] = Object.keys(getStorages).map((key) => {
        return {
            value: key,
            label: getStorages[key as Storages] as string
        }
    });
    const data: Record<Storages, Array<any>> = {
        CONTRACT: contractStorage.state.data as Array<any> ?? [],
        CT_SV: (contractService.state.data as Array<any>)?.map(item => {
            const crrContract = (contractStorage.state.data as Array<any>)?.find(contract => contract.id_hopdong === item.id_hopdong);
            const crrService = (serviceStorage.state.data as Array<any>)?.find(service => service.id_dichvu === item.id_dichvu);
            return {
                ...item,
                id_hopdong: crrContract,
                id_dichvu: crrService
            }
        }) ?? [],
        PT: (propertyStorage.state.data as Array<any>)?.map((item) => {
            const typeProperty = (typePropertyStorage.state.data as Array<any>)?.find((typeProperty) => typeProperty.id_loaitaisan === item.id_loaitaisan)
            return {
                ...item,
                typeProperty
            }
        }) ?? [],
        SERVICE: (serviceStorage.state.data as Array<any>)?.map((item) => {
            const crrTypeService = (typeService.state.data as Array<any>)?.find(typeService => typeService.id_loaidichvu === item.id_loaidichvu)
            return {
                ...item,
                loaidichvu: crrTypeService
            }
        }) ?? [],
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
        CONTRACT: (item: Obj) => String(item.ten).trim().toLowerCase().includes(searchValue.toLowerCase()) || String(item.sohd).trim().toLowerCase().includes(searchValue.toLowerCase()),
        CT_SV: (item: Obj) => String(item.id_hopdong?.sohd).trim().toLowerCase().includes(searchValue.toLowerCase()) || String(item.id_dichvu.tendichvu).trim().toLowerCase().includes(searchValue.toLowerCase()),
        PT: (item: Obj) => String(item.tentaisan).trim().toLowerCase().includes(searchValue.toLowerCase()),
        SERVICE: (item: Obj) => String(item.tendichvu).trim().toLowerCase().includes(searchValue.toLowerCase()),
        T_PT: (item: Obj) => String(item.tenloaitaisan).trim().toLowerCase().includes(searchValue.toLowerCase()),
        T_SV: (item: Obj) => String(item.tenloaidichvu).trim().toLowerCase().includes(searchValue.toLowerCase())
    }
    const getDataSource = data[typeStorage as Storages]?.filter((item) => {
        return conditionFilter[typeStorage as Storages](item);
    }).map((item, idx) => {
        return {
            ...item,
            key: idx
        }
    });
    const getDisabled = contractStorage.state.isLoading || serviceStorage.state.isLoading || contractService.state.isLoading || typeService.state.isLoading || typePropertyStorage.state.isLoading || propertyStorage.state.isLoading || !typeStorage;
    const onChangeSearchSelect = (value: Storages) => {
        setSeachValue('');
        setTypeStorage(value);
    };
    const handleCreateData = () => {
        switch (typeStorage) {
            case Storages.CONTRACT:
                break;
            case Storages.SERVICE:
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        switch (typeStorage) {
            case Storages.CONTRACT:
                if (!contractStorage.state.data) {
                    contractStorage.get?.();
                }
                break;
            case Storages.SERVICE:
                if (!serviceStorage.state.data) {
                    serviceStorage.get?.();
                }
                if (!typeService.state.data) {
                    typeService.get?.();
                }
                break;
            case Storages.CT_SV:
                if (!contractService.state.data) {
                    contractService.get?.();
                }
                if (!contractStorage.state.data) {
                    contractStorage.get?.();
                }
                if (!serviceStorage.state.data) {
                    serviceStorage.get?.();
                }
                break;
            case Storages.T_SV:
                if (!typeService.state.data) {
                    typeService.get?.();
                }
            case Storages.PT:
                if (!propertyStorage.state.data) {
                    propertyStorage.get?.();
                }
                if (!typePropertyStorage.state.data) {
                    typePropertyStorage.get?.();
                }
            case Storages.T_PT:
                if (!typePropertyStorage.state.data) {
                    typePropertyStorage.get?.();
                }
            default:
                break;
        }
    }, [typeStorage]);
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
                        placeholder={labelSearch[typeStorage as Storages]}
                        disabled={getDisabled}
                        value={searchValue}
                        onChange={(e) => {
                            setSeachValue(e.target.value.trim());
                        }}
                    />
                    <Button
                        disabled={getDisabled}
                        onClick={handleCreateData}
                    >
                        Tạo
                    </Button>
                </div>
                <Table
                    bordered
                    dataSource={getDataSource}
                    loading={contractStorage.state.isLoading || serviceStorage.state.isLoading || contractService.state.isLoading || typeService.state.isLoading || propertyStorage.state.isLoading || typePropertyStorage.state.isLoading}
                    columns={getColumns(typeStorage as Storages)}
                />
            </div>
        </div>
    )
}

export default Storage;