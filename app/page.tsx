'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { useConfigStore } from '@/store/configStore';
import { AuroraBackground } from '@/components/UI/AuroraBackground';
import { SetupWizard } from '@/components/Config/SetupWizard';
import { ThinkingTerminal } from '@/components/Chat/ThinkingTerminal';
import { Settings, RefreshCw, StopCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeoInterface() {
  const { isConfigured, apiKey, endpoint, modelName } = useConfigStore();
  
  // Custom Fetcher to inject Dynamic Headers
  const customFetch = async (url: string, options: any) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-Leo-Api-Key': apiKey,
        'X-Leo-Endpoint': endpoint,
        'X-Leo-Model': modelName,
      },
    });
  };

  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat({
    api: '/api/chat',
    fetch: customFetch as any,
    initialMessages: [
       // System Prompt is handled server-side, but context can be set here
    ],
  });

  if (!isConfigured) return <SetupWizard />;

  return (
    <main className="relative w-full h-screen text-white overflow-hidden font-sans">
      <AuroraBackground />
      
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-sm border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          LEO
        </h1>
        <div className="flex gap-4">
           {/* Settings Trigger would go here */}
           <button className="p-2 rounded-full hover:bg-white/10 transition"><Settings size={20}/></button>
        </div>
      </header>

      {/* Hero / Empty State */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-6xl font-light tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              SYSTEMS ONLINE
            </h2>
            <p className="text-cyan-300/60 font-mono tracking-widest text-sm uppercase">
              Created by Isam Ahmed // Architecture v1.0
            </p>
          </motion.div>
        </div>
      )}

      {/* Chat Container */}
      <div className="absolute inset-0 pt-24 pb-32 px-4 md:px-20 overflow-y-auto z-20 scrollbar-hide">
        {messages.map((m) => (
          <motion.div 
            initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={m.id} 
            className={`flex flex-col mb-8 ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-3xl p-6 rounded-2xl backdrop-blur-xl border ${
              m.role === 'user' 
                ? 'bg-purple-900/20 border-purple-500/30 text-purple-50' 
                : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-50'
            }`}>
              {/* If AI, check for Thinking Blocks */}
              {m.role === 'assistant' && <ThinkingTerminal content={m.content} />}
              
              {/* Main Content (Strip thinking tags for display) */}
              <div className="prose prose-invert prose-p:leading-relaxed">
                {m.content.replace(/<thinking>[\s\S]*?<\/thinking>/g, '')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full p-6 z-50 flex justify-center bg-gradient-to-t from-black via-black/80 to-transparent">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl relative">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 pr-16 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
            value={input}
            onChange={handleInputChange}
            placeholder="Direct the system..."
          />
          <div className="absolute right-2 top-2 flex gap-2">
            {isLoading ? (
              <button type="button" onClick={stop} className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 text-red-400 transition border border-red-500/50">
                <StopCircle size={20} />
              </button>
            ) : (
              <button type="submit" className="p-2 bg-cyan-500/20 rounded-full hover:bg-cyan-500/40 text-cyan-400 transition border border-cyan-500/50">
                <Send size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
