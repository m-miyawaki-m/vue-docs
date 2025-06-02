Vue 2 と Vue 3 の `v-model` の違いは、**コンポーネント開発・型安全性・カスタマイズ性**に大きな影響を与える重要ポイントです。

ここでは、Vue 2 と Vue 3 の違いを比較しながら、Vue 3 の進化点である **`modelValue` / `update:modelValue` ベースとカスタマイズ性の向上** に焦点を当てて解説します。

---

## ✅ 7. `v-model` の Vue 2 / Vue 3 の違い

---

### 🔹 1. Vue 2 の `v-model`（value / input）

#### ✅ 使い方（親）

```vue
<!-- 親コンポーネント -->
<CustomInput v-model="name" />
```

#### ✅ 子コンポーネント

```vue
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value']
}
</script>
```

#### 📌 特徴

| 項目       | 内容                           |
| -------- | ---------------------------- |
| props    | `value` 固定                   |
| emits    | `input` イベント限定               |
| カスタムモデル名 | `model: { prop, event }` が必要 |

---

### 🔹 2. Vue 3 の `v-model`（modelValue / update\:modelValue）

#### ✅ 使い方（親）

```vue
<CustomInput v-model="name" />
```

#### ✅ 子コンポーネント

```vue
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script>
export default {
  props: {
    modelValue: String
  },
  emits: ['update:modelValue']
}
</script>
```

#### 📌 特徴

| 項目       | 内容                      |
| -------- | ----------------------- |
| props    | `modelValue`（名前変更可能）    |
| emits    | `update:modelValue`（柔軟） |
| カスタムモデル名 | 不要（デフォルトで自動対応）          |

---

### 🔹 3. カスタマイズ性の向上（Vue 3）

#### ✅ 複数の `v-model` に対応（名前付き）

```vue
<CustomRange
  v-model:from="startDate"
  v-model:to="endDate"
/>
```

#### ✅ 子コンポーネント

```ts
props: {
  from: String,
  to: String
},
emits: ['update:from', 'update:to']
```

---

### ✅ 比較表：Vue 2 vs Vue 3 の違い

| 比較項目             | Vue 2        | Vue 3                     |
| ---------------- | ------------ | ------------------------- |
| バインディングプロパティ     | `value`      | `modelValue`（任意の名前に変更可）   |
| イベント名            | `input`      | `update:modelValue`（複数対応） |
| 複数 v-model       | ❌ 不可         | ✅ `v-model:xxx` 形式で対応可能   |
| 型安全性（TypeScript） | ❌ 弱い（推論しづらい） | ✅ 強い（明示的に型を渡せる）           |
| 柔軟な API 設計       | 限定的          | 高度にカスタマイズ可能               |

---

## 💡 まとめ

| Vue バージョン | 開発スタイルにおすすめ            | 備考                                        |
| --------- | ---------------------- | ----------------------------------------- |
| Vue 2     | 単純なフォームや v2 プロジェクト継続開発 | `value/input` 限定で柔軟性はやや低い                 |
| Vue 3     | 複雑なコンポーネント、TS連携が必要なケース | `modelValue/update:*` + `v-model:xxx` が可能 |

---

次に進めるおすすめトピックは：

* `v-model` の多層ネスト（Object中の特定プロパティだけを制御）
* Vuex や Form validation との組み合わせパターン
* `defineComponent` + emits の最適な書き方テンプレート集

どれに進めたいですか？
