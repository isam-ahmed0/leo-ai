import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ThinkingProps {
  content: string;
}

export const ThinkingTerminal = ({ content }: ThinkingProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Extract content between <thinking> tags
  const match = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  const thinkingContent = match ? match[1].trim() : null;

  if (!thinkingContent) return null;

  return (
    <div className="w-full my-4 rounded-lg overflow-hidden border border-cyan-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-cyan-950/30 border-b border-cyan-500/20 hover:bg-cyan-900/40 transition-colors"
      >
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
          <Terminal size={14} />
          <span>Neural Processing</span>
        </div>
        {isOpen ? <ChevronUp size={14} className="text-cyan-400"/> : <ChevronDown size={14} className="text-cyan-400"/>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 font-mono text-xs text-cyan-200/80 whitespace-pre-wrap leading-relaxed">
              {thinkingContent}
              <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse"/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
