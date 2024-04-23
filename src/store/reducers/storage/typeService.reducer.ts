import { TYPE_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryGetTypeServiceStorage = createRequest(TYPE_SERVICE_STORAGE, '/loaidichvu', 'GET');
export const queryPostTypeServiceStorage = createRequest(TYPE_SERVICE_STORAGE, '/loaidichvu', 'POST');
const typeServiceStorage = createSliceReducer('typeServiceStorage', undefined, [queryPostTypeServiceStorage]);

export const clearTypeServiceStorage = createAction<void, string>(`${typeServiceStorage.name}/clear`);
export default typeServiceStorage.reducer;