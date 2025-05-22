import { createStore } from 'vuex'


export default createStore({
  state: () => ({
    headers: [],
    items: [],
  }),
  mutations: {
    setHeaders(state, headers) {
      state.headers = headers
    },
    setItems(state, items) {
      state.items = items
    }
  },
    updateItem(state, updatedItem) {
    const index = state.items.findIndex(item => item.name === updatedItem.name)
    if (index !== -1) {
      state.items[index] = { ...updatedItem }
    }
  },
  getters: {
    headers: (state) => state.headers,
    items: (state) => state.items,
  }
})
