import { Action, AsyncThunk, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Method } from "axios";
import { Obj } from "@/global";
import { Query } from "./axios";
import actionRequest from "./restApi";

export interface State {
    state: {
        data: Obj | any;
        isLoading: boolean;
        [k: string]: any;
        success: boolean;
    };
    [k: string]: any;
}

interface Reducer {
    [k: string]: (state: any, action?: PayloadAction<any>) => void
}

const initState: State = {
    state: {
        data: null,
        isLoading: false,
        success: false
    }
}

export const createRequest = (type: string, api: string, method: Method): any => {
    return createAsyncThunk(type, async (request: Query | any) => {
        const rs = await actionRequest(api, method, request);
        return rs.data;
    })
}

const createSliceReducer = (nameReducer: string, reducers?: Reducer, asyncThunk?: Array<(AsyncThunk<any, Action | undefined, any> | undefined | any)>) => {
    return createSlice({
        name: nameReducer,
        initialState: initState,
        reducers: reducers ?? {
            clear(state) {
                state.data = initState.state;
            }
        },
        ...asyncThunk ? {
            extraReducers(builder) {
                asyncThunk.forEach(request => {
                    builder.addCase(request.pending, (state, _) => {
                        (state as State).state = {
                            ...(state as State).state,
                            isLoading: true,
                            success: false
                        }
                    });
                    builder.addCase(request.fulfilled, (state, action) => {
                        (state as State).state = {
                            data: action.payload,
                            isLoading: false,
                            success: true
                        }
                    });
                    builder.addCase(request.rejected, (state, _) => {
                        (state as State).state = {
                            data: null,
                            isLoading: false,
                            success: false
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