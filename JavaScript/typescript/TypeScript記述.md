# **1. TypeScript の基本**

## **🟢 TypeScript とは？**
**TypeScript（TS）** は、Microsoft によって開発された **JavaScript のスーパーセット（拡張版）** です。

✅ **主な特徴**
- **静的型付け**（コンパイル時に型エラーを検出）
- **最新の JavaScript をサポート**（ES6+ の機能がそのまま使える）
- **大規模開発向け**（型チェックでバグを減らせる）
- **コンパイル（トランスパイル）が必要**（`tsc` で JavaScript に変換）

---

## **🟢 JavaScript との違い**
| **項目** | **JavaScript** | **TypeScript** |
|---------|--------------|---------------|
| **型** | 動的型付け（`let x = "Hello"` → 途中で `x = 10` も可能） | 静的型付け（`let x: string = "Hello"` → `x = 10` はエラー） |
| **エラーチェック** | 実行時エラー（動かしてみないとエラーがわからない） | **コンパイル時に型エラーを検出できる** |
| **開発ツール** | 型ヒントがないため、エディタの補完が弱い | **VSCode などで強力な補完とエラーチェック** |
| **クラス** | `class` は ES6 で導入されたが、オプション機能 | **`interface` / `abstract` などの OOP 機能が強力** |
| **型推論** | なし | **型推論あり（変数に適切な型が自動で推測される）** |

---

## **🟢 TypeScript の導入**
TypeScript を使うには、`tsc`（TypeScript コンパイラ）が必要です。

---

### **📌 1. TypeScript をインストール**
#### **🔹 グローバルインストール（全プロジェクトで使用）**
```sh
npm install -g typescript
```
✅ **`tsc -v` でバージョンを確認**
```sh
tsc -v
```

#### **🔹 プロジェクトごとにインストール**
```sh
npm init -y  # package.json を作成
npm install typescript --save-dev
```
✅ **プロジェクト内の `node_modules/.bin/tsc` を使用する**

---

### **📌 2. TypeScript のコンパイル（`tsc`）**
TypeScript はブラウザで直接動かせないため、**JavaScript に変換（トランスパイル）する必要がある**。

#### **🔹 `.ts` ファイルを作成**
`hello.ts`
```ts
let message: string = "Hello, TypeScript!";
console.log(message);
```

#### **🔹 コンパイル**
```sh
tsc hello.ts
```
✅ **`hello.js`（JavaScript に変換されたファイル）が生成される**
```js
"use strict";
let message = "Hello, TypeScript!";
console.log(message);
```

✅ **Node.js で実行**
```sh
node hello.js
```

---

### **📌 3. `tsconfig.json` の設定**
`tsc` を使いやすくするため、**`tsconfig.json`（TypeScript 設定ファイル）** を作成する。

```sh
tsc --init
```

`tsconfig.json`（主要設定）
```json
{
  "compilerOptions": {
    "target": "ES6",      // 生成する JavaScript のバージョン
    "module": "CommonJS", // モジュールシステム（Node.js 用）
    "strict": true,       // 型チェックを厳格にする
    "outDir": "./dist",   // 出力ディレクトリ
    "rootDir": "./src"    // TypeScript ファイルの場所
  }
}
```

✅ **設定後、`tsc` で `src/` 内の `.ts` ファイルをすべてコンパイル**
```sh
tsc
```
✅ **`dist/` にコンパイルされた `.js` ファイルが生成される！**

---

### **📌 4. `ts-node`（コンパイルなしで実行）**
通常、TypeScript を実行するには **`tsc` で JavaScript に変換 → `node` で実行** する必要がある。

**しかし、`ts-node` を使えばコンパイルなしで `.ts` を実行できる！**
```sh
npm install -g ts-node
```
```sh
ts-node hello.ts
```
✅ **即座に TypeScript を実行できる！**

---

## **🎯 まとめ**
| 項目 | TypeScript の特徴 |
|------|----------------|
| **TypeScript とは？** | JavaScript を拡張した型安全な言語 |
| **JavaScript との違い** | 静的型付け・コンパイル時のエラーチェック・強力な型推論 |
| **インストール** | `npm install -g typescript` |
| **コンパイル** | `tsc hello.ts`（`.ts` → `.js`） |
| **設定ファイル** | `tsconfig.json`（コンパイルオプションを管理） |
| **`ts-node`** | コンパイルせずに TypeScript を直接実行 |

---

**JavaScript の知識を活かしながら、TypeScript の型安全な開発を学ぼう！🚀**

