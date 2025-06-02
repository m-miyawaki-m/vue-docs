Vue 3 では、`v-model` の複数対応により、**1つのコンポーネントに対して複数の状態を親子間で双方向バインディングする**ことができます。

ここでは、以下の3点について、例とともに詳細に解説します：

---

## ✅ 5. 複数 `v-model` の応用

---

### 🔹 1. 複数プロパティをバインディングする設計

#### 📌 背景

従来は `v-model="foo"` しか使えませんでしたが、Vue 3 では：

```vue
<MyComponent
  v-model:checked="isChecked"
  v-model:label="label"
/>
```

のように、**複数の `v-model:プロパティ名`** を同時に使えます。

---

### ✅ 例：チェック付きラベル入力コンポーネント

#### 👇 親コンポーネント

```vue
<template>
  <CheckLabelInput
    v-model:checked="isChecked"
    v-model:label="label"
  />
  <p>チェック: {{ isChecked }} / ラベル: {{ label }}</p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CheckLabelInput from './CheckLabelInput.vue'

export default defineComponent({
  components: { CheckLabelInput },
  setup() {
    const isChecked = ref(false)
    const label = ref('デフォルト名')
    return { isChecked, label }
  }
})
</script>
```

---

#### 👇 子コンポーネント（CheckLabelInput.vue）

```vue
<template>
  <div>
    <input type="checkbox" :checked="checked" @change="$emit('update:checked', $event.target.checked)" />
    <input type="text" :value="label" @input="$emit('update:label', $event.target.value)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    checked: Boolean,
    label: String
  },
  emits: ['update:checked', 'update:label']
})
</script>
```

---

### 🔹 2. 複数 `v-model` の親子間通信のポイント

| 親での指定             | 子での props 名 | 子で emit するイベント   |
| ----------------- | ----------- | ---------------- |
| `v-model:checked` | `checked`   | `update:checked` |
| `v-model:label`   | `label`     | `update:label`   |

#### 📌 重要ルール

* `v-model:foo="bar"` → `props.foo` + `@update:foo`
* 無名の `v-model` は `modelValue` / `update:modelValue` として処理される

---

### 🔹 3. props + emits との連携パターン

#### ✅ 型を伴う明示的な定義（TypeScript推奨）

```ts
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    checked: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  emits: {
    'update:checked': (value: boolean) => typeof value === 'boolean',
    'update:label': (value: string) => typeof value === 'string'
  }
})
```

### ✅ メリット

| 項目        | 内容                                     |
| --------- | -------------------------------------- |
| 型安全       | TypeScript で `emits` と `props` に型指定が可能 |
| 親子での同期が明確 | `props` で受けて `emit` で更新する双方向構造が明快      |
| 再利用性が高い   | 1つのコンポーネントで複数の状態を効率的に受け渡せるようになる        |

---

## 🎯 よくある応用例

| ユースケース     | バインディング対象                          | 備考                 |
| ---------- | ---------------------------------- | ------------------ |
| フィルター条件入力  | `v-model:keyword`, `v-model:range` | 複数の検索条件を1つのフォームで管理 |
| チェック付きテキスト | `v-model:checked`, `v-model:text`  | フォーム部品の作り込みで多用     |
| 日付範囲セレクタ   | `v-model:start`, `v-model:end`     | 期間を2つの値で扱う         |

---

次は、`v-model` と `computed` を連携して「中間処理を挟んで状態を同期」するパターンに進みますか？
または、「watch連携」や「Formバリデーションとの併用」もおすすめです。
