import { useDispatch, useSelector } from "react-redux"
import dynamic, { DynamicOptions } from "next/dynamic";
import { v4 as uuidFc } from 'uuid';
import { Obj } from "@/global";
import { AppDispatch, RootState } from "@/store";
import rootReducer from "@/store/reducer"
import { State } from "./redux-toolkit";
import { Query } from "./axios";


export interface RestQuery {
    get?: (componentId?: string, query?: Query) => void;
    post?: (componentId?: string, query?: Query) => void;
    put?: (componentId?: string, query?: Query) => void;
    delete?: (componentId?: string, query?: Query) => void;
}

export interface ResultHook extends RestQuery {
    state: {
        data: Obj | any;
        isLoading: boolean;
        [k: string]: any;
        success: boolean;
        componentId?: string;
    };
    clear: () => void;
}

const createHookReducer = (name: keyof typeof rootReducer, queryThunk?: {
    get?: Function;
    post?: Function;
    put?: Function;
    delete?: Function;
}, clearState?: Function) => {
    return (): ResultHook => {
        const dispatch = useDispatch<AppDispatch>();
        const data = useSelector((state: RootState) => (state[name] as State).state);

        const clear = () => {
            dispatch(clearState?.());
        }
        const query: RestQuery = {};
        for (const key in queryThunk) {
            if (Object.prototype.hasOwnProperty.call(queryThunk, key)) {
                query[key as keyof RestQuery] = (componentId?: string, query?: Query) => {
                    dispatch((queryThunk[key as keyof RestQuery] as any)({ payload: query, componentId }));
                }
            }
        }
        return {
            state: data,
            clear,
            ...query
        }
    }
}

const LazyImportComponent = (directPages: string, options?: DynamicOptions<{}>) => {
    return dynamic(() => import(`@/screens/${directPages}`), {
        ...options,
        ssr: false,
    });
}

const uuid = uuidFc;
export {
    createHookReducer,
    LazyImportComponent,
    uuid
}