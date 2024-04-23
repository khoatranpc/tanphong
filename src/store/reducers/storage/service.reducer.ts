import { SERVICE_STORAGE,POST_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryGetServiceStorage = createRequest(SERVICE_STORAGE, '/dichvu', 'GET');
export const queryPostServiceStorage = createRequest(POST_SERVICE_STORAGE, '/dichvu', 'POST');
const serviceStorage = createSliceReducer('serviceStorage', undefined, [queryGetServiceStorage, queryPostServiceStorage]);

export const clearServiceStorage = createAction<void, string>(`${serviceStorage.name}/clear`);
export default serviceStorage.reducer;