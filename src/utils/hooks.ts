import { QueryGetExample } from "@/store/reducers/example";
import { clearContractStorage, queryGetContractStorage, queryPostContractStorage, queryPutContractStorage } from "@/store/reducers/storage/contract.reducer";
import { createHookReducer } from ".";
import { clearServiceStorage, queryGetServiceStorage, queryPostServiceStorage, queryPutServiceStorage } from "@/store/reducers/storage/service.reducer";
import { clearContractServiceStorage, queryGetContractServiceStorage, queryPostContractServiceStorage } from "@/store/reducers/storage/contractService.reducer";
import { clearTypeServiceStorage, queryGetTypeServiceStorage, queryPostTypeServiceStorage, queryPutTypeServiceStorage } from "@/store/reducers/storage/typeService.reducer";
import { clearPropertyStorage, queryGetPropertyStorage, queryPostPropertyStorage, queryPutPropertyStorage } from "@/store/reducers/storage/property.reducer";
import { clearTypeProperty, queryGetTypePropertyStorage, queryPostTypePropertyStorage, queryPutTypePropertyStorage } from "@/store/reducers/storage/typeProperty.reducer";

const useExample = createHookReducer('exampleReducer', {
    get: QueryGetExample
});

const useContract = createHookReducer('contractStorage', {
    get: queryGetContractStorage,
    post: queryPostContractStorage,
    put: queryPutContractStorage
}, clearContractStorage);

const useService = createHookReducer('serviceStorage', {
    get: queryGetServiceStorage,
    post: queryPostServiceStorage,
    put: queryPutServiceStorage
}, clearServiceStorage);

const useContractService = createHookReducer('contractServiceStorage', {
    get: queryGetContractServiceStorage,
    post: queryPostContractServiceStorage
}, clearContractServiceStorage);

const useTypeService = createHookReducer('typeServiceStorage', {
    get: queryGetTypeServiceStorage,
    post: queryPostTypeServiceStorage,
    put: queryPutTypeServiceStorage
}, clearTypeServiceStorage);

const useProperty = createHookReducer('propertyStorage', {
    get: queryGetPropertyStorage,
    post: queryPostPropertyStorage,
    put: queryPutPropertyStorage
}, clearPropertyStorage);

const useTypeProperty = createHookReducer('typePropertyStorage', {
    get: queryGetTypePropertyStorage,
    post: queryPostTypePropertyStorage,
    put: queryPutTypePropertyStorage
}, clearTypeProperty);

export {
    useExample,
    useContract,
    useService,
    useContractService,
    useTypeService,
    useProperty,
    useTypeProperty
}