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
import ngIcon from '@/assets/icons/ng.png'
import okIcon from '@/assets/icons/ok.png'
import ChartView from '@/components/ChartView.vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'


export default defineComponent({
setup() {
  const router = useRouter()
  const dialog = ref(false)
  const selectedItem = ref({})
  const showChart = ref(false)
  const formRef = ref(null)

  const store = useStore() // ✅ ここが先！

  const headers = computed(() => store.getters.headers)
  const items = computed(() => store.getters.items)

  onMounted(async () => {
    const res = await fetch('/data/tableData.json')
    const data = await res.json()
    store.commit('setHeaders', data.headers)
    store.commit('setItems', data.items)
  })

  const submit = () => {
    const form = formRef.value
    if (form) {
      // ✅ Vuex ストアの items を更新
      store.commit('updateItem', selectedItem.value)

      // ✅ ダイアログを閉じる
      dialog.value = false
    }
  }

  const openDialog = (item) => {
    selectedItem.value = item
    dialog.value = true
  }

  const goToDetail = (item) => {
    selectedItem.value = item
    showChart.value = true
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
    formRef,
    submit,
    ChartView,
    showChart,
  }
}

})
</script>
