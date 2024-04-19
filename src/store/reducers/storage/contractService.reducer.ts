import { CONTRACT_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetContractServiceStorage = createRequest(CONTRACT_SERVICE_STORAGE, '/hopdongdichvu', 'GET');
const contractServiceStorage = createSliceReducer('contractServiceStorage', undefined, [queryGetContractServiceStorage]);

export default contractServiceStorage.reducer;