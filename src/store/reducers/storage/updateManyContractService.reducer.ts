import { PUT_ALL_CONTRACT_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";
export const queryUpdateManyContractService = createRequest(PUT_ALL_CONTRACT_SERVICE_STORAGE, '/hopdongdichvu/update', 'PUT');

const updateManycontractServiceStorage = createSliceReducer('updateManycontractServiceStorage', undefined, [queryUpdateManyContractService]);
export const clearUpdateManyContractService = createAction<void, string>(`${updateManycontractServiceStorage.name}/clear`);
export default updateManycontractServiceStorage.reducer;