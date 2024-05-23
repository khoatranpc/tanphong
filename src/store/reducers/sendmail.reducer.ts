import { createRequest, createSliceReducer } from "@/utils/redux-toolkit";
import { SEND_MAIL_BILL_CONTRACT } from "../type.actions";
import { createAction } from "@reduxjs/toolkit";

export const querySendMailBillContract = createRequest(SEND_MAIL_BILL_CONTRACT, 'sendmail/', 'POST');
const sendmailBillContract = createSliceReducer('sendmailBillContract', undefined, []);

export const clearSendmailBillContract = createAction<void, string>(`${sendmailBillContract.name}/clear`);
export default sendmailBillContract.reducer;