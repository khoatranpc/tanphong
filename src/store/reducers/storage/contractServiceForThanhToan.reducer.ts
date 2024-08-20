import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { CONTRACT_SERVICE_FOR_THANHTOAN } from "@/store/type.actions";

export const queryContractServiceForThanhToan = createRequest(CONTRACT_SERVICE_FOR_THANHTOAN, '/hopdongdichvuForThanhtoan', 'GET');
const contractServiceForThanhToan = createSliceReducer('contractServiceForThanhToan', undefined, [queryContractServiceForThanhToan]);

export default contractServiceForThanhToan.reducer;