# **2. 型（Types）**
TypeScript の最大の特徴は **型（Types）** を持っていることです。  
JavaScript では動的型付けですが、TypeScript では **静的型付け** を導入することで、エラーを事前に防ぐことができます。

---

## **🟢 1. 基本の型**
TypeScript には **プリミティブ型**（基本の型）があり、変数に明示的な型を指定できます。

### **📌 `string`（文字列）**
```ts
let name: string = "太郎";
console.log(name);
```
✅ **`name` は `string` 型なので、数値を代入するとエラーになる！**
```ts
name = 123; // ❌ エラー: Type 'number' is not assignable to type 'string'.
```

---

### **📌 `number`（数値）**
```ts
let age: number = 25;
```
✅ **整数・小数・16進数・2進数・NaN もすべて `number` 型**

---

### **📌 `boolean`（真偽値）**
```ts
let isActive: boolean = true;
```

---

### **📌 `null` / `undefined`**
```ts
let emptyValue: null = null;
let notAssigned: undefined = undefined;
```
✅ **`null` と `undefined` は `strictNullChecks`（`tsconfig.json`）が `true` の場合、厳しくチェックされる。**

---

### **📌 `void`（関数が値を返さない）**
```ts
function logMessage(): void {
    console.log("ログを表示");
}
```
✅ **`void` は「値を返さない関数」の戻り値として使う。**

---

### **📌 `any`（なんでも OK）**
**`any` は TypeScript の型安全性を無効化するので、極力避けるべき。**
```ts
let anything: any = "文字列";
anything = 42;  // OK
anything = true; // OK
```

---

### **📌 `never`（決して戻らない関数）**
`never` は **例外をスローする関数や無限ループ** に使う。
```ts
function throwError(message: string): never {
    throw new Error(message);
}
```

---

## **🟢 2. オブジェクト型**
オブジェクトの型定義をすると、**キーと値の型を指定できる**。

```ts
let person: { name: string; age: number } = {
    name: "花子",
    age: 30,
};
```

✅ **存在しないキーを追加するとエラーになる！**
```ts
person.city = "東京"; // ❌ エラー: Property 'city' does not exist
```

---

## **🟢 3. 配列型**
配列の型は **2つの方法** で定義できる。

```ts
let numbers1: number[] = [1, 2, 3];
let numbers2: Array<number> = [4, 5, 6];
```

✅ **型と異なるデータを入れるとエラーになる！**
```ts
numbers1.push("文字列"); // ❌ エラー: Argument of type 'string' is not assignable to parameter of type 'number'.
```

---

## **🟢 4. タプル型**
タプル型を使うと、**配列の各要素に異なる型を指定できる**。

```ts
let user: [number, string] = [1, "太郎"];
console.log(user[0]); // 1
console.log(user[1]); // "太郎"
```
✅ **要素数が異なるとエラーになる！**
```ts
user = [1, "太郎", 30]; // ❌ エラー: Type '[number, string, number]' is not assignable to type '[number, string]'
```

---

## **🟢 5. ユニオン型（`|`）**
ユニオン型を使うと、**複数の型を許可できる**。

```ts
let value: string | number;
value = "文字列"; // OK
value = 42;      // OK
value = true;    // ❌ エラー: Type 'boolean' is not assignable to type 'string | number'.
```

✅ **関数の引数にも使える**
```ts
function printId(id: string | number) {
    console.log("ID:", id);
}
printId(123);  // OK
printId("abc"); // OK
printId(true);  // ❌ エラー
```

---

## **🟢 6. リテラル型**
リテラル型を使うと、**特定の値だけを許可できる**。

```ts
let status: "success" | "error" | "pending";
status = "success"; // OK
status = "error";   // OK
status = "failed";  // ❌ エラー: Type '"failed"' is not assignable to type '"success" | "error" | "pending"'.
```

✅ **関数の引数にも使える**
```ts
function setMode(mode: "light" | "dark") {
    console.log("モード:", mode);
}

setMode("light"); // OK
setMode("dark");  // OK
setMode("blue");  // ❌ エラー
```

---

## **🟢 7. 型エイリアス（`type`）**
型エイリアスを使うと、**型に名前をつけて再利用できる**。

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

