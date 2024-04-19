import { TYPE_SERVICE_STORAGE } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";

export const queryGetTypeServiceStorage = createRequest(TYPE_SERVICE_STORAGE, '/loaidichvu', 'GET');
const typeServiceStorage = createSliceReducer('typeServiceStorage', undefined, [queryGetTypeServiceStorage]);

export default typeServiceStorage.reducer;