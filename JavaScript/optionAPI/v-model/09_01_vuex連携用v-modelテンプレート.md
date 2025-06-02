以下に、**Vue 3（Option API）+ Vuex 4** で `v-model` とストアを連携させるためのテンプレートを提供します。
典型的なケースとして「モーダル表示状態の管理（Boolean）」を例に、**型安全・双方向同期・再利用性**を意識した構成になっています。

---

## ✅ Vuex 連携用 `v-model` テンプレート（Option API）

---

### 🔹① Vuex ストア定義（例：`store/modules/ui.ts`）

```ts
// Vuex 4 用
export const uiModule = {
  namespaced: true,
  state: () => ({
    showModal: false
  }),
  mutations: {
    setShowModal(state, value: boolean) {
      state.showModal = value
    }
  }
}
```

#### ✅ ストア登録（`store/index.ts`）

```ts
import { createStore } from 'vuex'
import { uiModule } from './modules/ui'

export default createStore({
  modules: {
    ui: uiModule
  }
})
```

---

### 🔹② 親コンポーネント（`Page.vue`）

```vue
<template>
  <MyModal v-model="modalVisible" />
  <v-btn @click="modalVisible = true">モーダルを開く</v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapMutations } from 'vuex'
import MyModal from './MyModal.vue'

export default defineComponent({
  components: { MyModal },

  computed: {
    ...mapState('ui', ['showModal']),
    modalVisible: {
      get(): boolean {
        return this.showModal
      },
      set(val: boolean) {
        this.setShowModal(val)
      }
    }
  },

  methods: {
    ...mapMutations('ui', ['setShowModal'])
  }
})
</script>
```

---

### 🔹③ 子コンポーネント（`MyModal.vue`）

```vue
<template>
  <v-dialog v-model="internalVisible" persistent max-width="400">
    <v-card>
      <v-card-title>モーダル</v-card-title>
      <v-card-actions>
        <v-btn @click="internalVisible = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  computed: {
    internalVisible: {
      get(): boolean {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>
```

---

## 📌 解説：この構成のメリット

| 項目             | 内容                                             |
| -------------- | ---------------------------------------------- |
| Option API で完結 | Composition API を使わずに `v-model` と Vuex をつなげる   |
| Vuex との双方向同期   | `computed` の getter/setter を使うことで状態を自然に同期      |
| テンプレート側はシンプル   | `<MyModal v-model="modalVisible" />` だけで状態制御可能 |
| 再利用性が高い        | 同様のパターンでトグルスイッチ・チェックリスト・フィルター条件にも拡張可能          |

---

## 🧩 応用例も提供可能

* フィルター用の `v-model:keyword` + `v-model:range` を Vuex に接続
* タブ状態、サイドバー表示、ダイアログなどの ON/OFF 管理
* `v-model` オブジェクト構造と Vuex モジュール連携（フォームデータ）

必要であれば、その応用バージョンも追加でお渡し可能です。どうしますか？

了解しました。以下に、Vue 3 + Vuex 4 + Option API を使って実現する、**UI 状態（タブ・サイドバー・ダイアログ）やオブジェクト型フォームデータの双方向バインディング（v-model）とストア連携**のテンプレートを2種類に分けて提示します。

---

## ✅ A. UI 状態（ON/OFF）を Vuex + v-model で管理するテンプレート

### 想定：複数UIの状態管理

* `activeTab: 'tab1'`
* `sidebarVisible: true`
* `dialogOpen: false`

---

### 🔹 ストア定義（`store/modules/ui.ts`）

```ts
export const uiModule = {
  namespaced: true,
  state: () => ({
    activeTab: 'tab1',
    sidebarVisible: false,
    dialogOpen: false
  }),
  mutations: {
    setActiveTab(state, val: string) {
      state.activeTab = val
    },
    setSidebarVisible(state, val: boolean) {
      state.sidebarVisible = val
    },
    setDialogOpen(state, val: boolean) {
      state.dialogOpen = val
    }
  }
}
```

---

### 🔹 親コンポーネント（`MainLayout.vue`）

```vue
<template>
  <TabBar v-model="activeTab" />
  <Sidebar v-model="sidebarVisible" />
  <Dialog v-model="dialogOpen" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapMutations } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState('ui', ['activeTab', 'sidebarVisible', 'dialogOpen']),

    activeTab: {
      get(): string {
        return this.$store.state.ui.activeTab
      },
      set(val: string) {
        this.setActiveTab(val)
      }
    },
    sidebarVisible: {
      get(): boolean {
        return this.$store.state.ui.sidebarVisible
      },
      set(val: boolean) {
        this.setSidebarVisible(val)
      }
    },
    dialogOpen: {
      get(): boolean {
        return this.$store.state.ui.dialogOpen
      },
      set(val: boolean) {
        this.setDialogOpen(val)
      }
    }
  },
  methods: {
    ...mapMutations('ui', ['setActiveTab', 'setSidebarVisible', 'setDialogOpen'])
  }
})
</script>
```

---

### 🔹 子コンポーネント（例：`Dialog.vue`）

```vue
<template>
  <v-dialog v-model="internalVisible" persistent>
    <v-card>
      <v-card-title>確認</v-card-title>
      <v-card-actions>
        <v-btn @click="internalVisible = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  computed: {
    internalVisible: {
      get() {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>
```

---

## ✅ B. `v-model` でオブジェクト型フォームと Vuex モジュール連携

### 想定：ユーザー編集フォーム

```ts
interface UserForm {
  name: string
  age: number
  email: string
}
```

---

### 🔹 ストア定義（`store/modules/form.ts`）

```ts
export const formModule = {
  namespaced: true,
  state: (): { user: UserForm } => ({
    user: {
      name: '',
      age: 0,
      email: ''
    }
  }),
  mutations: {
    updateUser(state, val: UserForm) {
      state.user = { ...val } // 浅コピーで更新
    }
  }
}
```

---

### 🔹 親コンポーネント（`UserEdit.vue`）

```vue
<template>
  <UserForm v-model="user" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapMutations } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState('form', ['user']),
    user: {
      get() {
        return this.$store.state.form.user
      },
      set(val) {
        this.updateUser(val)
      }
    }
  },
  methods: {
    ...mapMutations('form', ['updateUser'])
  }
})
</script>
```

---

### 🔹 子コンポーネント（`UserForm.vue`）

```vue
<template>
  <div>
    <input v-model="form.name" placeholder="名前" />
    <input v-model.number="form.age" placeholder="年齢" />
    <input v-model="form.email" placeholder="メール" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: Object
  },
  emits: ['update:modelValue'],
  data() {
    return {
      form: { ...this.modelValue }
    }
  },
  watch: {
    modelValue(newVal) {
      this.form = { ...newVal }
    }
  },
  methods: {
    update() {
      this.$emit('update:modelValue', { ...this.form })
    }
  },
  mounted() {
    this.$watch('form', this.update, { deep: true })
  }
})
</script>
```

---

## 🧠 補足まとめ

| 機能             | 実装方法                                       |
| -------------- | ------------------------------------------ |
| ON/OFF の UI 制御 | `v-model` + Vuex + Boolean                 |
| オブジェクトフォーム同期   | `v-model` に `UserForm` を渡し、store に同期       |
| 双方向バインディング制御   | `computed` の getter/setter + mutation 呼び出し |

---

必要であれば、これらを `.vue` 単体ファイルの構成セットとしても出力可能です。
また、Formバリデーション（VeeValidate等）との連携テンプレートも対応可能です。続けますか？
