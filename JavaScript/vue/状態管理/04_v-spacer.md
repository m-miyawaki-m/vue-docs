`v-spacer` は、**Vuetify 3** におけるレイアウトコンポーネントの一つで、**親コンテナ内で左右または上下に余白（スペース）を作るための空の要素**です。

---

## 🧭 基本の役割

> **「両端にコンポーネントを配置したい」「右寄せ・左寄せしたい」時に使う**
> （例：ボタンを右端に寄せる）

---

## 🧩 使用例

```vue
<v-card-actions>
  <v-btn color="grey">キャンセル</v-btn>
  <v-spacer />
  <v-btn color="primary">保存</v-btn>
</v-card-actions>
```

### ⬇ 出力イメージ

```
[キャンセル]        [スペース]          [保存]
```

---

## ⚙️ 特性まとめ

| 特性      | 説明                          |
| ------- | --------------------------- |
| フレックス要素 | `display: flex` な親の中で空間を埋める |
| 横幅調整    | 自動的に「余白部分」を伸ばして隣の要素を右へ押す    |
| サイズ     | 自動で空間を調整（手動指定不要）            |

---

## 🎨 レイアウトの使用パターン

### ✅ ボタン右寄せ

```vue
<v-row>
  <v-spacer />
  <v-btn>次へ</v-btn>
</v-row>
```

### ✅ 中央揃え（両端に spacer）

```vue
<v-row>
  <v-spacer />
  <v-btn>中央ボタン</v-btn>
  <v-spacer />
</v-row>
```

---

## 🧠 HTMLで例えるなら？

Vuetifyの `v-spacer` は、**Flexboxにおける `margin-left: auto;` 相当**の空白要素です。

---

## ✅ 補足

* `v-spacer` を使用するには、**親コンテナ（`v-row` や `v-card-actions`）が `display: flex`** である必要があります。
* スペース調整のため、**単独で配置しても何も見えません。**

---

必要であれば、`v-spacer` を含む Vuetify のレイアウトパターン集（左右寄せ、上下センターなど）もまとめてお渡しできます。作成しますか？

以下に、Vuetify 3 における `v-spacer` や `v-row`, `v-col`, `v-container`, `d-flex` などを活用した**レイアウトパターン集**（左右寄せ・上下センター・中央揃え・固定配置）をまとめました。スマホ非対応／px単位の環境にも合わせて使いやすい形式です。

---

# 🎨 Vuetify 3 レイアウトパターン集

---

## ✅ 1. **ボタン右寄せ**

```vue
<template>
  <v-row>
    <v-spacer />
    <v-btn color="primary">保存</v-btn>
  </v-row>
</template>
```

---

## ✅ 2. **中央寄せ（水平）**

```vue
<template>
  <v-row justify="center">
    <v-btn color="primary">中央ボタン</v-btn>
  </v-row>
</template>
```

または `v-spacer` を両側に：

```vue
<template>
  <v-row>
    <v-spacer />
    <v-btn color="primary">中央ボタン</v-btn>
    <v-spacer />
  </v-row>
</template>
```

---

## ✅ 3. **上下・左右完全中央揃え**

```vue
<template>
  <v-container
    class="d-flex align-center justify-center"
    style="height: 500px;"
  >
    <v-btn color="primary">中央</v-btn>
  </v-container>
</template>
```

* `align-center`：上下中央
* `justify-center`：左右中央

---

## ✅ 4. **ボタンを右下に固定**

```vue
<template>
  <v-btn
    style="position: absolute; right: 20px; bottom: 20px;"
    color="primary"
  >
    保存
  </v-btn>
</template>
```

---

## ✅ 5. **上下2段 + 下段右寄せ**

```vue
<template>
  <v-container>
    <v-row>
      <v-col><p>上段テキスト</p></v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-btn>次へ</v-btn>
    </v-row>
  </v-container>
</template>
```

---

## ✅ 6. **2つのボタンを右端に並べる**

```vue
<template>
  <v-row>
    <v-spacer />
    <v-btn class="mr-2" color="success">追加</v-btn>
    <v-btn color="error">削除</v-btn>
  </v-row>
</template>
```

---

## ✅ 7. **横並び（ラベル + ボタン）中央配置**

```vue
<template>
  <v-row align="center" justify="center">
    <span class="mr-2">処理内容：</span>
    <v-btn color="primary">実行</v-btn>
  </v-row>
</template>
```

---

## ✅ 8. **フォーム要素 + ボタン（右寄せ）**

```vue
<template>
  <v-form>
    <v-text-field label="名前" />
    <v-row class="mt-2">
      <v-spacer />
      <v-btn color="primary">登録</v-btn>
    </v-row>
  </v-form>
</template>
```

---

## 📌 スタイル補足

| クラス名                          | 役割                |
| ----------------------------- | ----------------- |
| `d-flex`                      | 親を flex 表示に       |
| `justify-center`              | 子要素を横中央揃え         |
| `align-center`                | 子要素を縦中央揃え         |
| `v-spacer`                    | 空白を入れて要素を右・中央へ寄せる |
| `style="position: absolute;"` | 固定配置に使用           |

---

このまま `.md` 形式で保存して、\*\*「レイアウトテンプレート集」\*\*としても活用できます。もし使用予定の画面ごとに「この画面のUIパターンをまとめてほしい」といった希望があれば、構成ごとにカスタマイズして提供できます。ご希望ありますか？
