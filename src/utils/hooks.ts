import { QueryGetExample } from "@/store/reducers/example";
import { clearContractStorage, queryDeleteContractStorage, queryGetContractStorage, queryPostContractStorage, queryPutContractStorage } from "@/store/reducers/storage/contract.reducer";
import { createHookReducer } from ".";
import { clearServiceStorage, queryDeleteServiceStorage, queryGetServiceStorage, queryPostServiceStorage, queryPutServiceStorage } from "@/store/reducers/storage/service.reducer";
import { clearContractServiceStorage, queryDeleteContractServiceStorage, queryGetContractServiceStorage, queryPostContractServiceStorage } from "@/store/reducers/storage/contractService.reducer";
import { clearTypeServiceStorage, queryDeleteTypeServiceStorage, queryGetTypeServiceStorage, queryPostTypeServiceStorage, queryPutTypeServiceStorage } from "@/store/reducers/storage/typeService.reducer";
import { clearPropertyStorage, queryDeletePropertyStorage, queryGetPropertyStorage, queryPostPropertyStorage, queryPutPropertyStorage } from "@/store/reducers/storage/property.reducer";
import { clearTypeProperty, queryDeleteTypePropertyStorage, queryGetTypePropertyStorage, queryPostTypePropertyStorage, queryPutTypePropertyStorage } from "@/store/reducers/storage/typeProperty.reducer";
import { clearUpdateManyContractService, queryUpdateManyContractService } from "@/store/reducers/storage/updateManyContractService.reducer";
import { clearPaymentContract, queryCreatePaymentContract, queryDeletePaymentContract, queryGetPaymentContract, queryUpdatePaymentContract } from "@/store/reducers/storage/paymentContract.reducer";
import { clearSendmailBillContract, querySendMailBillContract } from "@/store/reducers/sendmail.reducer";

const useExample = createHookReducer('exampleReducer', {
    get: QueryGetExample
});

const useContract = createHookReducer('contractStorage', {
    get: queryGetContractStorage,
    post: queryPostContractStorage,
    put: queryPutContractStorage,
    delete: queryDeleteContractStorage
}, clearContractStorage);

const useService = createHookReducer('serviceStorage', {
    get: queryGetServiceStorage,
    post: queryPostServiceStorage,
    put: queryPutServiceStorage,
    delete: queryDeleteServiceStorage
}, clearServiceStorage);

const useContractService = createHookReducer('contractServiceStorage', {
    get: queryGetContractServiceStorage,
    post: queryPostContractServiceStorage,
    delete: queryDeleteContractServiceStorage
}, clearContractServiceStorage);

const useTypeService = createHookReducer('typeServiceStorage', {
    get: queryGetTypeServiceStorage,
    post: queryPostTypeServiceStorage,
    put: queryPutTypeServiceStorage,
    delete: queryDeleteTypeServiceStorage
}, clearTypeServiceStorage);

const useProperty = createHookReducer('propertyStorage', {
    get: queryGetPropertyStorage,
    post: queryPostPropertyStorage,
    put: queryPutPropertyStorage,
    delete: queryDeletePropertyStorage
}, clearPropertyStorage);

const useTypeProperty = createHookReducer('typePropertyStorage', {
    get: queryGetTypePropertyStorage,
    post: queryPostTypePropertyStorage,
    put: queryPutTypePropertyStorage,
    delete: queryDeleteTypePropertyStorage
}, clearTypeProperty);

const useUpdateManyContractService = createHookReducer('updateManycontractServiceStorage', {
    put: queryUpdateManyContractService,
}, clearUpdateManyContractService);

const usePaymentContract = createHookReducer('paymentContract', {
    post: queryCreatePaymentContract,
    put: queryUpdatePaymentContract,
    get: queryGetPaymentContract,
    delete: queryDeletePaymentContract
}, clearPaymentContract);

const useSendMailBillContract = createHookReducer('sendmailBillContract', {
    post: querySendMailBillContract
}, clearSendmailBillContract);

export {
    useExample,
    useContract,
    useService,
    useContractService,
    useTypeService,
    useProperty,
    useTypeProperty,
    useUpdateManyContractService,
    usePaymentContract,
    useSendMailBillContract
}