import { createSlice } from '@reduxjs/toolkit';

// Початковий стан (поки що порожній масив постів)
const initialState = {
  items: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Тут пізніше будуть функції для зміни стану вручну
    // Наприклад: setPosts, addPost...
  },
});

// Експортуємо сам редюсер, щоб підключити його в store
export default postsSlice.reducer;