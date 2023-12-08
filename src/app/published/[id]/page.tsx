import { DateTime } from "luxon";
// TODO: extract markdown logic to a shared component!
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

import { sql } from "@/app/lib/server/db";
import style from "@/app/dashboard/@content/markdown-styles.module.css";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

async function getNote(note_id: string) {
  const noteRes = await sql(
    "select n.*, u.username from notes n inner join users u on n.user_id = u.id where n.id = $1",
    [note_id]
  );
  return noteRes.rows[0];
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const note = await getNote(id);

  const syntaxTheme = oneLight;

  // TODO: extract MarkdownComponents to a separate file
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
    <article className="container mx-auto px-2 py-6 divide-y-4 divide-gray-300">
      {/* TODO: extract to a shared component */}
      <dl className="text-md leading-tight text-gray-600 py-2 flex flex-wrap">
        <dt className="font-bold w-1/5">Title:</dt>
        <dd className="text-gray-900 w-4/5">{note.title}</dd>

        <dt className="font-bold w-1/5">Author:</dt>
        <dd className="text-gray-900 w-4/5">{note.username}</dd>

        <dt className="font-bold w-1/5">Last Updated:</dt>
        <dd className="text-gray-900 w-4/5">
          {DateTime.fromJSDate(note.updated_at).toLocaleString(
            DateTime.DATE_SHORT
          )}
        </dd>
      </dl>

      <div className="py-2">
        <ReactMarkdown
          className={style.reactMarkdown}
          components={MarkdownComponents}
          remarkPlugins={[[remarkGfm, { singleTilde: false, tablePipe: true }]]}
        >
          {note.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
