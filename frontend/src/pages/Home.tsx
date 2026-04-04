import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Settings, Zap, Layout, GitCommitHorizontal, Shield, Sparkles, Crown, Building2, GraduationCap } from 'lucide-react';
import { CardStack } from '../components/ui/card-stack';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-20 px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
        Review. Refactor.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Write Better Code.</span>
      </h1>
      
      <p className="text-[var(--outline)] text-base md:text-lg lg:text-xl max-w-2xl mb-8 md:mb-10 px-2">
        An intelligent code review assistant that analyzes your code, detects
        issues, and suggests improvements instantly.
      </p>

      <div 
        className="w-full max-w-5xl mb-16 md:mb-32 relative hidden md:block"
        style={{ perspective: '1000px' }}
        onMouseMove={(e) => {
          const card = e.currentTarget.firstElementChild as HTMLElement;
          const glare = card?.querySelector('.tilt-glare') as HTMLElement;
          if (!card) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          if (glare) {
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 60%)`;
          }
        }}
        onMouseLeave={(e) => {
          const card = e.currentTarget.firstElementChild as HTMLElement;
          const glare = card?.querySelector('.tilt-glare') as HTMLElement;
          if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          if (glare) glare.style.opacity = '0';
        }}
      >
        <div className="glass-card p-6 relative group transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
          <div className="tilt-glare absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none opacity-0 transition-opacity duration-300 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[var(--radius-lg)] rounded-t-[calc(var(--radius-lg)-4px)]"></div>
          <div className="w-full h-8 bg-[var(--surface-container-lowest)] rounded-t-lg flex items-center px-4 gap-2 border-b border-[var(--outline)]/10">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-xs font-mono text-[var(--outline)]">analyzer.py - CodeLens</div>
          </div>
          <div className="bg-[var(--surface-container-low)] p-4 md:p-8 rounded-b-lg font-mono text-xs md:text-sm text-left flex flex-col md:flex-row justify-between md:items-center text-gray-300 gap-4">
             <div>
               <div><span className="text-[var(--tertiary)]">def</span> <span className="text-[var(--primary)]">process_data</span>(input_list):</div>
               <div className="pl-8">temp_var = []</div>
               <div className="pl-8"><span className="text-[var(--secondary)]">for</span> x <span className="text-[var(--secondary)]">in</span> input_list:</div>
               <div className="pl-16">temp_var.append(x * 2)</div>
               <div className="pl-8"><span className="text-[var(--secondary)]">return</span> temp_var</div>
             </div>
             <div className="flex flex-col gap-4 md:gap-6 md:w-48 shrink-0">
                <div>
                  <div className="text-xs text-[var(--outline)] mb-1">COMPLEXITY</div>
                  <div className="text-2xl font-bold flex items-end gap-2 text-green-400">B+ <span className="text-sm font-normal text-[var(--outline)] pb-1">Moderate</span></div>
                </div>
                <div>
                  <div className="text-xs text-[var(--outline)] mb-1">READABILITY</div>
                  <div className="text-2xl font-bold flex items-end gap-2 text-purple-400">A <span className="text-sm font-normal text-[var(--outline)] pb-1">Excellent</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>
      {/* ─── Features Section ─── */}
      <section id="features" className="scroll-mt-20 w-full max-w-5xl mb-16 md:mb-32">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Built for Modern Engineering</h2>
        <p className="text-[var(--outline)] mb-8">Explore what makes CodeLens AI different.</p>
        <CardStack
          items={[
            { id: 'f1', title: 'Smart Code Analysis', description: 'Detects technical debt, code smells, and inefficiencies before they reach production.', tag: 'Analysis' },
            { id: 'f2', title: 'Refactoring Suggestions', description: 'Actionable AI-driven improvements that prioritize maintainability and clean architecture.', tag: 'AI' },
            { id: 'f3', title: 'Quality Scoring', description: 'Instant metrics for readability, cyclomatic complexity, and overall maintainability.', tag: 'Metrics' },
            { id: 'f4', title: 'Developer-Friendly UI', description: 'A real-time dashboard focused on deep insights without the clutter of traditional IDEs.', tag: 'UI/UX' },
            { id: 'f5', title: 'Security Insights', description: 'Automatically flags potential vulnerabilities, unsafe patterns, and injection risks in your code.', tag: 'Security' },
          ]}
          cardWidth={500}
          cardHeight={260}
          autoAdvance
          intervalMs={3000}
          pauseOnHover
          renderCard={(item, { active }) => {
            const icons: Record<string, React.ReactNode> = {
              'f1': <Code2 size={28} className="text-[var(--primary)]" />,
              'f2': <Settings size={28} className="text-[var(--secondary)]" />,
              'f3': <Zap size={28} className="text-yellow-400" />,
              'f4': <Layout size={28} className="text-green-400" />,
              'f5': <Shield size={28} className="text-red-400" />,
            };
            const gradients: Record<string, string> = {
              'f1': 'from-[var(--primary)]/20 to-transparent',
              'f2': 'from-[var(--secondary)]/20 to-transparent',
              'f3': 'from-yellow-500/20 to-transparent',
              'f4': 'from-green-500/20 to-transparent',
              'f5': 'from-red-500/20 to-transparent',
            };
            return (
              <div className={`h-full w-full bg-[var(--surface-container)] p-8 flex flex-col justify-between relative overflow-hidden transition-all ${active ? 'ring-1 ring-[var(--primary)]/30' : ''}`}>
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${gradients[item.id as string]} rounded-full blur-2xl`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-container-high)] flex items-center justify-center">
                      {icons[item.id as string]}
                    </div>
                    {item.tag && <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--outline)]">{item.tag}</span>}
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-[var(--outline)] text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          }}
        />
      </section>

      {/* ─── How It Works Section ─── */}
      <section id="how-it-works" className="w-full max-w-4xl border-t border-[var(--border)] pt-12 md:pt-20 mb-16 md:mb-32 scroll-mt-20">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">The Kinetic Workflow</h2>
        <p className="text-[var(--outline)] mb-8 md:mb-16">Three steps to architectural excellence.</p>
        <div className="flex flex-col md:flex-row justify-between items-center relative gap-10 md:gap-0">
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[var(--outline)]/30 to-transparent -z-10"></div>
          {[
            { step: "1", title: "Write or Paste", desc: "Drop your code into the MAIN.PY editor — any language, any complexity." },
            { step: "2", title: "AI Analysis", desc: "Gemini AI scans for code smells, complexity issues, and structural weaknesses." },
            { step: "3", title: "Review & Refactor", desc: "Get a health score, detailed issue breakdown, and a fully refactored version of your code." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center w-full md:w-64">
              <div className="w-14 h-14 rounded-full bg-[var(--surface-container-highest)] border border-[var(--outline)]/20 flex items-center justify-center mb-6 text-xl font-bold">
                {item.step}
              </div>
              <h4 className="text-lg font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-[var(--outline)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Changelog Section ─── */}
      <section id="changelog" className="w-full max-w-5xl border-t border-[var(--border)] pt-12 md:pt-20 mb-16 md:mb-32 scroll-mt-20">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Changelog</h2>
        <p className="text-[var(--outline)] mb-8">What's new in CodeLens AI.</p>
        <CardStack
          items={[
            { id: 'c1', title: 'v1.2.0 — Apr 2026', description: 'Gemini AI Integration • Notification Bell • History Rename & Delete', tag: 'Latest' },
            { id: 'c2', title: 'v1.1.0 — Mar 2026', description: 'Multi-language Support • Dynamic Health Scoring • Side-by-side History', tag: 'Stable' },
            { id: 'c3', title: 'v1.0.0 — Mar 2026', description: 'Monaco Editor • Code Analysis Dashboard • Dark Mode UI', tag: 'Initial' },
          ]}
          cardWidth={500}
          cardHeight={240}
          autoAdvance
          intervalMs={3500}
          pauseOnHover
          renderCard={(item, { active }) => {
            const icons: Record<string, React.ReactNode> = {
              'c1': <Sparkles size={24} className="text-yellow-400" />,
              'c2': <Shield size={24} className="text-green-400" />,
              'c3': <GitCommitHorizontal size={24} className="text-[var(--primary)]" />,
            };
            const details: Record<string, string[]> = {
              'c1': ['Integrated Google Gemini AI for real code analysis & refactoring', 'Added notification bell with live alerts', 'History cards now support rename & delete'],
              'c2': ['Added Python, C++, and Java language support', 'Dynamic health scoring & issue detection', 'Side-by-side code comparison in History'],
              'c3': ['Initial release with Monaco code editor', 'Basic code analysis dashboard', 'Dark mode UI with glassmorphism design'],
            };
            return (
              <div className={`h-full w-full bg-[var(--surface-container)] p-8 flex flex-col justify-between relative overflow-hidden text-left ${active ? 'ring-1 ring-[var(--primary)]/30' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface-container-high)] flex items-center justify-center">
                    {icons[item.id as string]}
                  </div>
                  <span className="text-xl font-bold">{item.title}</span>
                  {item.tag && <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--outline)] ml-auto">{item.tag}</span>}
                </div>
                <ul className="space-y-2 mt-auto">
                  {details[item.id as string]?.map((line, j) => (
                    <li key={j} className="text-sm text-[var(--outline)] flex items-start gap-2">
                      <span className="text-[var(--primary)] mt-0.5">•</span> {line}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }}
        />
      </section>

      {/* ─── Pricing Section ─── */}
      <section id="pricing" className="w-full max-w-5xl border-t border-[var(--border)] pt-12 md:pt-20 mb-16 md:mb-32 scroll-mt-20">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-[var(--outline)] mb-8">Flexible plans for every developer. Coming soon.</p>
        <CardStack
          items={[
            { id: 'p1', title: 'Free Forever', description: 'Basic code analysis, refactoring suggestions, and quality scoring. Perfect for personal projects.', tag: 'Free' },
            { id: 'p2', title: 'Pro', description: 'Advanced AI models, priority analysis queue, unlimited history, and team collaboration features.', tag: '$19/mo' },
            { id: 'p3', title: 'Enterprise', description: 'Custom integrations, SSO, dedicated support, on-premise deployment, and SLA guarantees.', tag: 'Custom' },
          ]}
          cardWidth={500}
          cardHeight={280}
          autoAdvance
          intervalMs={4000}
          pauseOnHover
          renderCard={(item, { active }) => {
            const icons: Record<string, React.ReactNode> = {
              'p1': <GraduationCap size={28} className="text-green-400" />,
              'p2': <Crown size={28} className="text-yellow-400" />,
              'p3': <Building2 size={28} className="text-[var(--primary)]" />,
            };
            const gradients: Record<string, string> = {
              'p1': 'from-green-500/15 to-transparent',
              'p2': 'from-yellow-500/15 to-transparent',
              'p3': 'from-[var(--primary)]/15 to-transparent',
            };
            return (
              <div className={`h-full w-full bg-[var(--surface-container)] p-8 flex flex-col justify-between relative overflow-hidden ${active ? 'ring-1 ring-[var(--primary)]/30' : ''}`}>
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${gradients[item.id as string]} rounded-full blur-3xl`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-container-high)] flex items-center justify-center">
                      {icons[item.id as string]}
                    </div>
                    {item.tag && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] font-semibold">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <div className="relative z-10">
                  <p className="text-[var(--outline)] text-sm leading-relaxed mb-4">{item.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[var(--outline)]">
                    <Sparkles size={12} />
                    Coming Soon
                  </div>
                </div>
              </div>
            );
          }}
        />
      </section>

      {/* ─── CTA Section ─── */}
      <div className="w-full max-w-4xl rounded-[2rem] md:rounded-[3rem] bg-gradient-to-b from-[var(--surface-bright)] to-[var(--background)] p-8 md:p-16 border border-[var(--outline)]/20 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 opacity-50"></div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold relative z-10 mb-4 md:mb-6">Start improving your code today</h2>
        <p className="text-[var(--outline)] relative z-10 mb-6 md:mb-10 max-w-md mx-auto text-sm md:text-base">Join 10,000+ developers using CodeLens to ship cleaner, faster, and more secure code.</p>
        <Link 
          to="/analyzer" 
          className="relative z-10 inline-block px-10 py-4 rounded-full text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          Launch Analyzer
        </Link>
      </div>
      

    </div>
  );
};

export default Home;