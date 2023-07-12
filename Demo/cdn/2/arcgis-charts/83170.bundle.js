"use strict";(self.webpackChunkexb_client=self.webpackChunkexb_client||[]).push([[83170],{83170:(e,t,a)=>{a.r(t),a.d(t,{additionalProperty:()=>P,anyOfValues:()=>x,bubbleChartValidateMsg:()=>E,default:()=>q,defaultError:()=>i,defaultInvalidChart:()=>s,duplicateSeriesID:()=>u,enumValues:()=>g,gaugeCannotExceedLimit:()=>b,histogramEmptyField:()=>y,invalidSeriesType:()=>I,layerLoadFailure:()=>m,lineChartMarkersCannotExceedLimit:()=>k,lineChartSeriesAndMarkersCannotExceedLimit:()=>D,maxItems:()=>L,minItems:()=>c,minLength:()=>h,negativeValueInDataForLogTransformation:()=>l,negativeValueInDataForSqrtTransformation:()=>d,nonNumericAggregation:()=>$,or:()=>v,pieChartCannotHaveMixtureOfPositiveAndNegativeSlices:()=>f,pieChartSlicesCannotExceedLimit:()=>V,queryError:()=>S,requiredProperty:()=>C,threePlusSeriesBarCountCannotExceedLimit:()=>o,twoSeriesBarCountCannotExceedLimit:()=>n,uniqueSeriesBarCountCannotExceedLimit:()=>r,whiteSpacePattern:()=>p});const i="チャートの読み込み中にエラーが発生しました。",r="このチャートには、合計 ${ elementCount } 個のバーがあります。 系列が 1 つのバー チャートは、${ totalLimit } バーに制限されます。 個別値の数が少ないカテゴリ フィールドを選択するか、データにフィルターを適用してください。",n="系列が 2 つのバー チャートは、${ totalLimit } バー、または系列あたり ${ seriesLimit } バーに制限されます。 個別値の数が少ないカテゴリ フィールドを選択するか、データにフィルターを適用してください。",o="系列が 3 つ以上のバー チャートは、${ totalLimit } バー、または系列あたり ${ seriesLimit } バーに制限されます。 個別値の数が少ないカテゴリ フィールドを選択するか、データにフィルターを適用してください。",s="チャートの作成中にエラーが発生しました。",l="対数変換は負またはゼロの値に適用できません。",d="平方根変換は負の値に適用できません。",m="レイヤーの読み込み中にエラーが発生しました。 URL = ${ url } ポータル アイテム ID = ${ portalItemId }",u="${ dataPath } は一意である必要があります。 ${ seriesName } という系列の ID (${ seriesID }) は、別の系列ですでに使用されています。",$="${ dataPath } は、数値以外のフィールドで、個数以外の集約を実行することはできません。",C="${ dataPath } に ${ missingProperty } というプロパティがありません。",h="${ dataPath } は ${ limit } 文字以上である必要があります。",c="${ dataPath } のアイテムは ${ limit } 以上にする必要があります。",L="${ dataPath } のアイテムは ${ limit } 以下にする必要があります。",p="${ dataPath } には空白以外の文字が 1 つ以上含まれている必要があります。",P="${ dataPath } が ${ additionalProperty } を持つことはできません。",g="${ dataPath } は、次のいずれかの許可された値と等しい必要があります: ${ allowedValues }",x="${ dataPath } は、次のいずれかのスキーマと一致する必要があります: ${ schemaOptions }",E="比例シンボルを使用した散布図はサポートされていません。 デフォルトのシンボル サイズが適用されています。",S="入力データを読み取れません。",y="ヒストグラムには、少なくとも 2 つの数値が必要です。",I="インデックス ${ seriesIndex } で必要な系列タイプは ${ expectedType } ですが、代わりに ${ receivedType } が指定されました",v="または",f="選択された数値フィールドの合計値から返される値がすべて正の値であるか、すべて負の値であることを確認します。",V="このチャートには合計 ${ sliceCount } 個のスライスがあります。 パイ チャートのスライス数は ${ totalLimit } に制限されています。 個別値の数が少ないカテゴリ フィールドを選択するか、追加する数値フィールドの数を減らすか、データにフィルターを適用してください。",b="フィーチャ ベースのゲージは ${ totalLimit } 個のフィーチャに制限されています。 データをフィルター処理してください。",D="このチャートには、合計で ${ seriesCount } 個のシリーズと ${ elementCount } 個のデータ ポイントがあります。 ライン チャートは ${ seriesLimit } 個のシリーズと ${ totalLimit } 個のデータ ポイントに制限されています。 シリーズの数を減らしたり、データの再集約またはフィルター処理を実行したりします。",k="ライン チャートは ${ totalLimit } 個のデータ ポイントに制限されています。 データをフィルタリングまたは再集約して、もう一度やり直してください。";var q={defaultError:"チャートの読み込み中にエラーが発生しました。",uniqueSeriesBarCountCannotExceedLimit:r,twoSeriesBarCountCannotExceedLimit:n,threePlusSeriesBarCountCannotExceedLimit:"系列が 3 つ以上のバー チャートは、${ totalLimit } バー、または系列あたり ${ seriesLimit } バーに制限されます。 個別値の数が少ないカテゴリ フィールドを選択するか、データにフィルターを適用してください。",defaultInvalidChart:"チャートの作成中にエラーが発生しました。",negativeValueInDataForLogTransformation:"対数変換は負またはゼロの値に適用できません。",negativeValueInDataForSqrtTransformation:"平方根変換は負の値に適用できません。",layerLoadFailure:m,duplicateSeriesID:u,nonNumericAggregation:"${ dataPath } は、数値以外のフィールドで、個数以外の集約を実行することはできません。",requiredProperty:C,minLength:h,minItems:c,maxItems:L,whiteSpacePattern:"${ dataPath } には空白以外の文字が 1 つ以上含まれている必要があります。",additionalProperty:"${ dataPath } が ${ additionalProperty } を持つことはできません。",enumValues:g,anyOfValues:x,bubbleChartValidateMsg:"比例シンボルを使用した散布図はサポートされていません。 デフォルトのシンボル サイズが適用されています。",queryError:"入力データを読み取れません。",histogramEmptyField:"ヒストグラムには、少なくとも 2 つの数値が必要です。",invalidSeriesType:I,or:"または",pieChartCannotHaveMixtureOfPositiveAndNegativeSlices:"選択された数値フィールドの合計値から返される値がすべて正の値であるか、すべて負の値であることを確認します。",pieChartSlicesCannotExceedLimit:V,gaugeCannotExceedLimit:b,lineChartSeriesAndMarkersCannotExceedLimit:D,lineChartMarkersCannotExceedLimit:"ライン チャートは ${ totalLimit } 個のデータ ポイントに制限されています。 データをフィルタリングまたは再集約して、もう一度やり直してください。"}}}]);