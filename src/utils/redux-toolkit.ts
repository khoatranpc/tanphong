import { Action, AsyncThunk, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Method } from "axios";
import { Obj } from "@/global";
import actionRequest from "./restApi";

export interface State {
    state: {
        data: Obj | any;
        isLoading: boolean;
        [k: string]: any;
        success: boolean;
        componentId?: string;
        error?: boolean;
        method?: Method
    };
    [k: string]: any;
}

interface Reducer {
    [k: string]: (state: any, action?: PayloadAction<any>) => void
}

export const initState: State = {
    state: {
        data: null,
        isLoading: false,
        success: false
    }
}

export const createRequest = (type: string, api: string, method: Method): any => {
    return createAsyncThunk(type, async (payload: any) => {
        const rs = await actionRequest(api, method, payload);
        return rs?.data;
    });
}

const createSliceReducer = (nameReducer: string, reducers?: Reducer, asyncThunk?: Array<(AsyncThunk<any, Action | undefined, any> | undefined | any)>) => {
    return createSlice({
        name: nameReducer,
        initialState: initState,
        reducers: reducers ? reducers : {
            clear(state) {
                state.state = initState.state;
            }
        },
        ...asyncThunk ? {
            extraReducers(builder) {
                asyncThunk.forEach(request => {
                    builder.addCase(request.pending, (state, action) => {
                        const componentId = action.meta.arg.componentId;
                        const method = action.meta.arg.method
                        const isReload = action.meta.arg.isReload;
                        (state as State).state = {
                            ...!isReload ? (state as State).state : { data: null },
                            isLoading: true,
                            success: false,
                            componentId,
                            method
                        }
                    });
                    builder.addCase(request.fulfilled, (state, action) => {
                        const componentId = action.meta.arg.componentId;
                        const callbackFnc: Function = action.meta.arg.callbackFnc as Function;
                        const method = action.meta.arg.method

                        callbackFnc?.(true);
                        (state as State).state = {
                            data: action.payload ?? {},
                            isLoading: false,
                            success: true,
                            componentId,
                            method
                        }
                    });
                    builder.addCase(request.rejected, (state, action) => {
                        const componentId = action.meta.arg.componentId;
                        const callbackFnc: Function = action.meta.arg.callbackFnc as Function;
                        const method = action.meta.arg.method
                        callbackFnc?.(false);
                        (state as State).state = {
                            data: null,
                            isLoading: false,
                            success: false,
                            componentId,
                            error: true,
                            message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
                            method
                        }
                    });
                })
            },
        } : {},
    });
}

export {
    createSliceReducer
}