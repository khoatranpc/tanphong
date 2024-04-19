import { TYPE_PROPERTY_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetTypePropertyStorage = createRequest(TYPE_PROPERTY_STORAGE, '/loaitaisan', 'GET');
const typePropertyStorage = createSliceReducer('typePropertyStorage', undefined, [queryGetTypePropertyStorage]);

export default typePropertyStorage.reducer;