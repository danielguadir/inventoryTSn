import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios';

interface RequestItem {
    id: number;
    description: string;
    status: string;
    createdAt: string;
    equipment?: any;
    category?: any;
}

interface RequestState {
    items: RequestItem[];
    loading: boolean;
    error: string | null;
}

const initialState: RequestState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchRequests = createAsyncThunk('requests/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/requests');
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
    }
});

export const createRequest = createAsyncThunk('requests/create', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.post('/requests', data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create request');
    }
});

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(createRequest.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateRequestStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export const updateRequestStatus = createAsyncThunk('requests/updateStatus', async ({ id, status, adminComment }: { id: number, status: string, adminComment?: string }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/requests/${id}/status`, { status, adminComment });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update request status');
    }
});

export default requestSlice.reducer;
