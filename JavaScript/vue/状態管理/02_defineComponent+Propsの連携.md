`defineComponent` と `props` を使った「親→子コンポーネント間の受け渡し」について、Vue 3（TypeScript＋Vuetify 3前提）での**深掘りポイント**を以下にまとめます。

---

## 🔍 基本構造：defineComponent + props

### ✅ 親 → 子への値の受け渡し（Props）

```vue
<!-- Parent.vue -->
<template>
  <ChildComponent :title="'こんにちは'" :count="5" />
</template>

<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'
</script>
```

```ts
<!-- ChildComponent.vue -->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    console.log(props.title, props.count)
    return { props }
  }
})
</script>
```

---

## 🧠 深掘りポイント

### ① 型安全に書く（TypeScript）

```ts
// 型定義と props を連動させる
export default defineComponent({
  props: {
    title: String,
    count: Number
  },
  setup(props: { title: string; count: number }) {
    // props 型が明確で安心
  }
})
```

**または型エイリアスで定義：**

```ts
interface Props {
  title: string
  count: number
}

export default defineComponent({
  props: {
    title: String,
    count: Number
  },
  setup(props: Props) {
    // 型付き props を扱える
  }
})
```

---

### ② readonly であることに注意（props は直接書き換え不可）

```ts
setup(props) {
  // ❌ props.count++ はエラーになる（readonly）
  // ✅ 一時変数としてコピーしてから操作
  const localCount = ref(props.count)

  return { localCount }
}
```

---

### ③ default 値の型が props と合わない場合の警告に注意

```ts
props: {
  count: {
    type: Number,
    default: '5'  // ❌ String → Number で型不一致
  }
}
```

---

### ④ defineComponent + emits を併用して親に通知

```ts
export default defineComponent({
  props: { value: String },
  emits: ['update:value'],
  setup(props, { emit }) {
    const update = () => emit('update:value', '新しい値')
    return { update }
  }
})
```

親は `v-model:value="xxx"` でバインド可能。

---

## ✅ `<script setup>` での props 定義（Composition API）

より簡潔に、以下のように記述できます：

```ts
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}
const props = defineProps<Props>()
</script>
```

---

## 🧩 Vuetify連携：v-card で使う場合

```vue
<!-- ChildComponent.vue -->
<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>カウント: {{ count }}</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  count?: number
}
const props = defineProps<Props>()
</script>
```

---

## 📌 学習ポイントまとめ

| 項目             | 要点                               |
| -------------- | -------------------------------- |
| propsの受け取り方法   | `defineProps` または `setup(props)` |
| propsの型指定      | TypeScriptで `interface` を定義推奨    |
| propsはreadonly | 更新は `ref()` でローカルコピーして操作         |
| propsのdefault値 | `type` と一致しないと型警告が出る             |
| イベント連携         | `emit` を用いて親と連携（`v-model` も可能）   |

---

必要であれば、この内容を `.md` に組み込んでテンプレートとして保存できます。続けて「emitによる親子連携」や「双方向バインディング（v-model）」も深掘りしましょうか？
