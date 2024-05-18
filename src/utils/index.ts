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
import { Method } from "axios";

const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
const thousands = ["", "nghìn", "triệu", "tỷ"];

export interface RestQuery {
    /**
     * 
     * @param componentId 
     * @param query 
     * @param isReload 
     * @param callbackFnc - execute when action query success
     * 
     * @returns 
     */
    get?: (componentId?: string, query?: Query, isReload?: boolean, callbackFnc?: () => void, method?: Method) => void;
    post?: (componentId?: string, query?: Query, isReload?: boolean, callbackFnc?: () => void, method?: Method) => void;
    put?: (componentId?: string, query?: Query, isReload?: boolean, callbackFnc?: () => void, method?: Method) => void;
    delete?: (componentId?: string, query?: Query, isReload?: boolean, callbackFnc?: (isSuccess?: boolean, message?: string) => void, method?: Method) => void;
}

export interface ResultHook extends RestQuery {
    state: {
        data: Obj | any;
        isLoading: boolean;
        [k: string]: any;
        success: boolean;
        componentId?: string;
        error?: boolean;
        method?: Method
    };
    clear: () => void;
}
function groupToWords(n: number) {
    let hundred = Math.floor(n / 100);
    let ten = n % 100;
    let word = '';
    if (hundred > 0) {
        word += units[hundred] + " trăm ";
        if (ten > 0 && ten < 10) word += "lẻ ";
    }

    if (ten > 0 && ten < 10) {
        word += units[ten];
    } else if (ten >= 10 && ten < 20) {
        word += teens[ten - 10];
    } else if (ten >= 20) {
        word += tens[Math.floor(ten / 10)];
        if (ten % 10 > 0) word += " " + units[ten % 10];
    }

    return word.trim();
}

const numberToVNWords = (n: number) => {
    if (n === 0) return "không";

    let words = '';
    let groupIndex = 0;

    while (n > 0) {
        let group = n % 1000;
        if (group > 0) {
            words = groupToWords(group) + (thousands[groupIndex] ? ' ' + thousands[groupIndex] + ' ' : '') + words;
        }
        n = Math.floor(n / 1000);
        groupIndex++;
    }
    const lastWords = words.trim();
    lastWords.charAt(0).toUpperCase();
    return lastWords.charAt(0).toUpperCase() + lastWords.slice(1);
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
                query[key as keyof RestQuery] = (componentId?: string, query?: Query, isReload?: boolean, callbackFnc?: (isSuccess?: boolean, message?: string) => void, method?: Method) => {
                    dispatch((queryThunk[key as keyof RestQuery] as any)({ payload: query, componentId, isReload, callbackFnc, method }));
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
    toastify,
    numberToVNWords
}