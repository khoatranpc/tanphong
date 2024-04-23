import { createAction } from "@reduxjs/toolkit";
import { TYPE_PROPERTY_STORAGE, POST_TYPE_PROPERTY_STORAGE, PUT_TYPE_PROPERTY_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetTypePropertyStorage = createRequest(TYPE_PROPERTY_STORAGE, '/loaitaisan', 'GET');
export const queryPostTypePropertyStorage = createRequest(POST_TYPE_PROPERTY_STORAGE, '/loaitaisan', 'POST');
export const queryPutTypePropertyStorage = createRequest(PUT_TYPE_PROPERTY_STORAGE, '/loaitaisan/$params', 'PUT');
const typePropertyStorage = createSliceReducer('typePropertyStorage', undefined, [queryGetTypePropertyStorage, queryPostTypePropertyStorage, queryPutTypePropertyStorage]);

export const clearTypeProperty = createAction<void, string>(`${typePropertyStorage.name}/clear`);
export default typePropertyStorage.reducer;