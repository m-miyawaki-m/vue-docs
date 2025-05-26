`defineComponent` + `watch` を使って、**受け取った props の値と内部の `const` または `ref` による状態をリアクティブに同期・監視**する方法について、以下のように整理できます。

---

## 🎯 目的：

`props.xxx` が変化したとき、内部の `const`（実際には `ref`）に自動で反映されるようにする（リアクティブ連携）。

---

## ✅ パターン：`defineComponent` 内で `watch` を使って props を内部状態と同期

### 🔽 例：props で受け取った値を `ref` に取り込み、watch で反映

```ts
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    count: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    // 内部状態を定義（初期値として props.count を使用）
    const internalCount = ref(props.count)

    // props.count の変化を監視して internalCount を更新
    watch(
      () => props.count,
      (newVal) => {
        internalCount.value = newVal
      }
    )

    return {
      internalCount
    }
  }
})
</script>
```

---

## ✅ Composition API（`<script setup>`）版

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ count: number }>()
const internalCount = ref(props.count)

watch(
  () => props.count,
  (newVal) => {
    internalCount.value = newVal
  }
)
</script>
```

---

## 🧠 解説ポイント

| 項目                           | 説明                                 |
| ---------------------------- | ---------------------------------- |
| `ref(props.xxx)` だけでは同期されない  | 初期値だけ取り込み、以後は props の更新を追従しない      |
| `watch(() => props.xxx)` が必要 | 外部からの変更を内部にも反映するため                 |
| 双方向にしたいなら emit と組み合わせる       | 例：`update:modelValue` を emit で通知する |

---

## 🧪 応用：内部変更時も外部に通知したい（双方向）

```ts
watch(internalCount, (val) => {
  emit('update:count', val)
})
```

これで「外 → 中 → 外」の双方向同期ができます。

---

## 📘 よくある用途

* フォーム初期値と props の値を同期させたい
* 編集用フォームで親の値を受け取るが、内部状態として独立させたい
* モーダル開閉やフィルタ条件などの受け渡し・反映

---

必要であれば、この使い方を `.md` にまとめて「watchによるprops同期テンプレート集」として保存できます。具体的な画面例での適用パターンもご案内できますが、希望ありますか？
