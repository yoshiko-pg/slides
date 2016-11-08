もうすぐ年末ですね！
もうすぐ2017年ですね！
もうすぐES2017の確定ですね！
ちょっと味見してみましょう :yum:

自己紹介

ES2017ってどうやって決まるの？
ES2016以降の策定フロー
JavaScriptの仕様であるECMAScriptには新しい提案が次々とされていきます
提案は以下のStageに従って進んでいきます

Stage 0: Strawman
  アイデア
Stage 1: Proposal
  プロポーザルの目的や解決方法を示す
  Polyfillやデモ等を用いて解説する
Stage 2: Draft
  いわゆるドラフト
  ECMAScript標準と同じルールでAPIや構文、セマンティックについて説明していなければならない
Stage 3: Candidate
  仕様は完成した状態
  実装や外部のフィードバックを求める状態
  レビュアはその仕様策定者以外ならだれでもなれるが専門的な知識を持っている必要がある
  ECMAScriptのエディタがチェックする必要があり
Stage 4: Finished
  2つの実装(not Polyfill)が必要
  ECMAScriptへ取り込まれる準備が完了したことを示す状態
  ECMAScriptのエディタがチェックする必要があり

https://tc39.github.io/process-document/
http://efcl.info/2015/10/18/ecmascript-paper/

2016年中にStage4に入った機能がES2017となる
ES2016では1月に入れる機能のフリーズ、3月に仕様のスナップショット、6月のGAのあとに正式リリースとなった

In 2017, the first one will be held on 13-14 June in Europe (probably in Montreux) and the second one on 6-7 December in Japan.
http://www.ecma-international.org/memento/GA.htm

おそらく2017年1月には入る機能の確定（実質もう確定してる？）、6月にリリースになるのでは？

そんなES2017に入る機能たちを味見してみよう！

Stage4に入りfinished proposalsとなった機能はここから
https://github.com/tc39/proposals/blob/master/finished-proposals.md

-----------------------

# ES2016

- Array.prototype.includes
- Exponentiation Operator (\*\*)

# ES2017

- Object.values/Object.entries
- String padding
- Object.getOwnPropertyDescriptors
- Trailing commas in function parameter lists and calls
- Async Functions


## Object.values/Object.entries

Object.keysの仲間
valuesは値の配列を返す
entriesはキーと値が配列になった配列を返す

返るのは"与えられたオブジェクト自身に存在する列挙可能なプロパティ"
hasOwnProperties && enumerable

## String padding

## Object.getOwnPropertyDescriptors

## Trailing commas in function parameter lists and calls

## Async Functions


