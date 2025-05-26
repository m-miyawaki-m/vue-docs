以下に、Vue 3 + TypeScript + Vuex での **Vuex連携パターン**を `defineComponent` を使ったスタイルに修正したバージョンを提示します。`<script setup>` ではなく、**明示的に `defineComponent({...})` を使う形式**です。

---

# 📦 Vuex連携パターン（`defineComponent`版）

---

## ✅ 1. Vuexの状態を `computed` で参照（One-way Binding）

```ts
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'DialogToggle',
  setup() {
    const store = useStore()

    const isOpen = computed(() => store.state.uiControl.dialogOpen)

    const toggleDialog = () => {
      store.commit('uiControl/toggleDialog')
    }

    return {
      isOpen,
      toggleDialog
    }
  }
})
</script>
```

---

## ✅ 2. `ref` と Vuex を `watch` で同期（Two-way連携）

```ts
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'IdSelector',
  setup() {
    const store = useStore()
    const selectedId = ref(store.state.uiControl.selectedId)

    watch(selectedId, (val) => {
      store.commit('uiControl/setSelectedId', val)
    })

    watch(
      () => store.state.uiControl.selectedId,
      (val) => {
        selectedId.value = val
      }
    )

    return { selectedId }
  }
})
</script>
```

---

## ✅ 3. 双方向バインディング：`v-model` を `computed({ get, set })` で実現

```ts
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'DialogSwitch',
  setup() {
    const store = useStore()

    const dialogOpen = computed({
      get: () => store.state.uiControl.dialogOpen,
      set: (val: boolean) => {
        if (val !== store.state.uiControl.dialogOpen) {
          store.commit('uiControl/toggleDialog')
        }
      }
    })

    return { dialogOpen }
  }
})
</script>
```

---

## ✅ 4. `reactive` なフォームオブジェクトと Vuex の同期

```ts
<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'FormSync',
  setup() {
    const store = useStore()

    const form = reactive({
      selectedId: store.state.uiControl.selectedId
    })

    watch(
      () => form.selectedId,
      (val) => {
        store.commit('uiControl/setSelectedId', val)
      }
    )

    watch(
      () => store.state.uiControl.selectedId,
      (val) => {
        form.selectedId = val
      }
    )

    return { form }
  }
})
</script>
```

---

## 📌 補足とベストプラクティス

| ポイント                     | 内容                        |
| ------------------------ | ------------------------- |
| `ref` + `watch`          | 単一値の同期に便利                 |
| `reactive` + `watch`     | オブジェクト状態の保持と同期に向く         |
| `computed({ get, set })` | v-model 用（双方向に必要な場合のみ）    |
| 状態変更は mutation 経由        | `commit()` を通じて状態管理を一元化する |

---

このスタイルをベースに「社員一覧画面」「ダイアログ」「フォーム」など、画面ごとの Vuex 連携テンプレートとして展開も可能です。続けて特定の画面向けにカスタマイズしてみましょうか？
