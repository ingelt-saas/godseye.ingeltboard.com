import ExampleTheme from "./Theme";
import { $createParagraphNode, $getRoot, $getSelection } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import './RichEditor.css';
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function Placeholder() {
    return <div className="editor-placeholder">Enter content...</div>;
}

const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode
    ]
};

const CustomClearPlugin = ({ content }) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        editor.update(() => {
            if (!content) {
                const root = $getRoot();
                const paragraph = $createParagraphNode();
                root.clear();
                root.append(paragraph);
            }
        });
    }, [content, editor]);
    return null;
}

const InitialTextSetPlugin = ({ content }) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        editor.update(() => {
            if (content) {
                const parser = new DOMParser();
                const dom = parser.parseFromString(content, 'text/html');
                const root = $getRoot();
                const nodes = $generateNodesFromDOM(editor, dom);
                root.select();
                const selection = $getSelection();
                selection.insertNodes(nodes);
            }
        });
    }, [content]);
    return null;
}


export default function RichEditor({ changeHandler, content, initialContent }) {

    const onChange = (editorState, RichEditor) => {
        RichEditor.update(() => {
            const rawHTML = $generateHtmlFromNodes(RichEditor, null)
            const editorStateTextString = editorState.read(() =>
                $getRoot().getTextContent()
            );
            changeHandler(rawHTML, editorStateTextString);
        });
    }

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="text-black w-full border-2 rounded-md overflow-hidden">
                <ToolbarPlugin />
                <div className="relative bg-white border-t-2">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <AutoLinkPlugin />
                    <CustomClearPlugin content={content} />
                    <InitialTextSetPlugin content={initialContent} />
                    <OnChangePlugin onChange={onChange} />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                </div>
            </div>
        </LexicalComposer>
    );
}
