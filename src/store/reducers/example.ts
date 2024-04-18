import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { QUERY_EXAMPLE } from "../type.actions";

export const QueryGetExample = createRequest(QUERY_EXAMPLE, '/sanpham', 'GET');
const exampleReducer = createSliceReducer('example', undefined, [QueryGetExample]);

export default exampleReducer.reducer;