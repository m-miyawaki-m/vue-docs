`defineComponent` を使った Vue 3 + TypeScript における `v-model` の使い方と注意点を、**Composition API（非 `<script setup>`）スタイル**に特化して深掘りして整理します。

---

# 🎛 `v-model` の使い方と注意点（defineComponent版）

---

## ✅ 基本構造（子コンポーネント）

```ts
// 子コンポーネント（MyInput.vue）
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyInput',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = (event: Event) => {
      const value = (event.target as HTMLInputElement).value
      emit('update:modelValue', value)
    }

    return {
      onInput,
      modelValue: props.modelValue
    }
  }
})
</script>

<template>
  <input :value="modelValue" @input="onInput" />
</template>
```

---

## ✅ 親コンポーネントでの使用

```vue
<template>
  <MyInput v-model="text" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MyInput from './MyInput.vue'

export default defineComponent({
  components: { MyInput },
  setup() {
    const text = ref('')
    return { text }
  }
})
</script>
```

---

## 📌 `v-model` に関する注意点（defineComponent）

### ⚠ 1. **`modelValue` という名前が固定（v-modelのデフォルト）**

* 子で受け取る prop の名前は必ず `modelValue`
* emit 名は必ず `'update:modelValue'`

### ⚠ 2. **片方向バインディングに注意**

* 親から渡された `modelValue` は **readonly**
* 子で直接変更しようとするとエラー（変更は emit 経由）

### ⚠ 3. **複数の v-model を使いたい場合（v-model\:xxx）**

```vue
<MyInput v-model:text="text" v-model:label="label" />
```

```ts
props: {
  text: String,
  label: String
},
emits: ['update:text', 'update:label']
```

---

## ✅ `computed` で双方向バインディング（v-modelを模した書き方）

```ts
setup(props, { emit }) {
  const model = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val)
  })

  return { model }
}
```

```vue
<template>
  <input v-model="model" />
</template>
```

---

## 🧠 よくあるミス

| ミス                                            | 内容                         |
| --------------------------------------------- | -------------------------- |
| `v-model` で使っているのに `props` に `modelValue` がない | → 受け取り漏れでエラー               |
| `emit('update:modelvalue', ...)` のつづりミス       | → イベントが親に伝わらない             |
| `modelValue` を直接書き換えようとする                     | → readonly プロパティのため Vue 警告 |

---

## 🧪 応用：Vuetify + v-model 対応例（`v-switch`, `v-text-field`など）

```vue
<template>
  <v-switch :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
</template>
```

---

## ✅ まとめ：ベストプラクティス

| ポイント                                   | 推奨内容                    |
| -------------------------------------- | ----------------------- |
| `modelValue` / `update:modelValue` を明示 | v-model の仕様通りに従う        |
| `computed` で `v-model` と連動させる          | getter/setter を使って柔軟に制御 |
| emit の型を `defineEmits` / 引数チェックで補強     | TypeScriptで安全性確保        |

---

必要であればこの内容を `.md` に整形して「`v-model` 設計パターン（defineComponent版）」としてドキュメント化できます。
また、「v-model を複数使う場合」「内部状態とのずれを防ぐ方法」など、さらに深掘り可能です。続けますか？