let user1: User = { id: 1, name: "太郎", email: "taro@example.com" };
let user2: User = { id: 2, name: "花子", email: "hanako@example.com" };
```

✅ **関数の引数や戻り値にも使える**
```ts
function getUser(): User {
    return { id: 3, name: "次郎", email: "jiro@example.com" };
}
```

---

## **🎯 まとめ**
| 型 | 説明 |
|----|------|
| **`string`** | 文字列型 |
| **`number`** | 数値型（整数・小数・NaN 含む） |
| **`boolean`** | 真偽値（`true` / `false`） |
| **`null` / `undefined`** | `null` は空の値、`undefined` は未定義 |
| **`void`** | 関数が値を返さない |
| **`any`** | すべての型を許容（型安全性がなくなる） |
| **`never`** | 例外をスローする関数や無限ループ |
| **オブジェクト型** | `{ key: value }` の形で指定 |
| **配列型** | `number[]` または `Array<number>` |
| **タプル型** | `[型, 型, 型]` のように要素ごとに型を定義 |
| **ユニオン型** | `string | number` のように複数の型を許可 |
| **リテラル型** | `"success" | "error"` のように特定の値のみ許可 |
| **型エイリアス** | `type` を使って型を再利用 |

---

**TypeScript の型を活用すれば、エラーを事前に防ぎ、安全なコードを書ける！🚀**


# **3. 演算子（Operators）**
✅ **TypeScript の演算子は JavaScript と基本的に同じ** ですが、  
**型アノテーションにより、演算子の使用が厳密にチェックされる** のが特徴です。

---

## **🟢 1. 算術演算子**
✅ **基本の算術演算子は JavaScript と同じ。数値型（`number`）でのみ使用可能。**

```ts
let a: number = 10;
let b: number = 3;

console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.3333...
console.log(a % b);  // 1  （10 ÷ 3 の余り）
console.log(a ** b); // 1000（10^3）
```

✅ **TypeScript では型エラーを防ぐ**
```ts
let x: number = 10;
let y: string = "5";

console.log(x + y); // ❌ エラー（型が合わない）
```

---

## **🟢 2. 代入演算子**
✅ **値を代入する演算子**
```ts
let num: number = 10;
num += 5;  // num = num + 5;
console.log(num); // 15
```

| 演算子 | 説明 |
|--------|------|
| `=`  | 代入 |
| `+=` | 加算して代入 |
| `-=` | 減算して代入 |
| `*=` | 乗算して代入 |
| `/=` | 除算して代入 |
| `%=` | 剰余を求めて代入 |

---

## **🟢 3. 比較演算子**
✅ **TypeScript では、異なる型の比較をエラーにできる**
```ts
let num1: number = 10;
let num2: number = 20;
let str: string = "10";

console.log(num1 === num2); // false
console.log(num1 !== num2); // true
console.log(num1 > num2);   // false
console.log(num1 <= num2);  // true

console.log(num1 == str);   // ❌ エラー（`strict` モードでは型が違うと警告）
console.log(num1 === str);  // false（型が違う）
```

✅ **`==` と `===` の違い**
| 演算子 | 比較 | 型チェック |
|--------|------|---------|
| `==`  | 値のみ比較 | なし（暗黙的型変換あり） |
| `===` | 値と型を比較 | あり（厳密比較） |

```ts
console.log(10 == "10");  // true（型変換あり）
console.log(10 === "10"); // false（型が違うので false）
```

✅ **`strict` モードなら `==` の使用を制限できる**
```json
"strict": true
```
これにより、異なる型の比較はコンパイルエラーになる。

---

## **🟢 4. 論理演算子**
✅ **`&&`, `||`, `!` は TypeScript でも同じ**
```ts
let isAdmin: boolean = true;
let isUser: boolean = false;

console.log(isAdmin && isUser); // false
console.log(isAdmin || isUser); // true
console.log(!isAdmin);          // false
```

✅ **JavaScript では異なる型でも `&&` や `||` が使えるが、TypeScript では制限される**
```ts
let name: string = "Taro";
let isLoggedIn: boolean = true;

console.log(name && isLoggedIn); // ❌ エラー（異なる型を比較）
```

---

## **🟢 5. ビット演算子**
✅ **ビット単位の操作**
```ts
console.log(5 & 3); // 1  （5: 101, 3: 011 → 001）
console.log(5 | 3); // 7  （5: 101, 3: 011 → 111）
console.log(5 ^ 3); // 6  （5: 101, 3: 011 → 110）
console.log(~5);    // -6 （5: 000...0101 → 111...1010）
console.log(5 << 1); // 10（左シフト）
console.log(5 >> 1); // 2  （右シフト）
```

---

## **🟢 6. 三項演算子**
✅ **`条件 ? 真の値 : 偽の値` の形で使用**
```ts
let age: number = 20;
let status: string = age >= 18 ? "成人" : "未成年";
console.log(status); // 成人
```

✅ **TypeScript では `status` の型が `string` であることが保証される！**

---

## **🟢 7. 型アノテーションによる演算子の厳密化**
✅ **TypeScript では型が適切に付けられていないとエラーになる**
```ts
let num: number = 10;
let text: string = "20";

