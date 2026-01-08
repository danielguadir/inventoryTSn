import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios';

interface Category {
    id: number;
    name: string;
    active: boolean;
}

interface CategoryState {
    items: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
});

export const createCategory = createAsyncThunk('categories/create', async (name: string, { rejectWithValue }) => {
    try {
        const response = await api.post('/categories', { name });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default categorySlice.reducer;
