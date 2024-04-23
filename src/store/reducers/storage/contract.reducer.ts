import { CONTRACT_STORAGE, POST_CONTRACT_STORAGE, PUT_CONTRACT_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryGetContractStorage = createRequest(CONTRACT_STORAGE, '/hopdong', 'GET');
export const queryPostContractStorage = createRequest(POST_CONTRACT_STORAGE, '/hopdong', 'POST');
export const queryPutContractStorage = createRequest(PUT_CONTRACT_STORAGE, '/hopdong/$params', 'PUT');
const contractStorage = createSliceReducer('contractStorage', undefined, [queryGetContractStorage, queryPostContractStorage, queryPutContractStorage]);

export const clearContractStorage = createAction<void, string>(`${contractStorage.name}/clear`);
export default contractStorage.reducer;