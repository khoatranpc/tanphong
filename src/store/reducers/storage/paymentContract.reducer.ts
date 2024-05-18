import { Obj } from "@/global";
import { CREATE_PAYMENT_CONTRACT, GET_PAYMENT_CONTRACT, UPDATE_PAYMENT_CONTRACT, DELETE_PAYMENT_CONTRACT } from "@/store/type.actions";
import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { createAction } from "@reduxjs/toolkit";

export const queryUpdatePaymentContract = createRequest(UPDATE_PAYMENT_CONTRACT, '/thanhtoan/', 'PUT');
export const queryCreatePaymentContract = createRequest(CREATE_PAYMENT_CONTRACT, '/thanhtoan/', 'POST');
export const queryGetPaymentContract = createRequest(GET_PAYMENT_CONTRACT, '/thanhtoan/', 'GET');
export const queryDeletePaymentContract = createRequest(DELETE_PAYMENT_CONTRACT, '/thanhtoan', 'DELETE');
const paymentContract = createSliceReducer('paymentContract', undefined, [queryCreatePaymentContract, queryGetPaymentContract, queryUpdatePaymentContract, queryDeletePaymentContract]);
export const clearPaymentContract = createAction<Obj, string>(`${paymentContract.name}/clears`);
export default paymentContract.reducer;