`v-model` と `computed` を連携させることで、**中間変換処理・加工・同期制御**などを実現できます。これは、親コンポーネントから受け取ったデータに加工を加えたり、書き込み時に特定のバリデーション・副作用を持たせたいときに便利です。

---

## ✅ 6. `v-model` と `computed` の連携パターン

---

### 🔹 1. computed を使って `v-model` をラップする基本パターン

#### 🎯 目的

* `v-model` で渡された値を **そのまま使わずに加工** して扱いたい
* 書き込み時に何か処理（整形や制約）を追加したい

---

### ✅ 例：文字列を自動で trim する

#### 👇 親コンポーネント

```vue
<template>
  <TrimmedInput v-model="name" />
  <p>名前: {{ name }}</p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TrimmedInput from './TrimmedInput.vue'

export default defineComponent({
  components: { TrimmedInput },
  setup() {
    const name = ref('')
    return { name }
  }
})
</script>
```

---

#### 👇 子コンポーネント（`TrimmedInput.vue`）

```vue
<template>
  <input v-model="internalValue" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    modelValue: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.modelValue?.trim() ?? '',
      set: val => emit('update:modelValue', val.trim())
    })

    return { internalValue }
  }
})
</script>
```

---

### 🔍 解説：getter / setter の型

```ts
const internalValue = computed({
  get: () => props.modelValue,         // 読み取り
  set: val => emit('update:modelValue', val)  // 書き込み
})
```

| 処理    | 内容                             |
| ----- | ------------------------------ |
| `get` | 親から渡された `modelValue` を加工して取得する |
| `set` | 子での入力に応じて emit を発行 → 親に新しい値を通知 |

---

### ✅ 応用：数値変換＋バリデーション

```ts
const age = computed({
  get: () => props.modelValue,
  set: val => {
    const num = Number(val)
    if (!isNaN(num) && num >= 0) {
      emit('update:modelValue', num)
    }
  }
})
```

---

## ✅ 利用場面のまとめ

| シチュエーション            | computed + v-model が活きる理由       |
| ------------------- | ------------------------------- |
| 空白を自動除去（trim）       | 親のデータをきれいに保ちたい                  |
| 数値変換 or 整形（例：3桁カンマ） | 表示は整形、内部は純データで扱いたい              |
| 入力制限・補正             | 負の数禁止、文字数制限、日付変換などに応用可能         |
| 双方向同期の中間にロジックを挟みたい  | フォーム設計でのリアルタイム制御や Vuex 連携時などに便利 |

---

## 🧩 補足：Composition API 以外（Option API）でも使える？

はい、`computed` を `data` と `watch` で代替することもできますが、双方向連携の柔軟性では Composition API（`setup` + `computed`）の方が自然で効率的です。

---

必要であれば、次は「`watch` で v-model の値をリアルタイム監視・連携する方法」や、「Vuex ストアとの v-model 連携例」に進むこともできます。続けますか？

素晴らしい質問です。
Vue 3 において `defineComponent` を使うときに、`setup()`, `data()`, `computed()` を**混在させることは可能**です。ただし、**それぞれのスコープが違うため、役割や使いどころを明確に区別する必要があります。**

---

## ✅ `defineComponent` 内での `setup()`, `data()`, `computed()` の関係

### 🔹 結論（まず整理）

| ブロック         | 使用目的                        | `this` で参照できる | リアクティブ性 | 備考                                  |
| ------------ | --------------------------- | ------------- | ------- | ----------------------------------- |
| `data()`     | Options API の状態宣言           | ✅ 可能          | ✅ あり    | 最もシンプルな状態定義                         |
| `computed()` | data を元に導出値を作成（Options API） | ✅ 可能          | ✅ 自動    | `data` や `props` の変更に応じて再計算される      |
| `setup()`    | Composition API の導入点        | ❌ `this` 不可   | ✅ 明示    | `ref`, `computed`, `watch` などの関数で記述 |

---

## ✅ 例：全部入り defineComponent

```ts
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  props: {
    modelValue: String
  },
  emits: ['update:modelValue'],

  data() {
    return {
      localCount: 0
    }
  },

  computed: {
    doubledCount(): number {
      return this.localCount * 2
    }
  },

  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.modelValue?.trim() ?? '',
      set: val => emit('update:modelValue', val.trim())
    })

    const inputRef = ref<HTMLInputElement | null>(null)

    return {
      internalValue,
      inputRef
    }
  }
})
</script>
```