// console.log(num + text); // ❌ エラー: `number` と `string` の演算はできない
```

✅ **適切な型変換を行う**
```ts
console.log(num + Number(text)); // 30（型変換が必要）
```

✅ **文字列の結合には `+` を使用**
```ts
let firstName: string = "太郎";
let lastName: string = "山田";

console.log(firstName + " " + lastName); // "太郎 山田"
```

✅ **テンプレートリテラルなら `+` を使わなくても OK**
```ts
console.log(`${firstName} ${lastName}`); // "太郎 山田"
```

---

## **🎯 まとめ**
| 演算子 | 説明 | 例 |
|--------|------|----|
| **算術演算子** | `+`, `-`, `*`, `/`, `%`, `**` | `10 + 5` |
| **代入演算子** | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | `x += 10` |
| **比較演算子** | `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=` | `10 === "10"`（false） |
| **論理演算子** | `&&`, `||`, `!` | `true && false` |
| **ビット演算子** | `&`, `|`, `^`, `~`, `<<`, `>>` | `5 & 3` |
| **三項演算子** | `条件 ? 真の値 : 偽の値` | `age >= 18 ? "成人" : "未成年"` |

✅ **TypeScript では型の制約があるため、誤った演算が防げる！🚀**


# **4. 制御構文（Control Flow）**
✅ **TypeScript の制御構文（`if`、`for`、`while` など）は JavaScript と同じ** ですが、  
TypeScript では **型安全なチェック** が加わるため、誤った条件判定を防ぐことができます。

---

## **🟢 1. `if` 文（条件分岐）**
`if` 文の基本的な使い方は **JavaScript と同じ** ですが、TypeScript では **型安全なチェック** が可能です。

### **📌 `if` の基本**
```ts
let age: number = 18;

if (age >= 18) {
    console.log("成人です");
} else {
    console.log("未成年です");
}
```

✅ **TypeScript では型が適切でないとエラーになる**
```ts
let age: number = 18;

if (age === "18") {  // ❌ エラー: 型が違う
    console.log("OK");
}
```
✅ **解決策 → `number` に統一**
```ts
if (age === 18) { // ✅ OK
    console.log("OK");
}
```

---

## **🟢 2. `switch` 文（型チェック付き）**
`switch` 文は **複数の分岐を処理する** のに便利です。

### **📌 `switch` の基本**
```ts
let status: string = "success";

switch (status) {
    case "success":
        console.log("成功しました");
        break;
    case "error":
        console.log("エラーが発生しました");
        break;
    default:
        console.log("不明なステータス");
}
```
✅ **TypeScript では `status` の型が `string` なので、`number` を渡すとエラーになる**
```ts
status = 200; // ❌ エラー: 型が一致しない
```

---

### **📌 `enum` を使った `switch`（TypeScript らしい書き方）**
TypeScript では **`enum` を使うと、より型安全な `switch` 文が書ける**。

```ts
enum Status {
    Success = "success",
    Error = "error",
    Pending = "pending"
}

let status: Status = Status.Success;

switch (status) {
    case Status.Success:
        console.log("成功しました");
        break;
    case Status.Error:
        console.log("エラーが発生しました");
        break;
    case Status.Pending:
        console.log("処理中...");
        break;
}
```
✅ **`enum` を使うことで、型の安全性が確保され、スペルミスも防げる！**

---

## **🟢 3. ループ処理**
TypeScript では、**JavaScript のループ (`for`, `while`, `do...while`) はすべて利用可能**。

### **📌 `for` ループ**
```ts
for (let i = 0; i < 5; i++) {
    console.log(`i の値: ${i}`);
}
```
✅ **TypeScript では `i` の型が `number` であることが保証される！**

---

### **📌 `for...of`（配列の値を取得）**
```ts
let numbers: number[] = [10, 20, 30];

for (let num of numbers) {
    console.log(num); // 10, 20, 30
}
```
✅ **TypeScript では `num` が `number` 型であることが保証される！**

---

### **📌 `for...in`（オブジェクトのキーを取得）**
```ts
let user = { id: 1, name: "太郎", age: 25 };

