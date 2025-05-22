defineComponent を使う Vue 3 コンポーネントでの watch の使い方は、setup 関数内で watch をインポートして使います。以下にシンプルな例を示します。


---

例：count を監視してログを出力する

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'WatchExample',
  setup() {
    const count = ref(0);

    // watch の使い方
    watch(count, (newVal, oldVal) => {
      console.log(`count changed: ${oldVal} → ${newVal}`);
    });

    const increment = () => {
      count.value++;
    };

    return {
      count,
      increment
    };
  }
});
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">増やす</button>
  </div>
</template>


---

解説：

ref(0) → count はリアクティブな変数。

watch(変数, コールバック) → 変数の変更を監視して副作用を実行。

count.value++ によって変更されると watch のコールバックが実行。



---

他のパターン：

複数の値を監視

watch([foo, bar], ([newFoo, newBar], [oldFoo, oldBar]) => {
  // 両方の変化を同時に監視
});

deep オプション（オブジェクトの中身の変更を検出）

watch(obj, (newVal) => {
  // obj の中身が変わったら実行
}, { deep: true });

immediate オプション（初回実行）

watch(count, (newVal) => {
  console.log('初回も実行されます', newVal);
}, { immediate: true });


---

必要であれば watchEffect の使い方も補足できます。


watchEffect は Vue 3 の Composition API で使えるリアクティブな副作用処理です。watch よりも簡潔に使えるのが特徴です。


---

基本構文：

import { defineComponent, ref, watchEffect } from 'vue';

export default defineComponent({
  setup() {
    const count = ref(0);

    watchEffect(() => {
      console.log(`countの値は: ${count.value}`);
    });

    const increment = () => {
      count.value++;
    };

    return {
      count,
      increment
    };
  }
});


---

特徴と使い分け：

特徴	watch	watchEffect

指定対象	明示的に変数を指定する	関数内で使用している変数を自動追跡
初回実行	immediate: true を指定しないと実行されない	自動で初回実行される
対象が複雑な場合	deep: true が必要	自動で深く監視（ただしパフォーマンス注意）
副作用処理の用途	変更をトリガーにAPI通信など実行	テンプレートに連動する軽量な処理



---

使用例：複数の変数に依存

const firstName = ref('太郎');
const lastName = ref('山田');

watchEffect(() => {
  console.log(`フルネーム: ${lastName.value} ${firstName.value}`);
});

このように、watchEffect は 関数内で使ったリアクティブな値を自動で追跡するため、使い勝手が非常に良いです。


---

注意点：

依存関係のある値が変更されるたびに再実行されます。

複雑な副作用（API通信や特定のタイミング制御）には watch を使った方が制御しやすいです。



---

必要なら watchPostEffect, watchSyncEffect などの違いも紹介できます。