---

## 🧠 スコープの違い（超重要）

| アクセス対象                         | `setup()` からアクセス               | `data()` / `computed()` からアクセス |
| ------------------------------ | ------------------------------ | ------------------------------ |
| `props`                        | `setup(props)` で直接参照           | `this.props.xxx` は使えない         |
| `emit`                         | `setup(_, { emit })`で取得        | `this.$emit()` は使える            |
| `data()` の値                    | ❌ 使えない                         | `this.xxx` で使える                |
| `setup()` の `ref` や `computed` | `return` すれば `<template>` からも可 | `this.xxx` では参照不可              |

---

## ✅ 混在パターンのベストプラクティス

* **`setup()` に書くべき：**

  * props の加工（v-model の computed 化など）
  * 外部ライブラリ連携、型付き `ref`
  * Composition API スタイルが好ましいロジック

* **`data()` に書くべき：**

  * 単純な表示用状態（Vue 2 互換、明快な初期値）

* **`computed()` に書くべき：**

  * data から導出される派生値（`this.count * 2` など）

---

## ✅ 実践上の注意点

* `setup()` を使うと `this` は無効 → `data()` や `computed()` 内の関数で `setup()` 変数にアクセスできない
* **Vuex を使うなら `setup()` に統一した方が可読性が高くなるケースが多い**

---

## 🔄 代替提案

もし、プロジェクトで **Option API（data / computed）を主に使っているなら**：

* `setup()` では `v-model` 対応の `computed` だけに留め、その他は `data()` と `computed()` に寄せるのが自然です。

---

ご希望があれば、**この構成でのテンプレート**や、**Option API ベースでの v-model + emits 設計例**もご用意できます！続きを希望しますか？

以下に、**Option APIベース（`data()` / `computed()` / `methods()`）を活かしつつ、Vue 3 の `v-model` と `emits` に対応したテンプレート構成**を提示します。

---

## ✅ Option APIベース：`v-model` + `emits` 対応テンプレート

### 🧩 構成イメージ

* `v-model` で親から値を受け取る
* `modelValue` を `computed` でラップ（双方向）
* `this.$emit('update:modelValue', 新しい値)` で親に通知
* UIと状態を `data()` で保持しやすい形にする

---

### ✅ テンプレートコード

```vue
<template>
  <div>
    <label>名前：</label>
    <input v-model="localValue" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomTextInput',

  props: {
    modelValue: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue'],

  data() {
    return {
      // 他の表示用データやローカル状態
      hasFocus: false
    }
  },

  computed: {
    /**
     * v-model を computed 経由でラップ
     */
    localValue: {
      get(): string {
        return this.modelValue
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

## ✅ 親コンポーネントでの使用例

```vue
<template>
  <CustomTextInput v-model="username" />
  <p>入力された名前: {{ username }}</p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CustomTextInput from './components/CustomTextInput.vue'

export default defineComponent({
  components: { CustomTextInput },
  setup() {
    const username = ref('初期値')
    return { username }
  }
})
</script>
```

---

## ✅ 補足ポイント

| ポイント                  | 説明                                          |
| --------------------- | ------------------------------------------- |
| `props.modelValue`    | `v-model` のバインディング元（親 → 子）                  |
| `computed.localValue` | `v-model` の getter/setter を中継してラップ          |
| `this.$emit(...)`     | 子 → 親への通知方法（双方向バインディングを成立させるために必要）          |
| Option API併用          | `data()`・`computed()`・`methods()` が自然に使える構成 |

---

## 🧪 応用パターン（必要に応じて提供できます）

* `v-model:number`（数値専用入力）
* `v-model="form"` でオブジェクト全体をやり取り
* `v-model:visible="isOpen"` モーダル開閉制御
* `v-model:from`, `v-model:to` で日付範囲などの複数状態をバインド

---

次に「バリデーション付きの Option API v-model 入力フォーム」や、「v-modelオブジェクトでのリスト編集テンプレート」なども出せます。ご希望があれば続けましょうか？
