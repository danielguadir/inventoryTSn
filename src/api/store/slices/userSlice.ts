import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

interface UserState {
    items: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
});

export const createUser = createAsyncThunk('users/create', async (userData: any, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
});

export default userSlice.reducer;
