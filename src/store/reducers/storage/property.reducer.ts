import { PROPERTY_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetPropertyStorage = createRequest(PROPERTY_STORAGE, '/taisan', 'GET');
const propertyStorage = createSliceReducer('propertyStorage', undefined, [queryGetPropertyStorage]);

export default propertyStorage.reducer;