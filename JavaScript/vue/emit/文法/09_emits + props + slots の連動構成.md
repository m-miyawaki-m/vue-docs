了解しました。Vue 3 + TypeScript + defineComponent をベースに、データテーブルを例として、emits + props + slots を連動させたカスタマイズ設計パターンについて調査します。

具体的には、親主導で UI を拡張可能にするスロット + emit の構成、slot-scope を使った子→親通知、props → slots → emits の流れで設計を柔軟にする高度なアーキテクチャを、実例付きで整理してお届けします。しばらくお待ちください。


# Vue 3 データテーブルの拡張設計

Vue 3 では、**props**・**slots**・**emit** を組み合わせることで、親コンポーネントからテーブル表示内容を柔軟にカスタマイズできます。たとえば親がテーブル列のテンプレートやアクションボタンを提供し、子コンポーネントは **emit** で親にイベント通知する設計が可能です。Vue のスロット機能は、親が子コンポーネントにテンプレートやロジックを差し込む仕組みで、柔軟なコンポーネント設計を支えます。また、Vue 3 では `defineComponent` を使って TypeScript 型付きでコンポーネントを定義でき、`props` や `emits` オプションで入力・出力の型を明示できます。

## 1. スロット + emits によるカスタマイズ設計

* **親による列テンプレートやボタンの提供**：子コンポーネント側で `<slot>` を配置し、親は `<template #slotName>` で任意のコンテンツを挿入します。たとえば、列ごとにスコープ付きスロット（`<slot name="列キー" :row="row">`）を用意すれば、親は特定列の描画方法を提供できます。親のテンプレート内で `v-slot`（Vue3では `#slotName`）を使い、`{ row }` のように行データを受け取って表示できます。

* **スコープ付きスロットでイベントを子→親に通知**：スロット内でボタンなどを設置してクリック時にイベントを飛ばしたい場合、注意点があります。**スロットは親のスコープでコンパイルされる**ため、スロット内で `$emit` を直接使うと親コンポーネント自身にのみ届いてしまい、子コンポーネントのイベントにはなりません。これを解決するには、子側の `<slot>` に関数を渡して**子のメソッドを呼べるようにする**方法があります。例えば、子コンポーネント（テーブル）がスコープ付きスロットで `:onEdit="() => emit('edit', row)"` のように渡し、親はスロットスコープから `onEdit` を受け取って呼び出します。この方式ならボタンのクリックで子から親にイベント通知が可能になります。以下に概念例を示します。

```vue
<!-- DataTable.vue（子コンポーネント） -->
<template>
  <table>
    <!-- ヘッダーやデータ行描画中 -->
    <tr v-for="row in props.data" :key="row.id">
      <!-- 他列セル... -->
      <td>
        <!-- actions スロットを定義し、rowとイベント関数を渡す -->
        <slot name="actions"
              :row="row"
              :onEdit="() => emit('edit', row)"
              :onDelete="() => emit('delete', row)">
          <!-- スロット未提供時のデフォルト内容 -->
          <button @click="() => emit('edit', row)">編集</button>
          <button @click="() => emit('delete', row)">削除</button>
        </slot>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'DataTable',
  props: {
    data: { type: Array as PropType<Record<string, any>[]>, required: true }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    return { emit };
  }
});
</script>
```

親コンポーネントでは、スロットスコープから渡された `onEdit` / `onDelete` を使ってクリックイベントを子に伝える例です：

```vue
<!-- ParentComponent.vue -->
<template>
  <DataTable :data="users" @edit="onEdit" @delete="onDelete">
    <template #actions="{ row, onEdit, onDelete }">
      <!-- row には行データ、onEdit/onDelete は子コンポーネントの emit 呼び出し関数 -->
      <button @click="onEdit()">編集</button>
      <button @click="onDelete()">削除</button>
    </template>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataTable from './DataTable.vue';

export default defineComponent({
  components: { DataTable },
  data() {
    return { users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] };
  },
  methods: {
    onEdit(row: any) { console.log('編集:', row); },
    onDelete(row: any) { console.log('削除:', row); }
  }
});
</script>
```

