const path = require("path");
const vscode = require("vscode");
const node = require("vscode-languageclient/node");
const get_tokens = require("./lexer");

let client;
const tokenTypes = [
    'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
    'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
    'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
];
const tokenModifiers = [
    'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
    'modification', 'async'
];
function getTokenType(token_type) {
    if (["SingleLineComment", "MultiLineComment"].includes(token_type))
        return "comment";
    else if (["This", "With", "Default", "If", "Throw", "Delete", "In", "Try", "As", "From", "Class", "Enum", "Extends", "Super", "Export", "Import", "Async", "Await", "Yield", "Implements", "Private", "Public", "Interface", "Package", "Protected", "Static", "Break", "Do", "Instanceof", "Typeof", "Case", "Else", "New", "Var", "Catch", "Finally", "Return", "Void", "Continue", "For", "Switch", "While", ].includes(token_type))
        return "keyword";
    else if ([ "StringLiteral", "BackTick", "TemplateStringStartExpression", "TemplateStringAtom"].includes(token_type))
        return "string";
    else if (["DecimalLiteral", "HexIntegerLiteral", "OctalIntegerLiteral", "OctalIntegerLiteral2", "BinaryIntegerLiteral", "BigHexIntegerLiteral", "BigOctalIntegerLiteral", "BigBinaryIntegerLiteral", "BigDecimalIntegerLiteral"].includes(token_type))
        return "number";
    else if (["OpenBracket", "CloseBracket", "OpenParen", "CloseParen", "OpenBrace", "CloseBrace", "SemiColon", "Comma", "Assign", "QuestionMark", "QuestionMarkDot", "Colon", "Ellipsis", "Dot", "PlusPlus", "MinusMinus", "Plus", "Minus", "BitNot", "Not", "Multiply", "Divide", "Modulus", "Power", "NullCoalesce", "Hashtag", "RightShiftArithmetic", "LeftShiftArithmetic", "RightShiftLogical", "LessThan", "MoreThan", "LessThanEquals", "GreaterThanEquals", "Equals_", "NotEquals", "IdentityEquals", "IdentityNotEquals", "BitAnd", "BitXOr", "BitOr", "And", "Or", "MultiplyAssign", "DivideAssign", "ModulusAssign", "PlusAssign", "MinusAssign", "LeftShiftArithmeticAssign", "RightShiftArithmeticAssign", "RightShiftLogicalAssign", "BitAndAssign", "BitXorAssign", "BitOrAssign", "PowerAssign", "ARROW"].includes(token_type))
        return "enum";
    else if (["Debugger", "FunctionObject", "StrictLet", "NonStrictLet", "Const"].includes(token_type))
        return "function";
    else if (["Identifier"].includes(token_type))
        return "variable";
    else
        return "variable";
}

const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
const provider = {
    provideDocumentSemanticTokens(document) {
        // analyze the document and return semantic tokens
        const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
        const text = document.getText();
        const tokens = get_tokens(text);
        console.log(tokens)
        tokens.forEach(token => {
            const tokenType = getTokenType(token.type);
            const tokenModifiers = [];
            if (document.positionAt(token.start).line == document.positionAt(token.stop).line)
            {
                const range = new vscode.Range(token.line - 1, token.column, token.line - 1, token.column + token.text.length);
                tokensBuilder.push(range, tokenType, tokenModifiers);
            }
            else {
                // multiline token
                console.log(token)
                const start = document.positionAt(token.start);
                const end = document.positionAt(token.stop);
                // for each line
                for (let i = start.line; i <= end.line; i++) {
                    const startCharacter = 0;
                    const endCharacter = document.lineAt(i).text.length;
                    const range = new vscode.Range(i, startCharacter, i, endCharacter);
                    tokensBuilder.push(range, tokenType, tokenModifiers);
                }
            }
        });
        return tokensBuilder.build();
    },
};
function startSemanticTokensProvider(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: "custom_javascript" }, provider, legend));
}
function activate(context) {
    startSemanticTokensProvider(context);
    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join("server", "index.js"));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: "file", language: "custom_javascript" }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };
    // Create the language client and start the client.
    client = new node.LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map