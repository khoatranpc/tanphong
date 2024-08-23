import React from "react";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";
import { Select } from "antd";
import { Obj } from "@/global";
import { Storages, getIdData } from "./StorageComponent";
export const optionUnit = ["KWh", "M3", "M2", "Người", "Xe", "Phòng", "M"];

const getColumns = (typeStorage: Storages, actionCell?: (record?: Obj, index?: number) => React.ReactNode): ColumnsType<AnyObject> => {
    switch (typeStorage) {
        case Storages.CONTRACT:
            return [
                {
                    key: 'id',
                    title: 'ID',
                    dataIndex: 'id_hopdong',
                    className: 'text-center',
                },
                {
                    key: 'name',
                    title: 'Khách hàng',
                    dataIndex: 'ten',
                },
                {
                    key: 'sohd',
                    title: 'Số HĐ',
                    dataIndex: 'sohd',
                    render(value: any) {
                        return value ?? ''
                    },
                },
                {
                    key: 'thoigianthue',
                    dataIndex: 'thoigianthue',
                    title: 'Thời gian thuê (năm)',
                    className: 'text-right',
                    width: 150
                },
                {
                    key: 'kythanhtoan_thang_lan_field',
                    dataIndex: 'kythanhtoan_thang_lan_field',
                    title: 'Kỳ hạn thanh toán (tháng/lần)',
                    className: 'text-right',
                    width: 150
                },
                {
                    key: 'tongthu',
                    dataIndex: 'tongthu',
                    title: 'Tổng thu',
                    render(value: any) {
                        return Number(value) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '';
                    },
                    className: 'text-right',
                },
                {
                    key: 'chuthich',
                    dataIndex: 'chuthich',
                    title: 'Chú thích'
                },
                ...actionCell ? [
                    {
                        key: 'action',
                        title: 'Hành động',
                        width: 50,
                        render(_: any, record: any, index: number) {
                            return actionCell?.(record, index)
                        }
                    }
                ] : []
            ];
        case Storages.SERVICE:
            return [
                {
                    key: 'id_dichvu',
                    dataIndex: 'id_dichvu',
                    title: 'ID',
                    className: 'text-center'
                },
                {
                    key: 'tendichvu',
                    dataIndex: 'tendichvu',
                    title: 'Tên dịch vụ'
                },
                {
                    key: 'loaidichvu',
                    dataIndex: 'loaidichvu',
                    title: 'Loại dịch vụ',
                    render(value) {
                        return value?.tenloaidichvu ?? ''
                    }
                },
                {
                    key: 'chuthich',
                    dataIndex: 'chuthich',
                    title: 'Chú thích'
                },
                ...actionCell ? [
                    {
                        key: 'action',
                        title: 'Hành động',
                        width: 50,
                        render(_: any, record: any, index: number) {
                            return actionCell?.(record, index)
                        }
                    }
                ] : []
            ];
        case Storages.CT_SV:
            return [
                {
                    key: 'id_hopdongdichvu',
                    dataIndex: 'id_hopdongdichvu',
                    className: 'text-center',
                    title: 'ID',
                    width: 50,
                },
                {
                    key: 'id_hopdong',
                    dataIndex: 'id_hopdong',
                    title: 'Số hợp đồng',
                    render(value) {
                        return value?.sohd ?? ''
                    },
                    width: 200
                },
                {
                    key: 'id_dichvu',
                    dataIndex: 'id_dichvu',
                    title: 'Dịch vụ',
                    render(value) {
                        return value?.tendichvu ?? ''
                    },
                    width: 200
                },
                {
                    key: 'donvitinh',
                    dataIndex: 'donvitinh',
                    title: 'Đơn vị tính',
                    render(value) {
                        // return value?.donvitinh ?? ''
                        return <Select
                            options={optionUnit.map((item) => {
                                return {
                                    value: item,
                                    label: item
                                }
                            })}
                        />
                    },
                    width: 250
                },
                {
                    key: 'soluong',
                    dataIndex: 'soluong',
                    className: 'text-center',
                    title: 'Số lượng',
                    render(value) {
                        return value ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 1
                    },
                    onCell() {
                        return {
                            className: 'text-right'
                        }
                    },
                    width: 150
                },
                {
                    key: 'dongia',
                    dataIndex: 'dongia',
                    title: 'Đơn giá',
                    className: 'text-center',
                    onCell() {
                        return {
                            className: 'text-right'
                        }
                    },
                    render(value) {
                        return value ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''
                    },
                    width: 250
                },
                {
                    key: 'chuthich',
                    dataIndex: 'chuthich',
                    title: 'Chú thích',
                    className: 'text-center',
                    onCell() {
                        return {
                            className: 'text-left'
                        }
                    }
                },
                ...actionCell ? [
                    {
                        key: 'action',
                        title: 'Hành động',
                        width: 50,
                        render(_: any, record: any, index: number) {
                            return actionCell?.(record, index)
                        }
                    }
                ] : []
            ];
        case Storages.T_SV:
            return [
                {
                    key: 'id_loaidichvu',
                    dataIndex: 'id_loaidichvu',
                    className: 'text-center',
                    width: 100,
                    title: 'ID'
                },
                {
                    key: 'tenloaidichvu',
                    dataIndex: 'tenloaidichvu',
                    width: 250,
                    title: 'Tên loại dịch vụ'
                },
                {
                    key: 'chuthich',
                    dataIndex: 'chuthich',
                    title: 'Chú thích'
                },
                ...actionCell ? [
                    {
                        key: 'action',
                        title: 'Hành động',
                        width: 50,
                        render(_: any, record: any, index: number) {
                            return actionCell?.(record, index)
                        }
                    }
                ] : []
            ];
        case Storages.PT:
            return [
                {
                    key: 'id_taisan',
                    dataIndex: 'id_taisan',
                    title: 'ID'
                },
                {
                    key: 'tentaisan',
                    dataIndex: 'tentaisan',
                    title: 'Tên tài sản'
                },
                {
                    key: 'typeProperty',
                    dataIndex: 'typeProperty',
                    title: 'Loại tài sản',
                    render(value) {
                        return value?.tenloaitaisan ?? ''
                    }
                },
                {
                    key: 'ngayghitang',
                    dataIndex: 'ngayghitang',
                    title: 'Ngày bắt đầu sử dụng'
                },
                {
                    key: 'thoigiansudung',
                    dataIndex: 'thoigiansudung',
                    title: 'Thời gian sử dụng (ngày)',
                },
                {
                    key: 'nguyengia',
                    dataIndex: 'nguyengia',
                    title: 'Nguyên giá',
                    render(value) {
                        return value ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''
                    }
                },
                {
                    key: 'chuthich',
                    dataIndex: 'chuthich',
                    title: 'Chú thích'
                },
                ...actionCell ? [
                    {
                        key: 'action',
                        title: 'Hành động',
                        width: 50,
                        render(_: any, record: any, index: number) {
                            return actionCell?.(record, index)
                        }
                    }
                ] : []
            ];
        case Storages.T_PT:
            return [
                {
                    key: 'id_loaitaisan',
                    dataIndex: 'id_loaitaisan',
                    title: 'ID',
                    width: 100
                },
                {
                    key: 'tenloaitaisan',
                    dataIndex: 'tenloaitaisan',
                    title: 'Tên loại tài sản',
                    width: 200
                },
                {
                    key: 'chuthich',
                    dataIndex: 'chuthich',
                    title: 'Chú thích'
                },
                ...actionCell ? [
                    {
                        key: 'action',
                        title: 'Hành động',
                        width: 50,
                        render(_: any, record: any, index: number) {
                            return actionCell?.(record, index)
                        }
                    }
                ] : []
            ];
        default:
            return [];
    }
}


export const getNameState: Record<any, string> = {
    CONTRACT: 'contractStorage',
    SERVICE: 'serviceStorage',
    T_SV: 'typeService',
    PT: 'propertyStorage',
    T_PT: 'typePropertyStorage'
};
const getDataDetail = (id?: string | number, listData?: Array<Obj>, typeStorage?: Storages, isGetAll?: boolean): any => {
    const idField = getIdData[typeStorage!];
    const data = listData?.[isGetAll ? 'filter' : 'find']?.((item) => item[idField] === id);
    return data;
}

export {
    getColumns,
    getDataDetail
}