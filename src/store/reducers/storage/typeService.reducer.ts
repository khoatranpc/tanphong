import { TYPE_SERVICE_STORAGE, POST_TYPE_SERVICE_STORAGE, PUT_TYPE_SERVICE_STORAGE, DELETE_TYPE_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryGetTypeServiceStorage = createRequest(TYPE_SERVICE_STORAGE, '/loaidichvu', 'GET');
export const queryPostTypeServiceStorage = createRequest(POST_TYPE_SERVICE_STORAGE, '/loaidichvu', 'POST');
export const queryPutTypeServiceStorage = createRequest(PUT_TYPE_SERVICE_STORAGE, '/loaidichvu/$params', 'PUT');
export const queryDeleteTypeServiceStorage = createRequest(DELETE_TYPE_SERVICE_STORAGE, '/loaidichvu/$params', 'DELETE');
const typeServiceStorage = createSliceReducer('typeServiceStorage', undefined, [queryGetTypeServiceStorage, queryPutTypeServiceStorage, queryPostTypeServiceStorage, queryDeleteTypeServiceStorage]);

export const clearTypeServiceStorage = createAction<void, string>(`${typeServiceStorage.name}/clear`);
export default typeServiceStorage.reducer;