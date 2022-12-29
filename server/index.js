const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const get_tokens = require("../lexer");
const get_AST = require("../parser");
const { keywords, keyobjects, keyfunctions, lib } = require('../utils')

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager.
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true
            },
            signatureHelpProvider: {
                triggerCharacters: ["(", ","]
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.languageServerExample || defaultSettings));
    }
    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'languageServerExample'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
// TODO: error infomation
async function validateTextDocument(textDocument) {
    /*
    // In this simple example we get the settings for every validate run.
    const settings = await getDocumentSettings(textDocument.uri);

    // The validator creates diagnostics for all uppercase words length 2 and more
    const text = textDocument.getText();
    const pattern = /\b[A-Z]{2,}\b/g;
    let m: RegExpExecArray | null;

    let problems = 0;
    const diagnostics: Diagnostic[] = [];
    while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
        problems++;
        const diagnostic: Diagnostic = {
            severity: DiagnosticSeverity.Warning,
            range: {
                start: textDocument.positionAt(m.index),
                end: textDocument.positionAt(m.index + m[0].length)
            },
            message: `${m[0]} is all uppercase.`,
            source: 'ex'
        };
        if (hasDiagnosticRelatedInformationCapability) {
            diagnostic.relatedInformation = [
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range)
                    },
                    message: 'Spelling matters'
                },
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range)
                    },
                    message: 'Particularly for names'
                }
            ];
        }
        diagnostics.push(diagnostic);
    }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    */
}

connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});
var completionList = [];
function get_variables(root) {
    if (typeof (root) == "string") return;

    // variable
    if (root.type == 'variableDeclaration')
    {
        let varName = root.body[0].body[0].body[0]; // variableDeclaration -> assignable -> identifier
        completionList.push({ label: varName, kind:node_1.CompletionItemKind.Variable,})
        return;
    }
    // class
    else if (root.type == 'classDeclaration'){
        let varName = root.body[1].body[0]; // classDeclaration[1] -> identifier
        completionList.push({ label: varName, kind:node_1.CompletionItemKind.Class,})
    }
    // function
    else if (root.type == 'functionDeclaration') {
        root.body.forEach(item => {
            if (item.type == 'identifier') {
                completionList.push({ label: item.body[0], kind: node_1.CompletionItemKind.Function, });
                return;
            }
        })
    }

    root.body.forEach(element => {
        get_variables(element);
    });
}
var functionList = [];
function get_functions(root) {
    if (typeof (root) == "string") return;

    if (root.type == 'functionDeclaration') {
        // console.log("functionDeclaration");
        let son = root.body;
        let len = son.length;
        let label = '';
        let params = [];
        for (let i = 0; i < len; i++){
            if (son[i].type == 'identifier')
            {
                // console.log('qwq');
                label += son[i].body[0]; // functionname
                /*
                    formalParameterList
                    : formalParameterArg (',' formalParameterArg)* (',' lastFormalParameterArg)?
                    | lastFormalParameterArg
                    ;

                    formalParameterArg
                    : assignable ('=' singleExpression)?      // ECMAScript 6: Initialization
                    ;
                */
                while (true) {
                    i++;
                    if (son[i] == '(') label += son[i];
                    else if (son[i] == ')') {
                        label += son[i];
                        break;
                    }
                    else if (son[i].type == 'formalParameterList') {
                        label += son[i].text;

                        son[i].body.forEach(item => {
                            if (item.type == 'formalParameterArg') {
                                params.push(item.text);
                            }
                        })
                    }
                }
            }
        }
        functionList.push({ label: label, parameters: params.map(x => { return { label: x } }) });
    }
    root.body.forEach(element => {
        get_functions(element);
    });
    // console.log(functionList);
}
function get_lib(text) {
    var tokens = get_tokens(text);
    tokens = tokens.filter(item => item.text !== '<EOF>');
    const token3 = tokens.pop();
    const token2 = tokens.pop();
    const token1 = tokens.pop();

    if (token1 && token2 && token3 && token2.text == '.') {
        let libName = token1.text;
        if (libName in lib) {
            return lib[libName];
        }
    }
    return undefined;
}
// TODO: code completion
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    completionList = [];
    let document = documents.get(_textDocumentPosition.textDocument.uri);
    const text = document.getText();

    let result = get_lib(text);
    // completion lib member
    if (result) {
        console.log(result);
        if ('variables' in result) {
            result.variables.forEach(item => {
                completionList.push({ label: item, kind: node_1.CompletionItemKind.Variable, })
            })
        }
        if ('functions' in result) {
            result.functions.forEach(item => {
                completionList.push({ label: item, kind: node_1.CompletionItemKind.Function, })
            })
        }
    }
    // completion keywords etc.
    else {
        var AST = get_AST(text);
        get_variables(AST);
        keywords.forEach(item => {
            completionList.push({ label: item, kind: node_1.CompletionItemKind.Keyword, })
        });
        keyobjects.forEach(item => {
            completionList.push({ label: item, kind: node_1.CompletionItemKind.Class, })
        });
        keyfunctions.forEach(item => {
            completionList.push({ label: item, kind: node_1.CompletionItemKind.Function, })
        });
        Object.keys(lib).forEach(item => {
            completionList.push({ label: item, kind: node_1.CompletionItemKind.Class, })
        });
    }
    return completionList;
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = 'TypeScript details';
        item.documentation = 'TypeScript documentation';
    }
    else if (item.data === 2) {
        item.detail = 'JavaScript details';
        item.documentation = 'JavaScript documentation';
    }
    return item;
});
connection.onSignatureHelp((SignatureHelpParams) => {
    let document = documents.get(SignatureHelpParams.textDocument.uri);
    const text = document.getText();
    let resultText = '';
    let toMatchText = undefined;
    text.split('\n').forEach((line, index) => {
        if (index == SignatureHelpParams.position.line) {
            // 此处的匹配是有问题的，应该判断函数去掉已有参数部分的名称，并且前导的乱七八糟的东西都得去掉
            toMatchText = line;
        }
        else {
            resultText += line + '\n';
        }
    });
    var AST = get_AST(resultText);
    functionList = [];
    get_functions(AST);
    console.log(functionList);
    resultList = {
        signatures: [],
        activeSignature: 0,
        activeParameter: 0
    };

    try
    {
        const function_statement_tokens = get_tokens(toMatchText);
        const function_name = function_statement_tokens.filter(item => item.type == 'Identifier')[0].text;
        const cursor_position = SignatureHelpParams.position.character;
        const comma_count = function_statement_tokens.filter(item => item.type == 'Comma' && item.start < cursor_position).length;
        resultList.activeParameter = comma_count;

        functionList.forEach(item => {
            if (item.label.startsWith(function_name)) {
                // 这里应该考虑参数的匹配，已输入的参数的数量
                resultList.signatures.push(item);
            }
        });
        return resultList;
    } catch (error) {
        return {
            signatures: [],
            activeSignature: 0,
            activeParameter: 0
        };
    }

    // return {
    //     signatures: [
    //         {
    //             label: 'QwQSignature(qwq0, qwq1)',
    //             documentation: 'QwQSignature documentation, a sample function signature',
    //             parameters: [
    //                 {
    //                     label: 'qwq0',
    //                     documentation: 'qwq0 documentation'
    //                 },
    //                 {
    //                     label: 'qwq1',
    //                     documentation: 'qwq1 documentation'
    //                 }
    //             ]
    //         }
    //     ],
    //     activeSignature: 0,
    //     activeParameter: 0
    // };
})

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map