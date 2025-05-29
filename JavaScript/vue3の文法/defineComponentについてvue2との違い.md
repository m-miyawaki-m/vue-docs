以下に **Vue 3 における旧式（`defineComponent({})`）と新しい `<script setup>` スタイル**の比較表を作成しました。TypeScript を前提とし、実務でもよく使う観点で整理しています。

---

## 🔄 Vue 3: 旧式 vs `<script setup>` 比較表

| 機能             | 旧式 `defineComponent({})` スタイル                      | 新スタイル `<script setup lang="ts">`                                                |
| -------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| **記述場所**       | `export default defineComponent({ ... })`          | `<script setup lang="ts">` 内に直接記述                                               |
| **data**       | `data() { return { count: 0 } }`                   | `const count = ref(0)`                                                          |
| **methods**    | `methods: { increment() { this.count++ } }`        | `const increment = () => { count.value++ }`                                     |
| **computed**   | `computed: { double() { return this.count * 2 } }` | `const double = computed(() => count.value * 2)`                                |
| **props**      | `props: { msg: String }`                           | `const props = defineProps<{ msg: string }>()`                                  |
| **emit**       | `emits: ['update']` + `this.$emit('update', val)`  | `const emit = defineEmits<{'update': [val: number]}>()` + `emit('update', val)` |
| **ライフサイクル**    | `mounted() { ... }`                                | `onMounted(() => { ... })`                                                      |
| **テンプレートとの接続** | `this.count`, `this.increment()` でアクセス             | 直接 `count`, `increment` として使える                                                  |
| **型推論**        | 明示的に `this` の型を定義する必要がある（やや複雑）                     | 自動で型推論される（TypeScriptと相性◎）                                                       |
| **読みやすさ・簡潔さ**  | やや冗長（繰り返し構造が多い）                                    | シンプル・直感的（コード量が少ない）                                                              |
| **再利用性**       | コンポジションAPIとの併用が前提（setup関数内に共通ロジックを書く）              | 最初からComposition APIベース、共通ロジックはComposableとして分離可能                                 |

---

## 📌 実例比較

### ◾ 旧式スタイル

