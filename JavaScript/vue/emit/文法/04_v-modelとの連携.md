了解しました。Vue 3 + TypeScript + defineComponent をベースに、`v-model` と `emit` の連携パターンについて調査します。

具体的には、`modelValue` / `update:modelValue` の連動設計、`computed({ get, set })` を使ったバインディング、`v-model:xxx` による複数バインディング（フォーム入力 + チェックボックス例）、および双方向バインディングを制御・制限する設計パターンについて、実例コード付きで体系的に整理します。しばらくお待ちください。


# Vue 3 + TypeScript の `v-model` と `emit`：実装パターン

## 1. `modelValue` / `update:modelValue` の基本構文と動作

Vue 3 ではコンポーネントの **v-model** が `modelValue` プロパティと `update:modelValue` イベントを使う方式に変更されました。親コンポーネントで `<Child v-model="foo" />` と書くと、内部的には `:modelValue="foo"` と `@update:modelValue="foo = $event"` が自動展開されます。子コンポーネント側では、`defineComponent` を使って次のように `props` と `emits` を定義します:

```ts
export default defineComponent({
  props: {
    modelValue: { type: String as PropType<string>, required: true }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    function onInput(value: string) {
      emit('update:modelValue', value); // 親に新しい値を通知
    }
    return { onInput };
  }
});
```

上記の例では、`props.modelValue` が文字列型として型推論されており、IDE の補完が有効です。テンプレートでは `<input :value="modelValue" @input="onInput($event.target.value)" />` のように書いて、親から渡された値を表示しつつ、変更時に `update:modelValue` を発行します。親側では `<Child v-model="data" />` とするだけで双方向バインディングが実現します。

## 2. `computed` を用いた双方向バインディング

子コンポーネント内で `props` を直接変更することはできない（**props は読み取り専用**）ため、`v-model` をそのまま使うとエラーになります。そこで、読み取り専用の `props.modelValue` を包み込む書き込み可能な `computed` プロパティを作成し、`get` では `props.modelValue` を返し、`set` で `emit('update:modelValue', value)` を呼び出すパターンがよく使われます。例えば次のようになります:

```ts
export default defineComponent({
  props: { modelValue: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<string>({
      get: () => props.modelValue as string,
      set: (v: string) => emit('update:modelValue', v)
    });
    return { value };
  }
});
```

この例では、`value` が子コンポーネント内の双方向バインド対象となり、テンプレートで `<input v-model="value" />` と書くだけで、ユーザー入力時に自動的に `update:modelValue` が発行されます。`computed` を使うことで、内部的に親子間の値同期を維持しつつ、`props` の読み取り専用制約を回避できます。

## 3. `v-model:xxx` を使った複数バインディング

Vue 3 では複数の `v-model` 引数が使えるようになり、1 コンポーネント内で異なるプロパティとイベントで複数の双方向バインディングを定義できます。たとえば、親側で `<MyForm v-model:text="text" v-model:checked="checked" />` と書けば、子コンポーネントでは `text` プロパティと `checked` プロパティを受け取り、それぞれ `update:text` イベントと `update:checked` イベントを発行する必要があります。定義例は次の通りです:

```ts
export default defineComponent({
  props: {
    text: { type: String as PropType<string>, default: '' },
    checked: { type: Boolean as PropType<boolean>, default: false }
  },
  emits: ['update:text', 'update:checked'],
  setup(props, { emit }) {
    const onText = (e: Event) => emit('update:text', (e.target as HTMLInputElement).value);
    const onCheck = (e: Event) => emit('update:checked', (e.target as HTMLInputElement).checked);
    return { onText, onCheck };
  }
});
```

このようにすれば、テキスト入力（`text`）とチェックボックス（`checked`）を個別に双方向バインドでき、フォームデータの各フィールドを独立して管理する実用的なユースケースが実現できます。親コンポーネントでは `<MyForm v-model:text="form.text" v-model:checked="form.checked" />` のように書くだけで、子コンポーネント側で値の受け渡しが行われます。

## 4. 双方向バインディングの制御・制限

`props` は一方向バインドであるため、子側が直接変更できず読み取り専用です。子コンポーネントで `readonly` や `disabled` といった状態を管理する場合は、emit の発行自体を制御する設計が有効です。たとえば、子側で以下のように `readonly` プロパティを追加すると、`readonly: true` のときには `update:modelValue` を発行しない設計が可能です:

```ts
export default defineComponent({
  props: {
    modelValue: String,
    readonly: { type: Boolean as PropType<boolean>, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = computed<string>({
      get: () => props.modelValue as string,
      set: (v: string) => {
        if (!props.readonly) {
          emit('update:modelValue', v);
        }
      }
    });
    return { value };
  }
});
```

この例では、`readonly` が `true` のときは setter 内で `emit` をスキップします。同時にテンプレート側で `<input :disabled="readonly" />` とすれば、入力自体も防止できます。結果的に `readonly` 状態では子から親への更新が止まり、一方向バインドに近い動作になります。以上のように、子コンポーネントでの状態フラグを用いることで、必要に応じて双方向バインディングを制御・制限できます。

**参考資料:** Vue 公式ドキュメントおよび TypeScript 公式ガイドなど。
