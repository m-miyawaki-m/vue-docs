以下に、Vue 3（TypeScript + `defineComponent`）で `emits` を正しく・型安全に使うための「最適なテンプレート集」を整理しました。`v-model` を含むパターンもカバーしています。

---

## ✅ `defineComponent` + `emits` 最適テンプレート集

---

### 🔹 ① 基本：単一イベントを emit するパターン

#### 📌 親コンポーネント

```vue
<ChildComponent @submit="handleSubmit" />
```

#### ✅ 子コンポーネント

```ts
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['submit'],

  methods: {
    onClick() {
      this.$emit('submit')
    }
  }
})
</script>
```

---

### 🔹 ② 引数ありイベント（型付き）

#### 📌 emits に引数チェックを追加（TypeScriptあり）

```ts
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    submit: (payload: { id: number; name: string }) => {
      return typeof payload.id === 'number' && typeof payload.name === 'string'
    }
  },

  methods: {
    submitForm() {
      this.$emit('submit', { id: 1, name: 'Taro' })
    }
  }
})
</script>
```

---

### 🔹 ③ `v-model` 対応 emits

#### 📌 親で使う

```vue
<CustomInput v-model="username" />
```

#### ✅ 子コンポーネント（v-model）

```ts
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: String
  },
  emits: ['update:modelValue'],

  computed: {
    localValue: {
      get(): string {
        return this.modelValue ?? ''
      },
      set(val: string) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>
```

---

### 🔹 ④ 複数 `v-model:xxx` 対応

```vue
<FilterForm
  v-model:keyword="searchKeyword"
  v-model:range="selectedRange"
/>
```

```ts
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    keyword: String,
    range: Object
  },
  emits: ['update:keyword', 'update:range']
})
</script>
```

---

### 🔹 ⑤ emit の型情報を `setup()` で使う（Composition API）

```ts
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    submit: (val: string) => typeof val === 'string'
  },

  setup(_, { emit }) {
    const send = () => {
      emit('submit', '送信された文字列')
    }

    return { send }
  }
})
</script>
```

---

## 🧩 まとめ表

| パターン             | 使用例                        | 特徴                     |
| ---------------- | -------------------------- | ---------------------- |
| 基本 emit          | `emits: ['submit']`        | 引数不要のイベントに最適           |
| 引数付き emit（型検査）   | `emits: { submit: fn }`    | 引数の型を明示できる             |
| `v-model`        | `update:modelValue`        | 双方向バインディングの基本構成        |
| 複数 v-model       | `update:xxx`, `update:yyy` | 柔軟なフォーム構成が可能           |
| setup から emit 使用 | `setup(_, { emit })`       | Composition API に自然に対応 |

---

### 📎 実装テンプレート一式が必要なら…

> ご希望に応じて「共通入力部品」「トグル」「カレンダー」「バリデーション付きフォーム」など、`defineComponent + emits + v-model` の組み込みテンプレートを一括で提供できます。続けますか？