for (let key in user) {
    console.log(`${key}: ${user[key as keyof typeof user]}`);
}
```
✅ **`keyof typeof` を使うことで、オブジェクトのキーを型安全に取得できる！**

---

### **📌 `while` ループ**
```ts
let count: number = 0;

while (count < 3) {
    console.log(`カウント: ${count}`);
    count++;
}
```

---

### **📌 `do...while` ループ**
```ts
let count: number = 0;

do {
    console.log(`カウント: ${count}`);
    count++;
} while (count < 3);
```

---

## **🟢 4. ループの制御**
✅ **`break`（ループを中断）**
```ts
for (let i = 0; i < 5; i++) {
    if (i === 3) break;
    console.log(i); // 0, 1, 2 で終了
}
```

✅ **`continue`（次のループにスキップ）**
```ts
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    console.log(i); // 0, 1, 3, 4（2 をスキップ）
}
```

✅ **TypeScript では、ループ変数の型を保証**
```ts
for (let i: number = 0; i < 5; i++) {
    console.log(i); // `i` は `number` 型であることが保証される
}
```

---

## **🎯 まとめ**
| 制御構文 | 説明 |
|---------|------|
| **`if` 文** | 条件分岐（型安全にチェック） |
| **`switch` 文** | `enum` を使うと型安全なコードが書ける |
| **`for` ループ** | 指定回数のループ（`i: number` が保証される） |
| **`for...of`** | 配列の要素をループ（型安全） |
| **`for...in`** | オブジェクトのキーをループ（型を `keyof` で取得） |
| **`while` ループ** | 条件が `true` の間ループ |
| **`do...while` ループ** | 最低 1 回は実行されるループ |
| **`break` / `continue`** | ループの中断・スキップ |

✅ **TypeScript の型安全を活用すると、制御構文のミスを防げる！🚀**


# **5. 関数（Functions）**
✅ TypeScript では、関数の型アノテーションを活用することで、**引数や戻り値の型を厳密に管理** できます。

---

## **🟢 1. 関数の型アノテーション**
関数の引数や戻り値に **型を指定** できます。

### **📌 基本の型アノテーション**
```ts
function add(a: number, b: number): number {
    return a + b;
}

console.log(add(3, 7)); // 10
```

✅ **ポイント**
- **`a: number, b: number` → 引数の型を指定**
- **`: number` → 戻り値の型を指定**
- **型が違うとエラーになる**

```ts
console.log(add(3, "7")); // ❌ エラー: Argument of type 'string' is not assignable to parameter of type 'number'.
```

---

## **🟢 2. オプション引数とデフォルト引数**
✅ **オプション引数（`?` を付ける）**
```ts
function greet(name: string, age?: number): string {
    return age ? `こんにちは ${name} さん (${age}歳)` : `こんにちは ${name} さん`;
}

console.log(greet("太郎"));      // "こんにちは 太郎 さん"
console.log(greet("花子", 25)); // "こんにちは 花子 さん (25歳)"
```
✅ **ポイント**
- `age?: number` → **`?` を付けると省略可能**
- オプション引数のデフォルト値は **`undefined`**

---

✅ **デフォルト引数**
```ts
function greet(name: string, age: number = 20): string {
    return `こんにちは ${name} さん (${age}歳)`;
}

console.log(greet("太郎"));      // "こんにちは 太郎 さん (20歳)"
console.log(greet("花子", 25)); // "こんにちは 花子 さん (25歳)"
```
✅ **ポイント**
- `age: number = 20` → **デフォルト値を指定**
- **引数を省略した場合、デフォルト値が使われる**

---

## **🟢 3. 戻り値の型**
関数の戻り値にも型を指定できます。

✅ **数値を返す関数**
```ts
function multiply(a: number, b: number): number {
    return a * b;
}
```

✅ **文字列を返す関数**
```ts
function getMessage(): string {
    return "Hello, TypeScript!";
}
```

✅ **オブジェクトを返す関数**
```ts
function getUser(): { name: string; age: number } {
    return { name: "太郎", age: 30 };
}
```

---

## **🟢 4. `void` / `never` の使い分け**
✅ **`void`（戻り値がない関数）**
- **`void` は「何も値を返さない関数」** に使う。
```ts
function logMessage(message: string): void {
    console.log(message);
}

