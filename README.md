## 语法高亮

修改`./extension.js`中的`getTokenType`函数，对不同的 antlr4 token type 返回不同的 vscode token type。

## 自动补全

修改`./server/index.js`中的`connection.onCompletion`回调函数