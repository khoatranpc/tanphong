import { CONTRACT_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetContractStorage = createRequest(CONTRACT_STORAGE, '/hopdong', 'GET');
const contractStorage = createSliceReducer('contractStorage', undefined, [queryGetContractStorage]);

export default contractStorage.reducer;