このように、子コンポーネント側で `<slot>` を使って親からテンプレートを差し込みつつ、関数をスロットプロパティとして渡すことで、**スロットコンテンツ内から子→親へのイベント通知**を実現できます。

## 2. props → slots → emits の連携設計

* **Props 経由でテーブル設定・データを受け取り**：コンポーネントは `props` で列定義（フィールド情報）や行データ、ページネーション設定などを受け取り、型を明示します。Vue 公式ドキュメントでは `defineComponent` 内で `props` を `PropType` とともに定義する例が示されています。たとえば列定義用の型やページ設定用の型を用意し、`props` オプションで定義すると型安全に扱えます。

* **デフォルトレンダリングとスロット差し替え**：受け取った `props` に基づいてデフォルトのテーブルUIを描画しつつ、親が必要に応じて一部をスロットで差し替えられる設計にします。たとえば、列ヘッダーやセルを `<slot>` で包み、名前付きスロットを用意します。下記は動的スロット名を使った例で、`fields` 配列のキーごとに `<slot>` を配置し、親は `#head(列キー)` や `#cell(列キー)` で内容をカスタマイズできます。

  ```vue
  <template>
    <table>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.key">
            <!-- ヘッダーセルをスロット化 -->
            <slot :name="`head(${field.key})`" :field="field">
              {{ field.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-for="field in fields" :key="field.key">
            <!-- セル内容をスロット化 -->
            <slot :name="`cell(${field.key})`" :item="item" :value="item[field.key]">
              {{ item[field.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  ```

  親は例えば以下のように動的スロット名で列をカスタマイズできます：

  ```vue
  <DataTable :fields="cols" :items="data">
    <template #head(name)="{ field }">
      <!-- 'name'列のヘッダーをカスタマイズ -->
      <span class="text-blue">{{ field.label }}</span>
    </template>
    <template #cell(name)="{ value }">
      <!-- 'name'列のセルをカスタマイズ -->
      <strong>{{ value }}</strong>
    </template>
  </DataTable>
  ```

  このように動的なスロット名（例：`head(key)`, `cell(key)`）を使うと、列ごとのテンプレートを柔軟に差し替えできます。

* **親主導のUI拡張**：親がテーブルUIの一部（例：フィルター行やアクション列）を差し替え可能にするには、対応するスロットを用意します。例えば、フィルター行用の `#filter` スロットや、ボタン列用の `#actions` スロットを用意し、親がその内容を提供できます。子コンポーネントはスロットがない場合のデフォルトUIも定義しておき、拡張性を確保します。

* **Slots と emits の組み合わせ例**：親が提供する slot コンテンツから emit を使う場合、前述のように子から関数を渡し、親はその関数を呼び出す設計が高度な連携例になります。たとえば、子がスロットプロパティとして行データや編集関数を渡し、親スロット内のボタンがそれを実行することで、親はテーブルコンポーネントのイベント（`@edit`）を受け取ります。このパターンにより、親はスロットでUIを自由に構築しつつ、クリック等の操作を子の `emit` 経由で通知できます。

## 3. 実例：柔軟なデータテーブルコンポーネント

以下に具体例を示します。`DataTable.vue` というコンポーネントを作り、`columns` や `items`、ページ情報を `props` で受け取り、列テンプレートやアクション列をスロットでカスタマイズ可能とします。

