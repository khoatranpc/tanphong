import { CONTRACT_STORAGE, POST_CONTRACT_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetContractStorage = createRequest(CONTRACT_STORAGE, '/hopdong', 'GET');
export const queryPostContractStorage = createRequest(POST_CONTRACT_STORAGE, '/hopdong', 'POST');
const contractStorage = createSliceReducer('contractStorage', undefined, [queryGetContractStorage, queryPostContractStorage]);

export default contractStorage.reducer;