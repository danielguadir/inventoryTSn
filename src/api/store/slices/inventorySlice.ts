import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios';

interface Equipment {
    id: number;
    type: string;
    brand: string;
    model: string;
    serial: string;
    status: string;
    assignedToUserId?: number | null;
}

interface InventoryState {
    items: Equipment[];
    loading: boolean;
    error: string | null;
}

const initialState: InventoryState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchInventory = createAsyncThunk('inventory/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/equipment');
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
    }
});

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createEquipment.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateEquipment.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(assignEquipment.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteEquipment.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i.id !== action.payload);
            });
    },
});

export const createEquipment = createAsyncThunk('inventory/create', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.post('/equipment', data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create equipment');
    }
});

export const updateEquipment = createAsyncThunk('inventory/update', async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/equipment/${id}`, data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update equipment');
    }
});

export const deleteEquipment = createAsyncThunk('inventory/delete', async (id: number, { rejectWithValue }) => {
    try {
        await api.delete(`/equipment/${id}`);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete equipment');
    }
});

export const assignEquipment = createAsyncThunk('inventory/assign', async ({ id, userId }: { id: number, userId: number | null }, { rejectWithValue }) => {
    try {
        const response = await api.post(`/equipment/${id}/assign`, { userId });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to assign equipment');
    }
});

export default inventorySlice.reducer;
