了解しました！Vue 3 + TypeScript + オプションAPI（`defineComponent`）構成での **Vuexとの連携** について、**基礎から実践パターンまで**を体系的に解説します。

---

## ✅ 7. Vuexとの連携（オプションAPI）

### 🎯 オプションAPIでは、`mapState` / `mapGetters` / `mapMutations` / `mapActions` を使うのが基本です。

---

## 🧱 基本構造の例

```ts
import { mapState, mapMutations } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState('userModule', ['userName', 'userEmail'])
  },

  methods: {
    ...mapMutations('userModule', ['setUserName', 'setUserEmail'])
  }
})
```

---

## ✅ よく使う4つの連携メソッド

| 種別             | 目的       | 構文例（モジュールあり）                    |
| -------------- | -------- | ------------------------------- |
| `mapState`     | stateの取得 | `mapState('mod', ['xxx'])`      |
| `mapGetters`   | 派生値取得    | `mapGetters('mod', ['xxx'])`    |
| `mapMutations` | 値の更新     | `mapMutations('mod', ['setX'])` |
| `mapActions`   | 非同期処理    | `mapActions('mod', ['fetchX'])` |

---

## ✅ Vuexモジュールのサンプル（userModule.ts）

```ts
// store/modules/userModule.ts

export const userModule = {
  namespaced: true,

  state: () => ({
    userName: '',
    userEmail: ''
  }),

  mutations: {
    setUserName(state, name: string) {
      state.userName = name
    },
    setUserEmail(state, email: string) {
      state.userEmail = email
    }
  },

  actions: {
    async fetchUser({ commit }) {
      const res = await fetch('/api/user')
      const data = await res.json()
      commit('setUserName', data.name)
      commit('setUserEmail', data.email)
    }
  },

  getters: {
    userSummary(state) {
      return `${state.userName} <${state.userEmail}>`
    }
  }
}
```

---

## ✅ コンポーネント連携例

```ts
import { defineComponent } from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default defineComponent({
  name: 'UserProfile',

  computed: {
    ...mapState('userModule', ['userName', 'userEmail']),
    ...mapGetters('userModule', ['userSummary'])
  },

  methods: {
    ...mapMutations('userModule', ['setUserName', 'setUserEmail']),
    ...mapActions('userModule', ['fetchUser'])
  },

  mounted() {
    this.fetchUser()
  }
})
```

---

## ✅ JSDocコメント付きテンプレート

```ts
/**
 * @vuexState userName - ユーザー名
 * @vuexGetter userSummary - ユーザー情報の整形表示
 * @vuexMutation setUserName - ユーザー名の更新
 * @vuexAction fetchUser - ユーザー情報の取得
 */
```

---

## ✅ よくある応用パターン

| パターン                      | 解説                                                  |
| ------------------------- | --------------------------------------------------- |
| `v-model` と Vuex を連携      | `v-model="userName"` → `computed: get/set` でVuexと同期 |
| フォームの一時編集 → 保存ボタンでVuexに反映 | `data()` でローカルに保持し `setX` でコミット                     |
| 一括読み込み                    | `mounted()` で `dispatch('fetchX')` 呼び出し             |

---

## ✅ 注意点（TypeScript + オプションAPI）

| 注意点                          | 解説                                       |
| ---------------------------- | ---------------------------------------- |
| `mapState` は this の型推論が弱い    | 必要に応じて補完用の interface を定義する               |
| modules を使うと namespace 指定が必要 | `mapState('userModule', [...])` のように書くこと |

---

## ✅ まとめ

| 目的     | 使用関数                                           |
| ------ | ---------------------------------------------- |
| 状態を読む  | `mapState` / `mapGetters`                      |
| 状態を変える | `mapMutations` / `mapActions`                  |
| 初期取得   | `mounted() { this.fetchX() }`                  |
| 型安全強化  | TypeScript + interface or Composition API 移行検討 |

---

次に知りたい内容は：

* ✅ `v-model` と Vuex を連携する「双方向バインディング」パターン
* ✅ `Vuex` を inject 的に使う `useStore()` との比較
* ✅ store modules の型付け強化（TypeScript対応）

どこを深掘りしましょうか？

了解しました！
ここでは Vue 3 + TypeScript + オプションAPI における、**`v-model` と Vuex を連携させた「双方向バインディング」パターン**を、以下の構成で解説します。

---

## ✅ ゴール

* `v-model="userName"` で **Vuexのstateと同期**
* `v-text-field` などの入力値を変更すると Vuex の値も自動で更新される
* **オプションAPI (`defineComponent`) を使用**

---

## 🧱 構成概要

| 操作                | Vueでの実装                                                 |
| ----------------- | ------------------------------------------------------- |
| Vuexのstateを読みたい   | `mapState` または `this.$store.state.xxx`                  |
| Vuexのstateを書き換えたい | `mapMutations` + `v-model` で `computed` に `get/set` を定義 |

---

## ✅ 実装ステップ

### ① Vuexモジュールの定義

```ts
// store/modules/userModule.ts
export const userModule = {
  namespaced: true,
  state: () => ({
    userName: ''
  }),
  mutations: {
    setUserName(state, name: string) {
      state.userName = name
    }
  }
}
```

---

### ② コンポーネントで `v-model` ⇄ Vuex連携

```vue
<template>
  <!-- 双方向バインディング：Vuexと同期 -->
  <v-text-field v-model="userName" label="ユーザー名を入力" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'UserInput',

  computed: {
    /**
     * @computed userName
     * @description v-model対応。Vuexのstateと同期するgetter/setter
     */
    userName: {
      get(): string {
        return this.$store.state.userModule.userName
      },
      set(val: string) {
        this.$store.commit('userModule/setUserName', val)
      }
    }
  }
})
</script>
```

---

## ✅ 解説

| 項目                   | 説明                                            |
| -------------------- | --------------------------------------------- |
| `v-model="userName"` | フィールドの入力を `userName` にバインド                    |
| `computed.userName`  | Vuexの `state.userModule.userName` を読み書きするプロキシ |
| `set()`              | 入力変更時に `commit()` を呼び出すことで Vuex を更新           |

---

## ✅ JSDoc コメント例

```ts
/**
 * @computed userName
 * @returns {string} Vuexストアから取得されるユーザー名
 * @description v-modelと双方向バインドされるプロキシ
 */
```

---

## ✅ よくある応用パターン

| パターン                     | 内容                                    |
| ------------------------ | ------------------------------------- |
| 複数の `v-model` を Vuex に同期 | 各 `computed` に対して個別に `get/set` を定義    |
| `v-model.lazy` 対応        | イベントを `change` にして反応を遅らせる（要Vuetify設定） |
| 中間で加工したい                 | `get/set` 内で `trim()` など処理可能          |

---

## ✅ まとめ

| 目的                       | 実装方法                        |
| ------------------------ | --------------------------- |
| Vuexとv-modelを双方向同期       | `computed` に `get/set` を定義  |
| Vuexから直接 `v-model` に繋げたい | `computed` 経由で連携            |
| オプションAPIでも可能？            | ✅ 完全対応（Composition APIでも可能） |

---

## ✋ 補足：Composition APIでの対応（参考）

```ts
const store = useStore()
const userName = computed({
  get: () => store.state.userModule.userName,
  set: (val) => store.commit('userModule/setUserName', val)
})
```

---

次に進めるなら：

* ✅ 複数項目のv-model + Vuex同期のテンプレート
* ✅ フォーム全体を Vuex で一元管理する構成
* ✅ 型安全な Vuex ストア + v-model の構築方法

どこを深掘りしましょうか？
