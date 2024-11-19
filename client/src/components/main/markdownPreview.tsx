import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import rehypeKatex from 'rehype-katex';

const MarkdownPreview = ({ text }: { text: string }) => (
  <div className='markdown_preview_container'>
    {/* @ts-expect-error: CustomComponents type does not match rehypePlugins prop */}
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {text}
    </ReactMarkdown>
  </div>
);

export default MarkdownPreview;
