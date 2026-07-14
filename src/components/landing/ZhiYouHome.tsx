'use client';

import { Sparkles, Github } from 'lucide-react';
import Link from 'next/link';

export function ZhiYouHome() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/织游.png)' }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cloud-white/20 via-cloud-white/10 to-sky-thread/5" />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title Image */}
          <div className="mb-6">
            <img 
              src="/ZHIYOU.png" 
              alt="织游 ZhiYou" 
              className="w-80 md:w-96 h-auto mx-auto"
            />
          </div>
          
          {/* English Subtitle */}
          <p className="text-xl md:text-2xl text-graphite/90 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-caveat), cursive' }}>
            Your warm knitting companion to turn images into patterns 
            and help you freely navigate the beautiful ocean of stitches.
          </p>

          {/* CTA Button */}
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-[20px] border-2 border-graphite text-graphite font-semibold text-lg hover:bg-graphite hover:text-white transition-all"
          >
            <Sparkles className="w-5 h-5" />
            开始编织
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-graphite/80 relative z-10 space-y-2">
        <p>用爱编织 · Made with ❤️</p>
        <p>织游 ZhiYou · 开源软件</p>
        <p className="text-graphite/60">韩续为他热爱编织的妈妈而创作</p>
        <p className="text-graphite/60">本软件基于 AGPL-3.0 协议开源</p>
        <a 
          href="http://github.com/loomscape/ZHIYOU" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-graphite/80 hover:text-graphite transition-colors"
        >
          <Github className="w-4 h-4" />
          ZHIYOU
        </a>
      </div>
    </div>
  );
}
