import { QueryGetExample } from "@/store/reducers/example";
import { queryGetContractStorage } from "@/store/reducers/storage/contract.reducer";
import { createHookReducer } from ".";
import { queryGetServiceStorage } from "@/store/reducers/storage/service.reducer";
import { queryGetContractServiceStorage } from "@/store/reducers/storage/contractService.reducer";
import { queryGetTypeServiceStorage } from "@/store/reducers/storage/typeService.reducer";
import { queryGetPropertyStorage } from "@/store/reducers/storage/property.reducer";
import { queryGetTypePropertyStorage } from "@/store/reducers/storage/typeProperty.reducer";

const useExample = createHookReducer('exampleReducer', {
    get: QueryGetExample
});

const useContract = createHookReducer('contractStorage', {
    get: queryGetContractStorage
});

const useService = createHookReducer('serviceStorage', {
    get: queryGetServiceStorage
});

const useContractService = createHookReducer('contractServiceStorage', {
    get: queryGetContractServiceStorage
});

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