import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store";
import rootReducer from "@/store/reducer"
import { State } from "./redux-toolkit";
import { Query } from "./axios";

export interface RestQuery {
    get?: (query?: Query) => void;
    post?: (query?: Query) => void;
    put?: (query?: Query) => void;
    delete?: (query?: Query) => void;
}

const createHookReducer = (name: keyof typeof rootReducer, queryThunk?: {
    get?: Function;
    post?: Function;
    put?: Function;
    delete?: Function;
}, clearState?: Function) => {
    return () => {
        const dispatch = useDispatch<AppDispatch>();
        const data = useSelector((state: RootState) => (state[name] as State).state);

        const clear = () => {
            dispatch(clearState?.());
        }
        const query: RestQuery = {};
        for (const key in queryThunk) {
            if (Object.prototype.hasOwnProperty.call(queryThunk, key)) {
                query[key as keyof RestQuery] = (query?: Query) => {
                    dispatch((queryThunk[key as keyof RestQuery] as any)(query));
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

export {
    createHookReducer
}