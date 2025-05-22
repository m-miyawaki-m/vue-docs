<template>
  <v-container style="padding: 20px;width: 800px;height: 500px;">
    <!-- 表示切り替え -->
    <template v-if="!showChart">
      <v-data-table :headers="headers" :items="items">
        <template #item.status="{ item }">
          <v-img :src="item.status === 'ok' ? okIcon : ngIcon" width="24" height="24" />
        </template>

        <template #item.actions="{ item }">
          <v-menu>
            <!--
            activator スロットは、v-menu の「開閉トリガー」となるボタンなどを定義する場所。
            この中に置いた要素（例：v-btn）をクリックすると v-menu が開く。
          -->
            <template #activator="{ props }">
              <!--
              v-btn: Vuetify のボタンコンポーネント
              icon 属性: アイコンボタンとして表示（角丸ボタンなどではなく、小さい円形ボタン）

              v-bind="props": activator スロットから渡される props（イベントハンドラなど）をこのボタンに渡す。
              これにより v-menu が正しく開閉できるようになる。
              → これを忘れると、ボタンをクリックしてもメニューが開かない！
            -->
              <v-btn icon v-bind="props">
                <!--
                v-icon: Vuetify のアイコンコンポーネント
                mdi-dots-vertical: Material Design Icons の「縦3点メニュー」アイコン
              -->
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="openDialog(item)">
                <v-list-item-title>詳細（ダイアログ）</v-list-item-title>
              </v-list-item>
              <v-list-item @click="goToDetail(item)">
                <v-list-item-title>詳細（ページ遷移）</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </template>
    <template v-else>
      <!-- Chart.js 用の子コンポーネントを表示 -->
      <ChartView :item="selectedItem" @back="showChart = false" />
    </template>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>ユーザー編集</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="selectedItem.name" label="名前" required />
            <v-select v-model="selectedItem.status" :items="['ok', 'ng']" label="ステータス" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">キャンセル</v-btn>
          <v-btn color="primary" @click="submit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import okIcon from '@/assets/icons/ok.png'
import ngIcon from '@/assets/icons/ng.png'
import ChartView from '@/components/ChartView.vue'



export default defineComponent({
  setup() {
    const router = useRouter()
    const dialog = ref(false)
    const selectedItem = ref({})
    const showChart = ref(false)

    const formRef = ref(null) // v-form の参照用
    const submit = () => {
      // バリデーションチェック（必要であれば）
      const form = formRef.value
      if (form) {
        // ここでエラーチェックなども可能
        console.log('保存されたデータ:', selectedItem.value)

        // ✅ ダイアログを閉じる
        dialog.value = false
      }
    }

    const headers = [
      { title: '名前', key: 'name' },
      { title: 'ステータス', key: 'status' },
      { title: '操作', key: 'actions', sortable: false },
    ]

    const items = [
      { name: 'ユーザー1', status: 'ok' },
      { name: 'ユーザー2', status: 'ng' },
    ]

    const openDialog = (item) => {
      selectedItem.value = item
      dialog.value = true
    }

    const goToDetail = (item) => {
      selectedItem.value = item
      showChart.value = true // ← これで ChartView に切り替え
      // router.push(`/detail/${item.name}`) ← ルーティングは不要ならコメントアウト
    }

    return {
      headers,
      items,
      okIcon,
      ngIcon,
      dialog,
      selectedItem,
      openDialog,
      goToDetail,
      formRef,    // ← 追加
      submit,     // ← 追加
      ChartView,
      showChart,
  }

  }
})
</script>