```ts
export default defineComponent({
  data() {
    return {
      count: 0
    }
  },
  computed: {
    double() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

### ◾ `<script setup>` スタイル

```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
const increment = () => {
  count.value++
}
</script>
```

---

### ✅ 結論

| 観点             | おすすめ                             |
| -------------- | -------------------------------- |
| **小規模・個人開発**   | `<script setup>` ✅               |
| **型安全・保守性**    | `<script setup>` ✅               |
| **Vue 2 との互換** | `defineComponent({})` （やむを得ない場合） |

今後の開発では `<script setup>` が公式に推奨されており、TypeScriptとの親和性も高いため、新規開発はこれ一択です。必要であれば、**Vuex や composables の組み込み例も比較付きで提示可能**です。


「再利用性」という観点での比較において、

* 旧スタイル（`defineComponent({ setup() { ... } })`）と
* 新スタイル（`<script setup>`）

どちらも **Composition API** を活用できますが、**再利用のしやすさ**と**構造の明快さ**において `<script setup>` の方が圧倒的に有利です。

---

## 🔁 再利用性の違いを詳細解説

| 観点                      | 旧スタイル `defineComponent({ setup() { ... } })` | 新スタイル `<script setup>`                        |
| ----------------------- | -------------------------------------------- | --------------------------------------------- |
| **Composition API の導入** | 明示的に `setup()` を書く必要がある                      | `<script setup>` 自体が Composition API の構文      |
| **共通ロジックの切り出し**         | `setup()` 内で `useXxx()` のように呼び出して使う必要あり      | 同様に使えるが、**importと同じ感覚で直感的に扱える**               |
| **コードのネスト構造**           | `setup()` 関数の中で関数、変数、ロジックがすべて閉じてしまう          | `setup` ブロックが不要な分、**フラットで読みやすい構造**            |
| **型の明示性**               | `setup()` の引数、`return` の型定義が必要な場合がある         | 自動で型推論されることが多く、**TypeScript対応がスムーズ**          |
| **Composable の使い方**     | 必ず `setup()` の中で呼び出す                         | そのまま import & 実行（`const { a } = useXxx()`）でOK |

---

## 🎓 具体例：共通ロジックを Composable に分離

### ◾ `useCounter.ts`（共通ロジック）

```ts
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  const double = computed(() => count.value * 2)

  return {
    count,
    increment,
    double
  }
}
```

---

### ◾ 旧スタイルで再利用する場合

```ts
export default defineComponent({
  setup() {
    const { count, increment, double } = useCounter()

    return { count, increment, double }
  }
})
```

---

### ◾ `<script setup>` で再利用する場合

```ts
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, increment, double } = useCounter()
</script>
```

**📌 違いのポイント：**

* `setup()` の return が不要
* `useCounter()` の呼び出しがより自然（トップレベルで完結）
* 変数のスコープが `template` でもそのまま使える

---

## ✅ 再利用に `<script setup>` を使うべき理由

| 理由                       | 説明                                                     |
| ------------------------ | ------------------------------------------------------ |
| **コードの簡潔化**              | `setup()` が不要で、直感的に変数・関数を使える                           |
| **Composable 呼び出しのしやすさ** | import → 呼び出しだけで済む。`return` を意識しなくてよい                  |
| **コード分割しやすい**            | ロジックは `composables/` に集約、コンポーネントは UI に集中できる            |
| **型推論・補完が優秀**            | `ref`, `computed`, `defineProps` などがIDEで即補完・エラー検知されやすい |

---

### 🔚 結論

* **Composition APIを活かした再利用**はどちらの記法でも可能。
* しかし、**実際に再利用しやすく、保守しやすいのは `<script setup>`**。
* 特に **「共通ロジック → Composableに切り出し」→「簡潔に呼び出す」** という流れは、Vue 3 の開発で最も実用的かつ推奨されるスタイルです。

---

必要であれば `useApiFetcher`, `useFormValidator` など実用的な composable の例も提示できます。ご希望あればお知らせください。

はい、**Vue 3 では `defineComponent({})` と `<script setup>` を** **併用することは**以下の理由により**できません（構文レベルで排他）**：

---

## ❌ `<script setup>` と `defineComponent({})` の**直接併用は不可**

```vue
<!-- ❌ 次のような併用は不可能です -->
<script setup lang="ts">
  const msg = 'Hello'
</script>

