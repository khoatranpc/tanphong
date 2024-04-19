import exampleReducer from './reducers/example';
import contractStorage from './reducers/storage/contract.reducer';
import serviceStorage from './reducers/storage/service.reducer';
import contractServiceStorage from './reducers/storage/contractService.reducer';
import typeServiceStorage from './reducers/storage/typeService.reducer';
import propertyStorage from './reducers/storage/property.reducer';
import typePropertyStorage from './reducers/storage/typeProperty.reducer';

const rootReducer = {
    exampleReducer,
    contractStorage,
    serviceStorage,
    contractServiceStorage,
    typeServiceStorage,
    propertyStorage,
    typePropertyStorage
}

export default rootReducer;