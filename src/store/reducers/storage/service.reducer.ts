import { createAction } from "@reduxjs/toolkit";
import { SERVICE_STORAGE, POST_SERVICE_STORAGE, PUT_SERVICE_STORAGE, DELETE_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetServiceStorage = createRequest(SERVICE_STORAGE, '/dichvu', 'GET');
export const queryPostServiceStorage = createRequest(POST_SERVICE_STORAGE, '/dichvu', 'POST');
export const queryPutServiceStorage = createRequest(PUT_SERVICE_STORAGE, '/dichvu/$params', 'PUT');
export const queryDeleteServiceStorage = createRequest(DELETE_SERVICE_STORAGE, '/dichvu/$params', 'DELETE');
const serviceStorage = createSliceReducer('serviceStorage', undefined, [queryGetServiceStorage, queryPostServiceStorage, queryPutServiceStorage, queryDeleteServiceStorage]);

export const clearServiceStorage = createAction<void, string>(`${serviceStorage.name}/clear`);
export default serviceStorage.reducer;