<script lang="ts">
export default defineComponent({
  // 同じファイル内で定義しようとするとエラー
})
</script>
```

Vue は「`<script setup>` がある場合は、それがコンポーネントのロジック定義すべてを担う」と解釈します。そのため **`defineComponent({})` を併用する構文自体がサポートされていません**。

---

## ✅ ただし**併用的に使う方法は存在します**

### 1. **一部コンポーネントだけ旧構文にする**

大規模プロジェクトで段階的に移行する際などは：

* 一部コンポーネントは `<script setup>`
* 他のコンポーネントは `defineComponent({})`

```ts
// 旧構文コンポーネント
export default defineComponent({
  props: { ... },
  setup() { ... }
})
```

```ts
// 新構文コンポーネント
<script setup lang="ts">
const props = defineProps<{ name: string }>()
</script>
```

**→ 共存はOK。ただし同一ファイルではNG**。

---

### 2. **Composableで切り出した共通ロジックは両方で使える**

共通ロジックは以下のようにどちらのスタイルでも再利用可能です：

```ts
// composables/useMessage.ts
export function useMessage() {
  const msg = ref('Hello')
  return { msg }
}
```

#### ◾ `<script setup>` から呼ぶ：

```ts
<script setup lang="ts">
import { useMessage } from '@/composables/useMessage'
const { msg } = useMessage()
</script>
```

#### ◾ `defineComponent({})` から呼ぶ：

```ts
export default defineComponent({
  setup() {
    const { msg } = useMessage()
    return { msg }
  }
})
```

---

## ✅ 結論：**「使い分け」は可能、でも「併用（同一ファイル内）」は不可**

| 方法                                                  | 可否 | 備考                              |
| --------------------------------------------------- | -- | ------------------------------- |
| `<script setup>` + `defineComponent({})` を同じファイルで書く | ❌  | Vue の構文上禁止                      |
| プロジェクト内で別々のファイルとして使い分ける                             | ✅  | 段階的移行・レガシーとの共存に対応               |
| 共通ロジック（Composable）を両方で使う                            | ✅  | 再利用性を高める正攻法（`useXxx()` 形式で呼び出し） |

---

Vue 3 プロジェクトで全体的に統一するなら、**今後は `<script setup>` への統一を強く推奨**します（公式も同様の立場です）。

ご希望であれば、旧構文 → `<script setup>` への移行手順チェックリストも作成できます。必要ですか？


非常に良い着眼点です。
結論から言うと：

---

### ✅ **結論：プロジェクト内に書き方が混在しても問題ないが、**

**開発チームの方針として「どちらを標準にするか」は統一した方がよいです。**

---

## 🔍 詳細解説

### ◾ 1. `defineComponent({})` と `<script setup>` の共存は技術的に問題なし

* **Vue 3 は両方の記法に対応**しています。
* したがって、**MainLayout だけが旧構文（defineComponent）でも、他のコンポーネントは `<script setup>` を使っても動作上は問題ありません。**

> 実際、多くの移行中プロジェクトやライブラリでも「混在」しています。

---

### ◾ 2. なぜ MainLayout を旧構文にしているのか？（例）

* `provide/inject` のような**高度なロジック**
* `this` を明示的に使う必要がある状況（class系）
* 旧来のコード資産をベースにしている

これらが理由で `defineComponent({})` を選んでいるなら、**他の画面側は `<script setup>` にして問題ありません。**

---

### ◾ 3. ただし「混在」が招く課題

| 課題例                | 内容                               |
| ------------------ | -------------------------------- |
| **学習コスト**          | 新人が両方の書き方を学ぶ必要がある                |
| **コードレビューで迷いが生じる** | 「なぜこの画面は旧構文？統一しないの？」という議論が発生しやすい |
| **リファクタリングの難易度**   | 全体で統一していないと、変更時に混乱や不整合が起きやすい     |

---

### ◾ 4. 最適な方針案（おすすめ）

| 状況                               | 方針                                     |
| -------------------------------- | -------------------------------------- |
| プロジェクトが新規 or 小規模                 | **原則すべて `<script setup>` に統一する（公式推奨）** |
| 既存資産に `defineComponent` が多く残っている | 徐々に `<script setup>` に移行していくが、混在OK     |
| 特定のコンポーネントのみ `this` が必要などで旧構文    | その部分のみ旧構文を許容し、他は `<script setup>`      |

---

## ✅ 判断の基準

* \*\*「今後メンテする人がどちらを楽に理解・保守できるか」\*\*を軸に考えるとよいです。
* `<script setup>` は少人数・短期間のプロジェクト、またはモダン構成に非常に向いています。

---

### 🔧 おまけ：混在時のプロジェクト構成例

```
src/
├── components/
│   ├── MainLayout.vue     // defineComponent 使用
│   ├── Header.vue         // <script setup> 使用
│   └── Footer.vue         // <script setup> 使用
├── pages/
│   └── HomePage.vue       // <script setup> 使用
```

---

ご希望であれば、「MainLayout の旧構文を `<script setup>` に書き直す手順」も提示できます。
もしくは「両者の混在ルール（命名・フォルダ方針など）」を策定してもOKです。どちらを進めますか？
