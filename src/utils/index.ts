import { useDispatch, useSelector } from "react-redux"
import dynamic, { DynamicOptions } from "next/dynamic";
import { v4 as uuidFc } from 'uuid';
import { Obj } from "@/global";
import { AppDispatch, RootState } from "@/store";
import rootReducer from "@/store/reducer"
import { State } from "./redux-toolkit";
import { Query } from "./axios";
import { format } from "date-fns";
import { ToastContent, ToastOptions, toast } from "react-toastify";


export interface RestQuery {
    get?: (componentId?: string, query?: Query, isReload?: boolean) => void;
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
        error?: boolean;
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
            if (clearState) {
                dispatch(clearState?.());
            }
        }
        const query: RestQuery = {};
        for (const key in queryThunk) {
            if (Object.prototype.hasOwnProperty.call(queryThunk, key)) {
                query[key as keyof RestQuery] = (componentId?: string, query?: Query, isReload?: boolean) => {
                    dispatch((queryThunk[key as keyof RestQuery] as any)({ payload: query, componentId, isReload }));
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
const formatDateToString = (date: Date, formatString?: string) => {
    return format(date, formatString ?? 'yyyy-MM-dd');
}
const uuid = uuidFc;

const toastify = (content: ToastContent<unknown>, options?: ToastOptions<unknown> | undefined) => {
    return toast(content, options);
}
export {
    createHookReducer,
    LazyImportComponent,
    uuid,
    formatDateToString,
    toastify
}