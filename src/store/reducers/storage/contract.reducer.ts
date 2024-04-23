import { CONTRACT_STORAGE, POST_CONTRACT_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryGetContractStorage = createRequest(CONTRACT_STORAGE, '/hopdong', 'GET');
export const queryPostContractStorage = createRequest(POST_CONTRACT_STORAGE, '/hopdong', 'POST');
const contractStorage = createSliceReducer('contractStorage', undefined, [queryGetContractStorage, queryPostContractStorage]);

export const clearContractStorage = createAction<void, string>(`${contractStorage.name}/clear`);
export default contractStorage.reducer;