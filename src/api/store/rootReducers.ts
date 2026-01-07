import { combineReducers } from '@reduxjs/toolkit'
import productSlice from './slices/productSlice'

const rootReducer = combineReducers({
  product: productSlice,
})

export default rootReducer
