import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';
import inventoryReducer from './slices/inventorySlice';
import requestReducer from './slices/requestSlice';
import productSlice from './slices/productSlice'; // Mantener si es necesario, o remover
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  inventory: inventoryReducer,
  requests: requestReducer,
  product: productSlice,
  users: userReducer,
  categories: categoryReducer,
})

export default rootReducer