logMessage("ログ出力中...");
```

✅ **`never`（絶対に戻らない関数）**
- **`never` は「決して戻らない関数」** に使う。
- **例外をスローする関数や無限ループに使用**

```ts
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {
        console.log("無限ループ中...");
    }
}
```
✅ **`never` の特徴**
- **`return` で値を返さない**
- **処理が終了しない（無限ループ）**
- **例外をスローして終了する**

---

## **🟢 5. 関数型（関数の型を変数に代入）**
✅ **関数の型を変数に代入すると、関数の型安全性が向上！**

```ts
let add: (a: number, b: number) => number;

add = (x, y) => x + y; // OK
console.log(add(2, 3)); // 5
```

✅ **型エラーが防げる**
```ts
add = (x: string, y: string) => x + y; // ❌ エラー: 型が違う
```

---

✅ **関数の型を `type` で定義**
```ts
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (x, y) => x * y;
console.log(multiply(3, 4)); // 12
```
✅ **型エイリアスを使うと、複数の関数で型を共有できる！**

---

## **🎯 まとめ**
| 項目 | 説明 |
|------|------|
| **型アノテーション** | `function add(a: number, b: number): number` |
| **オプション引数** | `age?: number`（`?` を付ける） |
| **デフォルト引数** | `age: number = 20`（デフォルト値を設定） |
| **戻り値の型** | `: string` / `: number` / `: void` など |
| **`void`** | 値を返さない関数 |
| **`never`** | 戻り値が発生しない関数（例外・無限ループ） |
| **関数型** | `(a: number, b: number) => number` |

✅ **TypeScript の関数は型を厳密にすることで、バグを防ぎ、安全なコードが書ける！🚀**

# **6. オブジェクトと配列**
TypeScript では **オブジェクトと配列に型アノテーションを指定** することで、**型の安全性** を向上させることができます。

---

## **🟢 1. オブジェクトの型定義**
✅ **オブジェクトの型を指定する**
```ts
let user: { name: string; age: number } = {
    name: "太郎",
    age: 30
};
```
✅ **誤ったデータを入れるとエラーになる**
```ts
user.name = 123; // ❌ エラー: Type 'number' is not assignable to type 'string'
user.age = "三十"; // ❌ エラー: Type 'string' is not assignable to type 'number'
```

---

✅ **関数の引数や戻り値にも使える**
```ts
function getUser(): { name: string; age: number } {
    return { name: "花子", age: 25 };
}
```

✅ **オブジェクト型の再利用**
```ts
type User = { name: string; age: number };

let user1: User = { name: "太郎", age: 30 };
let user2: User = { name: "花子", age: 25 };
```

---

## **🟢 2. 配列の型アノテーション**
TypeScript では、配列の型を明示的に指定できます。

✅ **配列の型指定（2通りの書き方）**
```ts
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["apple", "banana", "cherry"];
```
✅ **異なる型のデータはエラーになる**
```ts
numbers.push("six"); // ❌ エラー: Type 'string' is not assignable to type 'number'
```

---

✅ **オブジェクトの配列**
```ts
type User = { name: string; age: number };

let users: User[] = [
    { name: "太郎", age: 30 },
    { name: "花子", age: 25 }
];
```

✅ **関数の引数や戻り値にも使える**
```ts
function getUsers(): User[] {
    return [
        { name: "次郎", age: 28 },
        { name: "三郎", age: 35 }
    ];
}
```

---

## **🟢 3. オプショナルプロパティ（`?`）**
✅ **プロパティを省略可能にするには `?` を使う**
```ts
type User = {
    name: string;
    age?: number; // オプショナルプロパティ
};

let user1: User = { name: "太郎", age: 30 };
let user2: User = { name: "花子" }; // OK（age は省略可能）
```

✅ **オプショナルプロパティは `undefined` になる**
```ts
console.log(user2.age); // undefined
```

✅ **関数の引数として使う**
```ts
function printUser(user: User): void {
    console.log(`名前: ${user.name}`);
    if (user.age !== undefined) {
        console.log(`年齢: ${user.age}`);
    }
}

