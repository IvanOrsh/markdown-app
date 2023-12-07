"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import AceEditor from "react-ace";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PrismLight as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import rangeParser from "parse-numeric-range";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { fetchNote, updateNote } from "@/app/lib/client/api";
import { type NoteData } from "@/app/lib/client/types";
import { useNotesDispatch } from "@/app/contexts/notes-context";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-min-noconflict/theme-github";

import style from "./markdown-styles.module.css";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

export default function Page() {
  const searchParams = useSearchParams();
  const [curNote, setCurNote] = useState<NoteData | null>(null);

  const dispatch = useNotesDispatch();

  const syntaxTheme = oneLight;

  async function refreshNote(note_id: string) {
    console.log("refresh note:", note_id);

    const note = await fetchNote(note_id);
    setCurNote(note);
  }

  const handleUpdateNote = useDebouncedCallback(async (note: NoteData) => {
    const updatedNote = await updateNote(note);
    dispatch({
      type: "update_note",
      payload: updatedNote,
    });
  }, 350);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newNote = {
      ...curNote!,
      title: e.target.value,
    };

    setCurNote(newNote);
    await handleUpdateNote(newNote);
  }

  async function handleMarkdownChange(newMarkdown: string) {
    const newNote = {
      ...curNote!,
      content: newMarkdown,
    };
    setCurNote(newNote);
    await handleUpdateNote(newNote);
  }

  useEffect(() => {
    console.log(searchParams);
    const note_id = searchParams.get("note_id");
    console.log("content container:", note_id);

    if (note_id !== null && curNote?.id !== note_id) {
      refreshNote(note_id);
    }
  }, [searchParams, curNote]);

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: SyntaxHighlighterProps) {
      const hasLang = /language-(\w+)/.exec(className || "");
      const hasMeta = node?.data?.meta;

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/;
          const metadata = node.data.meta?.replace(/\s/g, "");
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)![1]
            : "0";
          const highlightLines = rangeParser(strlineNumbers);
          const highlight = highlightLines;
          const data = highlight.includes(applyHighlights) ? "highlight" : null;
          return { data };
        } else {
          return {};
        }
      };

      return hasLang ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={hasLang[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          wrapLines={hasMeta}
          useInlineStyles={true}
          lineProps={applyHighlights}
        >
          {props.children}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} />
      );
    },
  };

  return (
    <div className="flex-auto w-2/3">
      {curNote && (
        <div className="p-2 w-full space-y-2">
          <div>
            <label
              htmlFor="title"
              className="text-gray-500 dark:text-gray-300 font-bold text-sm"
            >
              Title:
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={curNote.title}
              onChange={handleChange}
              className="text-xl font-bold p-2 text-gray-800 dark:text-gray-300 focus:outline-gray-500 w-full"
            />
          </div>

          {/* markdown editor */}
          <div className="flex flex-col gap-y-4 xl:flex-row xl:gap-x-2">
            {/* editor */}
            <div className="flex-1 ">
              <AceEditor
                mode="markdown"
                theme="github"
                name="markdown-editor"
                onChange={handleMarkdownChange}
                value={curNote.content}
                width="100%"
                height="50vh"
                wrapEnabled={true}
                fontSize="22px"
              />
            </div>

            {/* TODO: extract to a separate component */}
            <div className="flex-1">
              <ReactMarkdown
                className={style.reactMarkdown}
                components={MarkdownComponents}
                remarkPlugins={[
                  [remarkGfm, { singleTilde: false, tablePipe: true }],
                ]}
              >
                {curNote.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
