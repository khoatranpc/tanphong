import { Obj } from "@/global";
import { CREATE_PAYMENT_CONTRACT, GET_PAYMENT_CONTRACT } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryCreatePaymentContract = createRequest(CREATE_PAYMENT_CONTRACT, '/thanhtoan/', 'PUT');
export const queryGetPaymentContract = createRequest(GET_PAYMENT_CONTRACT, '/thanhtoan/', 'GET');
const paymentContract = createSliceReducer('paymentContract', undefined, [queryCreatePaymentContract, queryGetPaymentContract]);

export const clearPaymentContract = createAction<Obj, string>(`${paymentContract.name}/clears`);
export default paymentContract.reducer;