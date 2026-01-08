import { createSlice } from '@reduxjs/toolkit'
import api from '../../axios';
import type { PayloadAction } from '@reduxjs/toolkit'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface ProductsState {
  items: Product[]
  filteredItems: Product[]
  selectedCategory: string | null
  isLoading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      state.filteredItems = action.payload
        ? state.items.filter((product) => product.category === action.payload)
        : state.items
    },
    clearFilter: (state) => {
      state.selectedCategory = null
      state.filteredItems = state.items
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload)
      state.filteredItems.push(action.payload)
    },
  },
})

export const { setProducts, filterByCategory, clearFilter, addProduct } = productSlice.actions

export default productSlice.reducer
