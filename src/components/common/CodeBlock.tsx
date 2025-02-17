import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = "javascript" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle long URLs by adding word breaks at appropriate places
  const processCode = (input: string) => {
    return (
      input
        // Insert zero-width spaces after certain characters in URLs to allow better wrapping
        .replace(/(https?:\/\/[^\s"]+)/g, (url) =>
          url.replace(/([\/._])/g, "$1\u200B")
        )
    );
  };

  const formattedCode = processCode(code);

  return (
    <div className="rounded-lg overflow-hidden bg-gray-700 shadow-lg my-4 w-full max-w-full">
      {/* Header - simplified for mobile */}
      <div className="flex items-center justify-between px-2 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="ml-1 text-xs font-mono text-gray-400 truncate max-w-[80px] sm:max-w-none">
            {"html"}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
        >
          {copied ? (
            <Check size={13} className="text-green-400" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>

      {/* Code content with strict width control */}
      <div className="overflow-auto max-h-[40vh] max-w-full">
        <pre className="p-2 font-mono text-sm leading-normal text-gray-300 break-all">
          <code className="whitespace-pre-wrap break-all overflow-hidden">
            {formattedCode}
          </code>
        </pre>
      </div>
    </div>
  );
};

interface CodeBlockDemoProps {
  code: string;
}

const CodeBlockDemo = ({ code }: CodeBlockDemoProps) => {
  const formatScriptTags = (input: string) => {
    // First handle the case of adjacent script tags
    let formatted = input;

    // Add line breaks for adjacent script tags
    if (formatted.includes("><script")) {
      formatted = formatted.replace(/><script/g, ">\n<script");
    }

    // Break long script tags over multiple lines
    formatted = formatted.replace(
      /(<script\s)([^>]+)(>)/g,
      (_, start, attrs, end) => {
        // Split attributes for better mobile display
        if (attrs.length > 30) {
          const formattedAttrs = attrs
            .replace(/(\s+src=")([^"]+)(")/g, "\n  $1$2$3")
            .replace(/(\?token=)([^"]+)/g, "$1\n  $2");
          return `${start}${formattedAttrs}${end}`;
        }
        return `${start}${attrs}${end}`;
      }
    );

    return formatted;
  };

  const sampleCode = formatScriptTags(code);

  return (
    <div className="w-full max-w-full overflow-hidden">
      <CodeBlock code={sampleCode} language="html" />
    </div>
  );
};

export default CodeBlockDemo;
