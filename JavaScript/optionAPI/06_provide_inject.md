了解しました！Vue 3 + TypeScript + オプションAPI における **`provide / inject` の使い方** を、実用例とともに体系的に解説します。

---

## ✅ 6. `provide / inject` の役割

| 機能        | 説明                             |
| --------- | ------------------------------ |
| `provide` | 親コンポーネントから「グローバルに近い形で」データを供給する |
| `inject`  | 子・孫コンポーネントからそのデータを受け取る         |

### 🎯 ポイント

* **親 → 子 → 孫**の階層構造で、**propsを介さずにデータを渡したいときに便利**
* Vuexを使うほどではないが、**共通設定や定数などを渡したい場合**に適している

---

## ✅ サンプル構成

* `App.vue`: provideでデータを提供（例：`theme`）
* `Child.vue`: injectで `theme` を参照して表示を変える

---

## ✅ App.vue（親・提供側）

```vue
<script lang="ts">
import { defineComponent } from 'vue'
import Child from './components/Child.vue'

export default defineComponent({
  name: 'App',
  components: { Child },

  provide() {
    return {
      /**
       * @provide theme
       * @description 全体のテーマカラー
       */
      theme: 'dark'
    }
  }
})
</script>

<template>
  <div>
    <h1>App</h1>
    <Child />
  </div>
</template>
```

---

## ✅ Child.vue（子・受取側）

```vue
<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'Child',

  /**
   * @inject theme
   * @type {string | undefined}
   * @description 親から受け取るテーマ設定（存在しない場合はundefined）
   */
  inject: ['theme'],

  data() {
    return {
      localColor: ''
    }
  },

  mounted() {
    console.log('親から受け取ったテーマ:', this.theme)
    this.localColor = this.theme === 'dark' ? '#222' : '#fff'
  }
})
</script>

<template>
  <div :style="{ backgroundColor: localColor, color: '#fff', padding: '10px' }">
    子コンポーネント（テーマ: {{ theme }}）
  </div>
</template>
```

---

## ✅ TypeScript型安全に受け取りたい場合

injectを以下のように型付きで定義できます：

```ts
inject: {
  theme: {
    from: 'theme',
    default: 'light' // injectが見つからない場合
  }
}
```

---

## ✅ よく使うユースケース

| ユースケース              | 説明                             |
| ------------------- | ------------------------------ |
| ローカライズ設定（言語）        | `provide: { locale: 'ja' }`    |
| ユーザー情報共有            | `provide: { userInfo: {...} }` |
| 非表示フラグなどの制御変数       | `provide: { hideHelp: true }`  |
| 複数タブやフォーム全体で共通化したい値 | injectで子から参照可能                 |

---

## ✅ `props` との使い分け

| 比較項目          | props     | provide/inject  |
| ------------- | --------- | --------------- |
| 明示的な受け渡し      | ✅ 必須      | ❌（暗黙的）          |
| 子コンポーネントが親に依存 | ❌ 明確な責務分離 | ✅ 結合度が高くなる可能性あり |
| 深いネストでも渡せる    | ❌ 面倒      | ✅ 可能（親→孫までOK）   |

---

## ✅ まとめ

| 機能          | 使用目的                  |
| ----------- | --------------------- |
| `provide()` | 親からデータを「提供」する         |
| `inject`    | 子からそのデータを「受け取る」       |
| 適用範囲        | propsの代わりに深い階層で共有したい値 |

---

ご希望であれば次もご案内できます：

* ✅ `provide/inject` を使った「モーダル表示制御」パターン
* ✅ 型付き inject（TypeScript + injectの安全な書き方）
* ✅ `reactive` な provide（値をリアクティブに保ちたい場合）

どれを見てみたいですか？
