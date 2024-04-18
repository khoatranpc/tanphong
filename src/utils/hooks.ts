import { QueryGetExample } from "@/store/reducers/example";
import { createHookReducer } from ".";

const useExample = createHookReducer('exampleReducer', {
    get: QueryGetExample
});

export {
    useExample
}