printUser(user1); // "名前: 太郎" "年齢: 30"
printUser(user2); // "名前: 花子"
```

---

## **🎯 まとめ**
| 機能 | 説明 |
|------|------|
| **オブジェクトの型定義** | `{ key: type; key: type }` |
| **配列の型アノテーション** | `number[]` または `Array<number>` |
| **オブジェクトの配列** | `User[]` のように型エイリアスを使用 |
| **オプショナルプロパティ** | `?` を使って省略可能にする |

✅ **TypeScript のオブジェクトと配列の型定義を活用して、安全なコードを書こう！🚀**


# **7. ES6+ の機能（TypeScript 版）**
✅ **TypeScript は ES6+ の機能をそのまま使える** だけでなく、**型安全性を強化する独自の機能** も追加されています。

---

## **🟢 1. 型推論（Type Inference）**
TypeScript では、**明示的に型を指定しなくても、自動で型を推論** します。

✅ **型推論の例**
```ts
let name = "太郎";  // string 型として推論される
let age = 30;        // number 型として推論される
let isAdmin = true;  // boolean 型として推論される
```

✅ **関数の戻り値も推論される**
```ts
function add(a: number, b: number) {
    return a + b;  // number 型として推論される
}
```

✅ **型推論を活用するメリット**
- コードが **シンプル** になる
- **型の安全性** を確保できる
- **不要な型アノテーション** を減らせる

---

## **🟢 2. `readonly` 修飾子**
✅ **`readonly` を使うと、値の変更を防げる**
```ts
type User = {
    readonly id: number;
    name: string;
};

