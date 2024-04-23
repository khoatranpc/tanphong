'use client';
import React, { useRef, useState } from 'react';
import { uuid } from '@/utils';
import { useContract, useContractService, useProperty, useService, useTypeProperty, useTypeService } from '@/utils/hooks';
import StorageComponent, { Storages } from './StorageComponent';

const Storage = () => {
    const contractStorage = useContract();
    const serviceStorage = useService();
    const contractService = useContractService();
    const typeService = useTypeService();
    const propertyStorage = useProperty();
    const typePropertyStorage = useTypeProperty();
    const [typeStorage, setTypeStorage] = useState<Storages | string>('');
    const componentId = useRef(uuid());

    return (
        <StorageComponent
            contractStorage={contractStorage}
            serviceStorage={serviceStorage}
            contractService={contractService}
            typeService={typeService}
            propertyStorage={propertyStorage}
            typePropertyStorage={typePropertyStorage}
            setTypeStorage={setTypeStorage}
            typeStorage={typeStorage}
            componentId={componentId.current}
        />
    )
}

export default Storage;