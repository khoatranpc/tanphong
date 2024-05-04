import { PROPERTY_STORAGE, POST_PROPERTY_STORAGE, PUT_PROPERTY_STORAGE, DELETE_PROPERTY_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryGetPropertyStorage = createRequest(PROPERTY_STORAGE, '/taisan', 'GET');
export const queryPostPropertyStorage = createRequest(POST_PROPERTY_STORAGE, '/taisan', 'POST');
export const queryPutPropertyStorage = createRequest(PUT_PROPERTY_STORAGE, '/taisan/$params', 'PUT');
export const queryDeletePropertyStorage = createRequest(DELETE_PROPERTY_STORAGE, '/taisan/$params', 'DELETE');
const propertyStorage = createSliceReducer('propertyStorage', undefined, [queryGetPropertyStorage, queryPostPropertyStorage, queryPutPropertyStorage, queryDeletePropertyStorage]);

export const clearPropertyStorage = createAction<void, string>(`${propertyStorage.name}/clear`);

export default propertyStorage.reducer;