```vue
<!-- DataTable.vue -->
<template>
  <table>
    <thead>
      <tr>
        <!-- 各列ヘッダー -->
        <th v-for="col in columns" :key="col.key">
          <!-- ヘッダーセルをスロット化 -->
          <slot :name="`head(${col.key})`" :column="col">
            {{ col.label }}
          </slot>
        </th>
        <!-- アクション列ヘッダー -->
        <th>
          <slot name="headActions">
            操作
          </slot>
        </th>
      </tr>
      <!-- フィルター行（あれば） -->
      <tr v-if="showFilter">
        <td v-for="col in columns" :key="col.key">
          <slot :name="`filter(${col.key})`"></slot>
        </td>
        <td><slot name="filterActions"></slot></td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item[idKey]">
        <!-- 各データセル -->
        <td v-for="col in columns" :key="col.key">
          <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
            {{ item[col.key] }}
          </slot>
        </td>
        <!-- アクションセル -->
        <td>
          <slot name="actions"
                :item="item"
                :onEdit="() => emit('edit', item)"
                :onDelete="() => emit('delete', item)">
            <button @click="() => emit('edit', item)">編集</button>
            <button @click="() => emit('delete', item)">削除</button>
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="pagination">
      <tr>
        <td :colspan="columns.length + 1">
          <!-- ページネーション制御 -->
          <slot name="pagination" :page="pagination.page" :pageSize="pagination.pageSize">
            <button :disabled="pagination.page <= 1" @click="emit('update:page', pagination.page - 1)">前</button>
            <button :disabled="pagination.page >= totalPages" @click="emit('update:page', pagination.page + 1)">次</button>
          </slot>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

interface Column {
  key: string;
  label: string;
}
interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export default defineComponent({
  name: 'DataTable',
  props: {
    columns: { type: Array as PropType<Column[]>, required: true },
    items:  { type: Array as PropType<Record<string, any>[]>, required: true },
    idKey:  { type: String, default: 'id' },
    pagination: { 
      type: Object as PropType<Pagination>, 
      default: null 
    },
    showFilter: { type: Boolean, default: false }
  },
  emits: ['edit', 'delete', 'update:page'],
  setup(props, { emit }) {
    const totalPages = computed(() => {
      if (!props.pagination) return 1;
      return Math.ceil(props.pagination.total / props.pagination.pageSize);
    });
    return { totalPages, emit };
  }
});
</script>
```

この `DataTable` では、**型付き props** と **型付き emits** を使っており、TypeScript で安全に扱えます。親は以下のように利用できます。

```vue
<!-- ParentComponent.vue -->
<template>
  <DataTable
    :columns="[{ key: 'name', label: '氏名' }, { key: 'age', label: '年齢' }]"
    :items="users"
    :pagination="{ page, pageSize, total }"
    id-key="userId"
    @edit="handleEdit"
    @delete="handleDelete"
    @update:page="handlePageUpdate"
  >
    <!-- name列セルのカスタムテンプレート -->
    <template #cell(name)="{ value }">
      <span class="text-green">{{ value }}</span>
    </template>

    <!-- 操作列のカスタムテンプレート -->
    <template #actions="{ item, onEdit, onDelete }">
      <button @click="onEdit()">編集</button>
      <button @click="onDelete()">削除</button>
    </template>

    <!-- ページネーションのカスタム -->
    <template #pagination="{ page, pageSize }">
      ページ {{ page }} / {{ totalPages }}
      <button @click="$emit('update:page', page - 1)" :disabled="page <= 1">前へ</button>
      <button @click="$emit('update:page', page + 1)" :disabled="page >= totalPages">次へ</button>
    </template>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataTable from './DataTable.vue';

export default defineComponent({
  components: { DataTable },
  data() {
    return {
      users: [
        { userId: 1, name: '田中', age: 30 },
        { userId: 2, name: '鈴木', age: 25 }
      ],
      page: 1, pageSize: 10, total: 42
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    handleEdit(item: any) { console.log('編集:', item); },
    handleDelete(item: any) { console.log('削除:', item); },
    handlePageUpdate(newPage: number) { this.page = newPage; }
  }
});
</script>
```

この例では、親から列定義・データ・ページ情報を渡し、カスタム列テンプレートや操作列をスロットで差し替えています。操作列ではスコープ付きスロットで `onEdit` / `onDelete` を受け取り、クリックすると子の `emit('edit'/'delete')` が呼ばれ親のメソッドが動作します。Vue 3 の型システムのおかげで、`props` や `emits` で型を付けておけば、ミスも軽減できます。また、動的スロット名を使うことで列やセル単位の高度なカスタマイズも可能です。

以上のように、**props → slots → emit** の連携設計により、データテーブルコンポーネントを親主導で拡張・カスタマイズできます。注意点として、スロット内で `$emit` する場合のスコープに留意し、必要なら子からメソッドを渡す形にすると良いでしょう。このパターンを意識すれば、再利用性・拡張性に優れた Vue コンポーネント設計が実現できます。

**参考資料:** Vue公式ドキュメントや実例記事などを参照しました。

