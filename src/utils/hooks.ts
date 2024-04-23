import { QueryGetExample } from "@/store/reducers/example";
import { clearContractStorage, queryGetContractStorage, queryPostContractStorage } from "@/store/reducers/storage/contract.reducer";
import { createHookReducer } from ".";
import { clearServiceStorage, queryGetServiceStorage, queryPostServiceStorage } from "@/store/reducers/storage/service.reducer";
import { clearContractServiceStorage, queryGetContractServiceStorage, queryPostContractServiceStorage } from "@/store/reducers/storage/contractService.reducer";
import { queryGetTypeServiceStorage } from "@/store/reducers/storage/typeService.reducer";
import { queryGetPropertyStorage } from "@/store/reducers/storage/property.reducer";
import { queryGetTypePropertyStorage } from "@/store/reducers/storage/typeProperty.reducer";

const useExample = createHookReducer('exampleReducer', {
    get: QueryGetExample
});

const useContract = createHookReducer('contractStorage', {
    get: queryGetContractStorage,
    post: queryPostContractStorage
}, clearContractStorage);

const useService = createHookReducer('serviceStorage', {
    get: queryGetServiceStorage,
    post: queryPostServiceStorage
}, clearServiceStorage);

const useContractService = createHookReducer('contractServiceStorage', {
    get: queryGetContractServiceStorage,
    post: queryPostContractServiceStorage
}, clearContractServiceStorage);

const useTypeService = createHookReducer('typeServiceStorage', {
    get: queryGetTypeServiceStorage
});

const useProperty = createHookReducer('propertyStorage', {
    get: queryGetPropertyStorage
});

const useTypeProperty = createHookReducer('typePropertyStorage', {
    get: queryGetTypePropertyStorage
});

export {
    useExample,
    useContract,
    useService,
    useContractService,
    useTypeService,
    useProperty,
    useTypeProperty
}