import { createAction } from "@reduxjs/toolkit";
import { CONTRACT_SERVICE_STORAGE, POST_CONTRACT_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetContractServiceStorage = createRequest(CONTRACT_SERVICE_STORAGE, '/hopdongdichvu', 'GET');
export const queryPostContractServiceStorage = createRequest(POST_CONTRACT_SERVICE_STORAGE, '/hopdongdichvu', 'POST');

const contractServiceStorage = createSliceReducer('contractServiceStorage', undefined, [queryGetContractServiceStorage, queryPostContractServiceStorage]);

export const clearContractServiceStorage = createAction<void, string>(`${contractServiceStorage.name}/clear`);
export default contractServiceStorage.reducer;