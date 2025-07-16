import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {imageService} from '@/services/imageService';
import {GenerateAIImagePayload, ImageGenerationHistory, UserWithStats} from '@/types';

interface ImageState {
  history: ImageGenerationHistory[];
  isGenerating: boolean;
  error: string | null;
  currentImage: string | null;
}

const initialState: ImageState = {
  history: [],
  isGenerating: false,
  error: null,
  currentImage: null,
};

// Async thunk for generating AI image
export const generateAIImage = createAsyncThunk<any, GenerateAIImagePayload, { rejectValue: string }>(
  'image/generateAI',
  async (payload: GenerateAIImagePayload, {rejectWithValue}) => {
    try {
      const response = await imageService.generateAIImage(payload);
      return {
        id: Date.now().toString(),
        prompt: payload.prompt,
        image_url: response.image_url,
        created_at: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate image');
    }
  }
);

const imageSlice = createSlice<ImageState>({
  name: 'image',
  initialState,
  reducers: {
    clearError: (state: ImageState) => {
      state.error = null;
    },
    clearHistory: (state: ImageState) => {
      state.history = [];
      state.currentImage = null;
    },
    setCurrentImage: (state: ImageState, action: PayloadAction<string | null>) => {
      state.currentImage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIImage.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateAIImage.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.history.unshift(action.payload);
        state.currentImage = action.payload.image_url;
        state.error = null;
      })
      .addCase(generateAIImage.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearError, clearHistory, setCurrentImage} = imageSlice.actions;
export default imageSlice.reducer;
