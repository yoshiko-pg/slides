---
marp: true
size: 16:9
style: |
  @import url('../global-assets/utils.css');
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
section{
  font-family: 'Noto Sans JP', sans-serif;
}
pre, code {
  line-height: 1.5;
}

.kontomo {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.kontomo::before {
  content: 'こんなの友達じゃ\Aないですよね？？';
  white-space: pre;
  font-weight: bold;
  color: white;
  font-size: 120px;
}
.title {
  background-color: rgba(255,255,255,0.85);
  position: absolute;
  right: 0;
  top: 55%;
  padding: 12px 80px 30px 80px;
  line-height: 0.4;
  text-align: right;
}
</style>

<div class="title">

# AIでつくるオーダーメイド親友

@yoshiko &nbsp;− &nbsp;2025/07/13 &nbsp;  CoLab Conf　

</div>

![bg](./assets/slide.png)

---

![bg center center](../global-assets/profile.png)

---

ZennのAIカテゴリで、次トークするmizchiさんの全部賭けろ記事に次いで2位になってます

---

## 今日話すこと

友達づくりを通して、AIチャットの基本的な仕組みと実装方法を学ぼう！

まず各セクションの「何するの？」で汎用的なAIチャットの仕組みを解説します。

そのあとの実装は主に自分の慣れているフロントエンド周りの技術で作りますが
仕組みを理解してもらえていれば、どの言語/技術で作っても同じです。

オリジナリティのあるAIチャットはどうやって作るんだろう？がわかる発表になれば！

---

# 脳をつくる

![bg right center 80%](./assets/1-brain/cover.png)

---

## 脳をつくる  ―  何するの？

- クラウドAIにカスタム指示をつけたAIエージェント(※)をつくる
- AIエージェントにテキストを送って、返ってきたテキストを見る
- 会話履歴をデータベースに保存する

<br />

まずは言葉を交わせるようになりましょう！

<br />

<small>
※ 一般的に会話だけのAIチャットはAIエージェントとは呼ばないことが多いです。<br />
　 今回は素のクラウドAIとの区別のため、内部の技術的な呼称(agent)を引用しています
</small>

---

## 脳をつくる  ―  実装

Mastraでエージェントのコア部分を作ります。

MastraはTypeScript製のエージェントフレームワークで、
AIエージェントをつくるのに便利な機能が標準搭載されています。

```sh
npx create-next-app my-app
cd my-app
npx mastra init
```

`npx create-mastra@latest` でMastra単体のAPIサーバーを作ることもできますが、
今回は Next.js ベースのプロジェクトの中に mastra のSDKをセットアップします

---

## 脳をつくる  ―  実装

<div class="columns">

<div>

`src/app` と `src/mastra` ができます。
（`src/app` はNext.js App Router）

`.env` に使いたいAIモデルのAPI Keyを設定します

<small>
全手順: <a href="https://mastra.ai/ja/docs/frameworks/web-frameworks/next-js">https://mastra.ai/ja/docs/frameworks/web-frameworks/next-js</a>
</small>

</div>

![](./assets/1-brain/files.png)

</div>

---

## 脳をつくる  ―  実装

`npm run dev:mastra` でMastraのPlayground画面を立ち上げられます
最初はサンプルのWeather Agentが入っているはず
疎通を試してみましょう。チャット欄から会話してみて話せればOK！

![](./assets/1-brain/mastra.png)

---

## 脳をつくる  ―  実装

<br />

![](./assets/1-brain/failed.png)


---

<div class="kontomo" ></div>

## 脳をつくる  ―  実装

<br />

![](./assets/1-brain/failed.png)

</section>

---

## 脳をつくる  ―  解説

<div class="columns">

<div>
WeatherAgentのシステムプロンプトが「天気情報提供アシスタント」だったのでこんな返答になっちゃいました。<br />
<br />
一般的なAIチャットでは、事前の役割定義や条件付けとなる「システムプロンプト」と、ユーザーからの毎回のチャット入力を繋ぎ合わせてAIに入力します。<br >
モデルやチャット入力が同じでも、役割定義次第で返答は変わってきます。
</div>

<div>

![](./assets/1-brain/ai.png)

<small>
システムプロンプトを工夫して、<br />欲しい出力を得ることが<br />代表的なプロンプトエンジニアリングです
</small>

</div>

</div>

---


## 脳をつくる  ―  実装

サンプルは消してオリジナルの友達エージェントを作ってみましょう！
`mastra/agents/friend.ts` を作ります

```ts
export const friendAgent = new Agent({
  name: 'ともだちエージェント',
  instructions: `あなたはユーザーととても仲の良い友達です。落ち着いた話し方をします。`,
  model: openai('gpt-4o'),
});
```

`instructions` にシステムプロンプト（性格、話し方など）を指定できます
`model` で使うモデルを選べます。GeminiもClaudeもGrokもいけます（要.env KEY）

---

## 脳をつくる  ―  実装

`mastra/index.ts` でmastraから友達エージェントを使えるように組み込みます
このファイルがMastraの起点となるファイルです

```ts
export const mastra = new Mastra({
  agents: { friendAgent },
  storage: new LibSQLStore({ url: "file:../mastra.db" }),
});
```

`storage` にデータベースを指定することで会話データを永続化できます。
（これがないとサーバーを起動するたびに過去の履歴が消えてしまいます）

---

## 脳をつくる  ―  実装

<br />

![](./assets/1-brain/friend.png)

---

## 脳をつくる  ―  やったこと

<div class="image">

<div>

- クラウドAIにカスタム指示をつけた<br />AIエージェントをつくる
- AIエージェントにテキストを送って、<br />返ってきたテキストを見る
- 会話履歴をデータベースに保存する

<br />

Mastraを使って簡単にAIとやりとりができました！

</div>

![](./assets/1-brain/cover.png)

</div>

---

# 顔をつくる

![bg right center 80%](./assets/2-face/cover.png)

---

## 顔をつくる  ―  何するの？

やりとりはできるようになったけど…　Playgroundはあまりにも管理画面すぎる。。

![](./assets/2-face/playground.png)

---

<div class="kontomo" ></div>

## 顔をつくる  ―  何するの？

やりとりはできるようになったけど…　Playgroundはあまりにも管理画面すぎる。。

![](./assets/2-face/playground.png)

---

## 顔をつくる  ―  何するの？

- 友達エージェントとやりとりできるチャット画面を作る
- 普段使うメッセージアプリみたいな、親しみやすい見た目にしてみよう！


---

## 顔をつくる  ―  何するの？

- 友達エージェントとやりとりできるチャット画面を作る
- 普段使うメッセージアプリみたいな、親しみやすい見た目にしてみよう！

<br />

<center>
<h1>Vibe Codingチャンス！！</h1>

<br />
<small>
※ Vibe Coding = 人間がコードを書かずにAIへの指示中心で進める開発手法のこと
</small>
</center>

---

## 顔をつくる  ―  実装

Claude Code（または好みのコーディングエージェント）に頼んでみましょう

```
Next.jsのトップページを、MastraのfriendAgentとチャットできる画面にして。
普段使うメッセージアプリみたいな、親しみのあるデザインがいい。
streamで返ってくるAPIを作って、@ai-sdk/react の useChat を使って実装して。
リロードしても同じスレッドでやりとりできるようにthreadIdを固定して。
```

ReactならVercel AI SDKのuseChatを使うのがおすすめです。

<small>
mastra使うならClaudeにDocsのMCPサーバー登録しておくとスムーズかも<br />
<code>claude mcp add mastra-docs npx @mastra/mcp-docs-server</code>
</small>

---
<style scoped>
  section { background-color: #333; }
  img { height : 60vh; }
</style>

<div class="columns">

<center>

![](./assets/2-face/chat-1.png)

</center>


<center>

![](./assets/2-face/chat-2.png)

</center>

</div>

---

## 顔をつくる  ―  実装

ちなみにAPIの実装は必要最低限これだけ

```ts
export async function POST(req: Request) {
  const { messages } = await req.json();
  const friendAgent = mastra.getAgent("friendAgent");
  const stream = await friendAgent.stream([messages.at(-1)], {
    memory: {
      thread: "default", // 任意のスレッドID
      resource: "default-user", // 任意のユーザーID
    },
  });
  return stream.toDataStreamResponse();
}
```


---

## 顔をつくる  ―  実装

アクセスしたときに過去の会話履歴も表示されてほしいですね

```
useChatでチャット画面表示するとき、過去のチャット履歴も表示できるようにして。
threadId/resourceIdはroute.tsにある内容で
```

履歴取得用のAPIを作ってクライアントから呼んで表示してくれるはず。
もしくはサーバーサイドで取得してuseChatのinitialMessagesに渡してもOK

---

## 顔をつくる  ―  やったこと

<div class="image">

<div>

- おしゃべり用のメッセージWebアプリを作る
- 会話履歴を表示する
- 会話の送信と受信をする

<br />

Vibe Codingで簡単に専用画面ができました！

</div>

![](./assets/2-face/cover.png)

</div>

---


# 記憶をつくる

![bg right center 80%](./assets/3-memory/cover.png)

---

## 記憶をつくる  ―  何するの？

素のAI（LLM）には記憶を保持する仕組みがありません。ステートレスです。
入力文（コンテキスト）だけが可変なので、全情報をそこに入れる必要があります。

ChatGPTなどのチャットAIは、スレッドの全履歴を毎回送って記憶保持しています。
それゆえ、ひとつのスレッドを長くし続けることはできません。
今のスレッドで文章量の上限に達したら、新しいスレッドを作る必要があります。

---
<style scoped>
section { background-color: black; }
</style>

![bg center center contain 80%](./assets/3-memory/over.png)



---
<style scoped>
section { background-color: black; }
</style>

<div class="kontomo" ></div>

![bg center center contain 80%](./assets/3-memory/over.png)

---

## 記憶をつくる  ―  何するの？

普段使うメッセージアプリのように、ひとつの流れの中でずっとやりとりしたい。

常に直近10メッセージだけを送る、というふうにすれば実現できます！
送信対象がスライドしていくのでスライディングウインドウ方式などと呼ばれます。
（1件送るごとに古いメッセージが1件コンテキストから消える）


---
<style scoped>
  .fukidashi {
    padding: 16px 32px;
    border-radius: 20px;
    width: fit-content;
    margin-top: -46px
  }
  .fukidashi.ai {
    background-color: #eee;
    border-bottom-left-radius: 0;
  }
  .fukidashi.user {
    background-color: #4357aa;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 0;
  }
  center { margin: 60px 0 120px;}
  .wrapper { width: 90%; margin: 0 auto; }
</style>

## 記憶をつくる  ―  何するの？
<br />

<div class="wrapper">

<p class="fukidashi ai">
今日は何する予定なの？
</p>
<p class="fukidashi user">
今日は美容院に行く予定なんだよね〜
</p>
<center>
........10件やりとり後.......
</center>
<p class="fukidashi ai">
それで、今日は何する予定なの？
</p>
<p class="fukidashi user">
（さっき言ったじゃん！！）
</p>

</div>

---
<style scoped>
  .fukidashi {
    padding: 16px 32px;
    border-radius: 20px;
    width: fit-content;
    margin-top: -46px
  }
  .fukidashi.ai {
    background-color: #eee;
    border-bottom-left-radius: 0;
  }
  .fukidashi.user {
    background-color: #4357aa;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 0;
  }
  center { margin: 60px 0 120px;}
  .wrapper { width: 90%; margin: 0 auto; }
</style>

<div class="kontomo"></div>

## 記憶をつくる  ―  何するの？
<br />

<div class="wrapper">

<p class="fukidashi ai">
今日は何する予定なの？
</p>
<p class="fukidashi user">
今日は美容院に行く予定なんだよね〜
</p>
<center>
........10件やりとり後.......
</center>
<p class="fukidashi ai">
それで、今日は何する予定なの？
</p>
<p class="fukidashi user">
（さっき言ったじゃん！！）
</p>

</div>

---

## 記憶をつくる  ―  何するの？

- 友達エージェントとやりとりできるチャット画面を作る
- 普段使うメッセージアプリみたいな、親しみやすい見た目にしてみよう！

<br />

<center>
<h1>Vibe Codingチャンス！！</h1>

<br />
<small>
※ Vibe Coding = 人間がコードを書かずにAIへの指示中心で進める開発手法のこと
</small>
</center>

---

## 記憶をつくる  ―  実装

Claude Code（または好みのコーディングエージェント）に頼んでみましょう

```
Next.jsのトップページを、MastraのfriendAgentとチャットできる画面にして。
普段使うメッセージアプリみたいな、親しみのあるデザインがいい。
streamで返ってくるAPIを作って、@ai-sdk/react の useChat を使って実装して。
リロードしても同じスレッドでやりとりできるようにthreadIdを固定して。
```

ReactならVercel AI SDKのuseChatを使うのがおすすめです。

<small>
mastra使うならClaudeに <a href="https://mastra.ai/ja/docs/getting-started/mcp-docs-server">MastraDocsのMCPサーバー</a>登録しておくとスムーズかも<br />
<code>claude mcp add mastra-docs npx @mastra/mcp-docs-server</code>
</small>

---
<style scoped>
  section { background-color: #333; }
  img { height : 60vh; }
</style>

<div class="columns">

<center>

![](./assets/2-face/chat-1.png)

</center>


<center>

![](./assets/2-face/chat-2.png)

</center>

</div>

---

## 記憶をつくる  ―  実装

ちなみにAPIの実装は必要最低限これだけ

```ts
export async function POST(req: Request) {
  const { messages } = await req.json();
  const friendAgent = mastra.getAgent("friendAgent");
  const stream = await friendAgent.stream(messages, {
    memory: {
      thread: "default", // 任意のスレッドID
      resource: friendAgent.id,
      options: { lastMessages: 10 }, // 10メッセージを取得
    },
  });
  return stream.toDataStreamResponse();
}
```


---

## 記憶をつくる  ―  実装

アクセスしたときに過去の会話履歴も表示されてほしいですね

```
useChatでチャット画面表示するとき、過去のチャット履歴も表示できるようにして。
threadId/resourceIdはroute.tsにある内容で
```

---

## 記憶をつくる  ―  やったこと

<div class="image">

<div>

- おしゃべり用のメッセージWebアプリを作る
- 会話履歴を表示する
- 会話の送信と受信をする

<br />

Vibe Codingで簡単に専用画面ができました！

</div>

![](./assets/2-face/cover.png)

</div>

---