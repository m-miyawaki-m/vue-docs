Vue 3 における `ref` と `reactive` の違い・使い分け・内部構造の理解は、**リアクティブな状態管理の核心**です。以下に**深掘り解説**を体系的にまとめます。

---

# 🧠 `ref` vs `reactive` の深掘り比較

| 項目         | `ref`                           | `reactive`              |
| ---------- | ------------------------------- | ----------------------- |
| 用途         | プリミティブ値、単一のオブジェクト/配列など          | 複雑なオブジェクト・ネストされた構造      |
| 返り値        | `.value` プロパティに値が格納される          | そのままオブジェクトとしてアクセス       |
| ラップ対象      | 任意の値（number, string, object など） | オブジェクト・配列               |
| リアクティブ追跡方法 | `RefImpl` でラップ                  | `Proxy` によるオブジェクトトラップ   |
| 主な使いどころ    | カウンター・フォーム入力など単一値               | 設定オブジェクト・フォーム全体・複数の状態保持 |

---

## ✅ 1. `ref` の基本と仕組み

```ts
import { ref } from 'vue'

const count = ref(0)

count.value++ // 必ず `.value` 経由
```

* `ref(0)` の内部は `RefImpl` インスタンスで `.value` にアクセス・更新される
* Vue のテンプレート内では `.value` を**自動アンラップ**するので記述不要

```vue
<template>
  <p>{{ count }}</p> <!-- .value 書かなくてOK -->
</template>
```

---

## ✅ 2. `reactive` の基本と仕組み

```ts
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: { name: 'Taro', age: 25 }
})

state.count++
state.user.name = 'Hanako'
```

* `Proxy` によってリアクティブなオブジェクトとして振る舞う
* `.value` は不要
* ネストされたプロパティも自動追跡される

---

## 🚧 注意点：ネスト構造 + `ref` の罠

```ts
const state = reactive({
  nested: ref(1)
})

console.log(state.nested)       // Ref オブジェクト
console.log(state.nested.value) // 値にアクセス
```

* `reactive` 内に `ref` を入れても**自動アンラップされない**
* `.nested.value` を常に意識する必要がある（非推奨パターン）

→ **解決策：Composition APIなら最初から `reactive` か `ref` に統一すべき**

---

## 🔁 双方向バインディング時の使い分け

| シチュエーション            | 推奨                         |
| ------------------- | -------------------------- |
| フォーム1項目（入力欄など）      | `ref<string>()`            |
| フォーム全体を1つのオブジェクトで扱う | `reactive({})`             |
| オブジェクトをリアクティブに渡したい  | `reactive(obj)`            |
| テンプレートにそのまま使いたい単一値  | `ref()`（テンプレートで自動アンラップされる） |

---

## 🧪 例：フォーム構造

### ✅ `ref` の場合（項目ごとに管理）

```ts
const name = ref('')
const age = ref(0)
```

### ✅ `reactive` の場合（まとめて管理）

```ts
const form = reactive({
  name: '',
  age: 0
})
```

---

## 🧠 裏側のしくみ（簡易）

* `ref` → `RefImpl<T>` に変換（`.value` 経由で getter/setter）
* `reactive` → `Proxy` に変換して Vue のリアクティブ追跡機構に渡す
* `watch`, `computed`, `effectScope` などもこれらを前提に動く

---

## 🔥 結論：どう使い分けるべきか

| 判断基準                 | 選択                   |
| -------------------- | -------------------- |
| 単一の値を扱う              | `ref`                |
| 多数の値をひとまとめにしたい       | `reactive`           |
| 状態を構造化しつつテンプレートで使いたい | `reactive`           |
| `.value` を意識したくない    | `reactive`（ただし注意が必要） |

---

必要に応じて、以下の章立てで `.md` ドキュメントに整理して提供できます：

* `ref` の使い方とメリット
* `reactive` の使い方と注意点
* 併用する場合の罠
* 実用的なフォーム構成例
* watch/computed との組み合わせ

ご希望であれば続けて「`ref` と `reactive` を `watch` で連動させる応用例」や「Vuex連携パターン」などもご案内できます。続けますか？

以下に、**`ref` と `reactive` を `watch` で連動させる応用例**を紹介します。Vue 3 + Composition API（`<script setup>` または `defineComponent`）を想定しています。

---

# 🔁 `ref` と `reactive` を `watch` で連動させる応用例

## 🎯 目的：

* `props` など外部から受け取った `ref` の変化に応じて `reactive` なオブジェクトの状態を更新
* またはその逆で、`reactive` な状態の一部を `ref` に抽出・同期

---

## 🧪 サンプルシナリオ：

* 親から `selectedId: number` を `ref` として受け取る
* 子では、`selectedId` の変化に応じて `reactive` な `selectedItem` を更新したい

---

## ✅ コード例（`<script setup>`）

```vue
<script setup lang="ts">
import { defineProps, ref, reactive, watch } from 'vue'

const props = defineProps<{ selectedId: number }>()

// ダミーデータ
const dataList = [
  { id: 1, name: 'りんご' },
  { id: 2, name: 'ばなな' },
  { id: 3, name: 'みかん' }
]

// 選択状態（reactiveで定義）
const selectedItem = reactive({
  id: 0,
  name: ''
})

// props.selectedId の変化を監視して selectedItem を更新
watch(
  () => props.selectedId,
  (newId) => {
    const found = dataList.find(item => item.id === newId)
    if (found) {
      selectedItem.id = found.id
      selectedItem.name = found.name
    }
  },
  { immediate: true }
)
</script>
```

---

### 🔄 補足：逆方向に `ref → reactive` を反映したい場合

例えば `selectedItem.name` の変更を外部に通知したいなら、`watch` で `emit()` する：

```ts
watch(
  () => selectedItem.name,
  (newName) => {
    emit('update:name', newName)
  }
)
```

---

## ✅ 別例：reactive から特定の値を ref に同期（抽出）

```ts
const form = reactive({
  name: 'John',
  age: 30
})

const nameRef = ref(form.name)

watch(
  () => form.name,
  (newVal) => {
    nameRef.value = newVal
  }
)
```

または双方向同期にするなら：

```ts
watch(nameRef, (val) => {
  form.name = val
})
```

---

## 📌 応用設計のまとめ

| 目的                      | パターン                          |
| ----------------------- | ----------------------------- |
| `ref` から `reactive` を更新 | watch(ref, → reactive書き換え)    |
| `reactive` から `ref` を抽出 | watch(reactive.prop, → ref更新) |
| 双方向同期                   | watch 2本で相互更新                 |
| リストから reactive に変換      | ID → オブジェクトを reactive に反映     |

---

## 🛠 よくある応用シーン

* **フォーム**で「選択されたID」に基づいて詳細項目を reactive で保持
* **セレクトボックス**と詳細入力画面の切り替え
* **親子コンポーネント間**で値だけ受け取って状態は独自で持ちたい

---

必要なら `.md` 用に章立てした「`ref` & `reactive` 連携実装ガイド」や、具体的な画面構成テンプレートとして整理できます。続きを作成しましょうか？
