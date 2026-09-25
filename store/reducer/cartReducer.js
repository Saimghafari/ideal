import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  products: [],
};

const sameLine = (a, b) =>
  a?.productId === b?.productId &&
  a?.variantId === b?.variantId &&
  (a?.size || null) === (b?.size || null);

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
    addIntoCart: (state, action) => {
      const payload = action.payload;
      if (!payload?.productId) return;

      state.products = state.products.filter(Boolean);

      const existingProduct = state.products.findIndex((product) =>
        sameLine(product, payload)
      );

      if (existingProduct < 0) {
        state.products.push(payload);
        state.count = state.products.length;
      }
    },
    increaseQuantity: (state, action) => {
      const { productId, variantId, size } = action.payload;
      state.products = state.products.filter(Boolean);
      const existingProduct = state.products.findIndex((product) =>
        sameLine(product, { productId, variantId, size })
      );

      if (existingProduct >= 0) {
        state.products[existingProduct].qty += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const { productId, variantId, size } = action.payload;
      state.products = state.products.filter(Boolean);
      const existingProduct = state.products.findIndex((product) =>
        sameLine(product, { productId, variantId, size })
      );

      if (existingProduct >= 0) {
        if (state.products[existingProduct].qty > 1) {
          state.products[existingProduct].qty -= 1;
        }
      }
    },
    removeFromCart: (state, action) => {
      const { productId, variantId, size } = action.payload;

      state.products = state.products
        .filter(Boolean)
        .filter(
          (product) => !sameLine(product, { productId, variantId, size })
        );

      state.count = state.products.length;
    },
    sanitizeCart: (state) => {
      state.products = (state.products || []).filter(Boolean);
      state.count = state.products.length;
    },
    clearCart: (state) => {
      state.products = [];
      state.count = 0;
    },
  },
});

export const {
  addIntoCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  sanitizeCart,
  clearCart,
} = cartReducer.actions;
export default cartReducer.reducer;