let user: User = { id: 1, name: "太郎" };
user.name = "花子";  // OK
user.id = 2;         // ❌ エラー: Cannot assign to 'id' because it is a read-only property.
```

✅ **配列の `readonly`（変更禁止の配列）**
```ts
let numbers: readonly number[] = [1, 2, 3];
numbers.push(4); // ❌ エラー: Property 'push' does not exist on type 'readonly number[]'.
```

✅ **クラスでも `readonly` を活用**
```ts
class Person {
    readonly id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

const person = new Person(1, "太郎");
person.id = 2; // ❌ エラー: Cannot assign to 'id' because it is a read-only property.
```

---

## **🟢 3. 型アサーション（`as` キーワード）**
✅ **型アサーションを使うと、「この値は特定の型である」と TypeScript に伝えることができる**

```ts
let value: any = "Hello, TypeScript!";
let strLength: number = (value as string).length;

console.log(strLength); // 17
```

✅ **DOM 要素の型アサーション**
```ts
const input = document.querySelector("input") as HTMLInputElement;
console.log(input.value);
```
**🔹 TypeScript では `querySelector` の戻り値は `Element | null` なので、`as HTMLInputElement` で型を指定**

✅ **注意点**
- **型アサーションを使いすぎると、型の安全性が失われる**
- **適切な型推論を活用するのがベスト**

---

## **🟢 4. `keyof` 型演算子**
✅ **`keyof` を使うと、オブジェクトのキーを型として取得できる**

```ts
type User = { id: number; name: string; age: number };
type UserKeys = keyof User;  // "id" | "name" | "age"

let key: UserKeys = "id";  // OK
key = "name";  // OK
key = "email"; // ❌ エラー: Type '"email"' is not assignable to type '"id" | "name" | "age"'.
```

✅ **オブジェクトの動的プロパティ取得**
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user: User = { id: 1, name: "太郎", age: 30 };
console.log(getProperty(user, "name")); // "太郎"
console.log(getProperty(user, "email")); // ❌ エラー: Argument of type '"email"' is not assignable to parameter of type '"id" | "name" | "age"'.
```

✅ **`keyof` を活用すると、動的なプロパティ取得でも型安全性を維持できる！**

---

## **🎯 まとめ**
| 機能 | 説明 |
|------|------|
| **型推論** | 変数や関数の型を自動推論 |
| **`readonly` 修飾子** | オブジェクトや配列の変更を防ぐ |
| **型アサーション（`as`）** | 値の型を強制的に変換 |
| **`keyof` 型演算子** | オブジェクトのキーを型として取得 |

✅ **TypeScript の ES6+ の機能を活用すると、より安全で強力なコードが書ける！🚀**

# **8. クラスとオブジェクト指向（OOP in TypeScript）**
TypeScript では、**オブジェクト指向プログラミング（OOP）** の概念を活用して、  
より **型安全で管理しやすいクラス設計** を行うことができます。

---

## **🟢 1. `class` と `interface`**
✅ **クラスの基本構文**
```ts
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): void {
        console.log(`こんにちは、${this.name} さん！`);
    }
}

const person1 = new Person("太郎", 30);
person1.greet(); // "こんにちは、太郎 さん！"
```
✅ **クラスの特徴**
- **コンストラクタ（`constructor`）で初期化**
- **メソッドを定義**
- **インスタンスを作成して利用**

---

✅ **インターフェース（`interface`）**
- **`interface` はクラスが実装すべきプロパティやメソッドを定義**
- **クラスに「契約」を課す**

```ts
interface User {
    name: string;
    age: number;
    greet(): void;
}

class JapaneseUser implements User {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): void {
        console.log(`こんにちは、${this.name} さん！`);
    }
}
```
✅ **インターフェースのメリット**
- **複数のクラスで共通の型を定義できる**
- **型安全を強化**
- **オブジェクトの構造を保証できる**

---

## **🟢 2. クラスのプロパティとコンストラクタの型**
✅ **プロパティの型を指定**
```ts
class Product {
    name: string;
    price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}

const book = new Product("TypeScript 入門", 2500);
console.log(book.name);  // "TypeScript 入門"
console.log(book.price); // 2500
```

✅ **ショートハンド構文（`public` を使うと省略できる）**
```ts
class Product {
    constructor(public name: string, public price: number) {} // 省略版
}

const book = new Product("TypeScript 入門", 2500);
```
✅ **メリット**
- **プロパティの宣言を省略**
- **`constructor` の引数で直接プロパティを定義できる**

---

## **🟢 3. `public` / `private` / `protected`**
✅ **アクセス修飾子**
| 修飾子 | アクセス範囲 |
|--------|--------------|
| `public` | どこからでもアクセス可能（デフォルト） |
| `private` | クラス内部でのみアクセス可能 |
| `protected` | クラス内部 + 継承先のクラスでアクセス可能 |

✅ **`private`（外部からアクセス不可）**
```ts
class BankAccount {
    private balance: number = 1000; // `private` なので外部から直接アクセス不可

    getBalance(): number {
        return this.balance;
    }
}

const account = new BankAccount();
console.log(account.getBalance()); // 1000
console.log(account.balance); // ❌ エラー: Property 'balance' is private
```

✅ **`protected`（継承先からはアクセス可能）**
```ts
class Animal {
    protected species: string;

    constructor(species: string) {
        this.species = species;
    }
}

class Dog extends Animal {
    constructor() {
        super("犬");
    }

    getSpecies(): string {
        return this.species; // `protected` なので継承先でアクセス可能
    }
}

const dog = new Dog();
console.log(dog.getSpecies()); // "犬"
console.log(dog.species); // ❌ エラー: Property 'species' is protected
```

---

## **🟢 4. 静的メソッド（`static`）**
✅ **`static` を使うと、インスタンスを作らずにメソッドを呼び出せる**
```ts
class MathUtils {
    static add(a: number, b: number): number {
        return a + b;
    }
}

console.log(MathUtils.add(10, 20)); // 30
```
✅ **メリット**
- **ユーティリティ関数をクラスの一部として管理できる**
- **インスタンス化せずに直接呼び出せる**

---

## **🟢 5. 抽象クラス（`abstract`）**
✅ **`abstract` を使うと、継承を強制できる**
```ts
abstract class Shape {
    abstract getArea(): number; // 抽象メソッド（実装を強制）

    printArea(): void {
        console.log(`面積: ${this.getArea()}`);
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

const circle = new Circle(5);
circle.printArea(); // 面積: 78.5398...
```
✅ **ポイント**
- **抽象クラスはインスタンス化できない**
- **抽象メソッドは必ずサブクラスで実装しなければならない**

---

## **🟢 6. クラスの型チェック（`instanceof`）**
✅ **`instanceof` を使うと、インスタンスの型を判定できる**
```ts
class Car {
    drive() {
        console.log("車を運転する");
    }
}

class Bike {
    ride() {
        console.log("バイクに乗る");
    }
}

function useVehicle(vehicle: Car | Bike) {
    if (vehicle instanceof Car) {
        vehicle.drive(); // `Car` のメソッドが使える
    } else {
        vehicle.ride(); // `Bike` のメソッドが使える
    }
}

const car = new Car();
const bike = new Bike();

useVehicle(car);  // 車を運転する
useVehicle(bike); // バイクに乗る
```
✅ **メリット**
- **型を安全に判定**
- **異なるクラスのインスタンスに適切な処理を実行**

---

## **🎯 まとめ**
| 機能 | 説明 |
|------|------|
| **`class`** | クラスを定義し、インスタンスを作成 |
| **`interface`** | クラスが実装すべきプロパティやメソッドを定義 |
| **コンストラクタの型** | `constructor(public name: string, private age: number) {}` |
| **`public` / `private` / `protected`** | アクセス制御 |
| **`static` メソッド** | クラスから直接呼び出せるメソッド |
| **抽象クラス (`abstract`)** | 継承を強制するクラス |
| **`instanceof`** | クラスの型チェック |

✅ **TypeScript の OOP 機能を活用して、型安全でメンテナブルなコードを書こう！🚀**