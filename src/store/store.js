// store/store.js

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import authReducer from './reducers/authSlice';
import categoryReducer from './reducers/categorySlice';
import cartReducer from './reducers/cartSlice';
import invoiceRecuder from './reducers/invoiceSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers(
    {
        auth: authReducer,
        category: categoryReducer,
        cart: cartReducer,
        invoice: invoiceRecuder,
    });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);
