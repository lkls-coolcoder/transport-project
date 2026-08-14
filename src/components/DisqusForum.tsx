import React, { useEffect } from 'react';
import { MessageSquare, MessageCircle, Sparkles } from 'lucide-react';

interface DisqusForumProps {
  currentCityName?: string;
}

export const DisqusForum: React.FC<DisqusForumProps> = ({ currentCityName = 'Transit Community' }) => {
  useEffect(() => {
    try {
      // Set global disqus_config
      (window as any).disqus_config = function () {
        this.page.identifier = 'transitpulse-global-discussion';
        this.page.url = window.location.href.split('#')[0];
        this.page.title = 'TransitPulse Community Discussion Forum';
      };

      const scriptId = 'disqus-embed-script';
      const existingScript = document.getElementById(scriptId);

      // If DISQUS global exists in window, reset it for the current page
      if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({
            reload: true,
            config: (window as any).disqus_config
          });
        } catch (e) {
          console.warn('Disqus reset error:', e);
        }
      } else if (!existingScript) {
        // Inject Disqus script safely
        const d = document;
        const s = d.createElement('script');
        s.id = scriptId;
        s.src = 'https://agentic-ai-course-sl.disqus.com/embed.js';
        s.setAttribute('data-timestamp', (+new Date()).toString());
        s.async = true;
        s.onerror = () => {
          console.warn('Disqus embed script unavailable or blocked by browser');
        };
        (d.head || d.body).appendChild(s);
      }
    } catch (err) {
      console.warn('Disqus initialization skipped:', err);
    }
  }, []);

  return (
    <section id="community-discussion-section" className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Community Forum
            </span>
            <span className="text-xs text-slate-400 font-mono">• Powered by Disqus</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Transit & Commuter Discussions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Share live commute updates, ask questions about routes, or discuss transit conditions with fellow commuters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="#disqus_thread"
            data-disqus-identifier="transitpulse-global-discussion"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-indigo-600" />
            <span className="disqus-comment-count" data-disqus-identifier="transitpulse-global-discussion">
              Comments
            </span>
          </a>
        </div>
      </div>

      {/* Disqus Comments Container */}
      <div className="min-h-[220px]">
        <div id="disqus_thread"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-indigo-600 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
