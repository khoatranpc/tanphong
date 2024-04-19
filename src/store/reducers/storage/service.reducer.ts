import { SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetServiceStorage = createRequest(SERVICE_STORAGE, '/dichvu', 'GET');
const serviceStorage = createSliceReducer('serviceStorage', undefined, [queryGetServiceStorage]);

export default serviceStorage.reducer;