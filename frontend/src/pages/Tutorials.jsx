import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { api_base_url } from '../helper';
import { Link } from 'react-router-dom';
import { tutorialData } from '../data/tutorialData';
import {
  FaHtml5, FaCss3Alt, FaJs, FaPython, FaJava, FaPhp, FaRust, FaDatabase, FaSwift, FaArrowLeft, FaPlay, FaCode, FaColumns, FaExpand, FaUndo, FaCompress
} from 'react-icons/fa';
import { SiCplusplus, SiCsharp, SiGo, SiKotlin } from 'react-icons/si';
import { BsLayoutSplit } from "react-icons/bs";

// Icon Map
const iconMap = {
  html: <FaHtml5 className="text-orange-500 text-2xl" />,
  css: <FaCss3Alt className="text-blue-500 text-2xl" />,
  js: <FaJs className="text-yellow-400 text-2xl" />,
  python: <FaPython className="text-blue-400 text-2xl" />,
  java: <FaJava className="text-red-500 text-2xl" />,
  cpp: <SiCplusplus className="text-blue-600 text-2xl" />,
  csharp: <SiCsharp className="text-purple-600 text-2xl" />,
  go: <SiGo className="text-cyan-400 text-2xl" />,
  rust: <FaRust className="text-orange-600 text-2xl" />,
  sql: <FaDatabase className="text-gray-400 text-2xl" />,
  swift: <FaSwift className="text-orange-500 text-2xl" />,
  kotlin: <SiKotlin className="text-purple-500 text-2xl" />,
  php: <FaPhp className="text-indigo-400 text-2xl" />
};

const Tutorials = () => {
  const [activeLang, setActiveLang] = useState('html');
  const [activeTopic, setActiveTopic] = useState('Basics');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [layout, setLayout] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [previewHtml, setPreviewHtml] = useState(''); // For iframe srcDoc
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Load initial state or when language changes
  useEffect(() => {
    if (tutorialData[activeLang]) {
      const topics = Object.keys(tutorialData[activeLang].topics);
      const defaultTopic = topics[0];
      setActiveTopic(defaultTopic);
      setCode(tutorialData[activeLang].topics[defaultTopic].code);
    }
  }, [activeLang]);

  // Update code when topic changes
  useEffect(() => {
    if (tutorialData[activeLang] && tutorialData[activeLang].topics[activeTopic]) {
      setCode(tutorialData[activeLang].topics[activeTopic].code);
      setOutput(''); // Clear output on switch
    }
  }, [activeTopic, activeLang]);

  // Auto-run for HTML/CSS/JS when code changes
  useEffect(() => {
    if (['html', 'css', 'js'].includes(activeLang) && code) {
      const timer = setTimeout(() => {
        let htmlContent = '';
        if (activeLang === 'html') {
          htmlContent = code;
        }
        if (activeLang === 'css') {
          htmlContent = `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="container"><div class="item">Item 1</div><div class="item">Item 2</div></div><h1>CSS Preview</h1><p>Edit variables to see changes.</p></body></html>`;
        }
        if (activeLang === 'js') {
          htmlContent = `<!DOCTYPE html><html><head></head><body><h1>JS Console Output</h1><div id="app"></div><script>try{${code}}catch(e){document.body.innerHTML += '<div style="color:red">'+e+'</div>'}</script></body></html>`;
        }
        setPreviewHtml(htmlContent);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [code, activeLang]);

  const runCode = () => {
    if (['html', 'css', 'js'].includes(activeLang)) {
      let htmlContent = '';
      if (activeLang === 'html') {
        htmlContent = code;
      }
      if (activeLang === 'css') {
        htmlContent = `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="container"><div class="item">Item 1</div><div class="item">Item 2</div></div><h1>CSS Preview</h1><p>Edit variables to see changes.</p></body></html>`;
      }
      if (activeLang === 'js') {
        htmlContent = `<!DOCTYPE html><html><head></head><body><h1>JS Console Output</h1><div id="app"></div><script>try{${code}}catch(e){document.body.innerHTML += '<div style="color:red">'+e+'</div>'}</script></body></html>`;
      }
      setPreviewHtml(htmlContent);
      return;
    }

    setIsRunning(true);
    fetch(api_base_url + '/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: activeLang, code: code })
    })
      .then(res => res.json())
      .then(data => {
        setIsRunning(false);
        if (data.success) {
          setOutput(data.stdout + (data.stderr ? '\nError:\n' + data.stderr : ''));
        } else {
          setOutput(data.error || data.stderr || 'Execution failed');
        }
      })
      .catch(err => {
        setIsRunning(false);
        setOutput('Network Error: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCode className="text-purple-500 text-xl" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              TechioLaza <span className="text-gray-400 font-normal">Tutorials</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Layout Toggles */}
            <div className="bg-white/5 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => setLayout('horizontal')}
                className={`p-2 rounded hover:bg-white/10 transition-colors ${layout === 'horizontal' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                title="Side by Side"
              >
                <BsLayoutSplit className="rotate-90" />
              </button>
              <button
                onClick={() => setLayout('vertical')}
                className={`p-2 rounded hover:bg-white/10 transition-colors ${layout === 'vertical' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                title="Stacked"
              >
                <BsLayoutSplit />
              </button>
            </div>

            <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft /> Back to IDE
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1920px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar: Languages */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col glass rounded-2xl overflow-hidden h-full">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider">Languages</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {Object.keys(tutorialData).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${activeLang === lang
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 text-white'
                  : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'
                  }`}
              >
                <div className={`p-1.5 rounded-lg ${activeLang === lang ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  {iconMap[lang] || <FaCode />}
                </div>
                <span className="font-medium text-sm">{tutorialData[lang].name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col gap-4 h-full overflow-hidden">

          {/* Topics Bar */}
          <div className="glass p-2 rounded-xl flex gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
            {tutorialData[activeLang] && (() => {
              const base = Object.keys(tutorialData[activeLang].topics || {});
              const topicsList = [...base, 'Quiz'];
              return topicsList.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTopic === topic
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {topic}
                </button>
              ));
            })()}
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Left: Description, Editor or Quiz */}
            <div className={`flex-1 flex flex-col gap-4 overflow-hidden ${layout === 'vertical' ? 'h-full' : ''}`}>
              {activeTopic === 'Quiz' ? (
                <QuizPanel activeLang={activeLang} />
              ) : (
                <>
                  <div className="glass-strong p-6 rounded-2xl overflow-y-auto max-h-[35vh]">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        {activeTopic}
                      </h2>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {tutorialData[activeLang]?.topics[activeTopic]?.description}
                      </p>
                    </div>

                    {tutorialData[activeLang]?.topics[activeTopic]?.exercise && (
                      <div className="bg-[#1e1e1e]/50 border-l-4 border-purple-500 p-4 rounded-r-xl">
                        <h3 className="text-purple-400 font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                          <FaCode /> Challenge
                        </h3>
                        <p className="text-gray-200 font-medium">
                          {tutorialData[activeLang]?.topics[activeTopic]?.exercise}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[400px]">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                      <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                        <FaCode /> {tutorialData[activeLang]?.name} Snippet
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCode(tutorialData[activeLang].topics[activeTopic].code)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm font-medium transition-colors"
                          title="Reset to starter code"
                        >
                          <FaUndo size={12} /> Reset
                        </button>
                        <button
                          onClick={runCode}
                          disabled={isRunning}
                          className="flex items-center gap-2 px-6 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRunning ? 'Running...' : <><FaPlay size={12} /> RUN CODE</>}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 relative group">
                      <Editor
                        height="100%"
                        language={activeLang === 'js' ? 'javascript' : activeLang}
                        value={code}
                        onChange={(v) => setCode(v)}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 15,
                          padding: { top: 20 },
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          scrollBeyondLastLine: false,
                          smoothScrolling: true,
                          cursorBlinking: "smooth",
                          cursorSmoothCaretAnimation: "on"
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right: Output (Conditional Layout) */}
            <div className={`${layout === 'horizontal' ? 'w-1/3' : 'hidden'} flex flex-col bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 shadow-2xl`}>
              <OutputPanel
                activeLang={activeLang}
                output={output}
                previewHtml={previewHtml}
                isFullScreen={false}
                toggleFullScreen={() => setIsFullScreen(true)}
              />
            </div>
          </div>

          {/* Bottom Output (Vertical Layout Only) */}
          {layout === 'vertical' && (
            <div className="h-1/3 flex flex-col bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <OutputPanel
                activeLang={activeLang}
                output={output}
                previewHtml={previewHtml}
                isFullScreen={false}
                toggleFullScreen={() => setIsFullScreen(true)}
              />
            </div>
          )}

        </main>
      </div>

      {/* Full Screen Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0F] p-6 flex flex-col animate-scaleIn">
          <div className="w-full h-full flex flex-col bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <OutputPanel
              activeLang={activeLang}
              output={output}
              previewHtml={previewHtml}
              isFullScreen={true}
              toggleFullScreen={() => setIsFullScreen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Output
const QuizPanel = ({ activeLang }) => {
  const [answers, setAnswers] = useState({}); // {index: selectedOptionIndex}
  const [submitted, setSubmitted] = useState(false);

  // Build 5 questions from topics descriptions
  const questions = React.useMemo(() => {
    const topics = tutorialData[activeLang]?.topics ? Object.keys(tutorialData[activeLang].topics) : [];
    const pool = topics.slice(0, 5);
    const q = pool.map((t, idx) => {
      const desc = (tutorialData[activeLang].topics[t].description || '').replace(/\s+/g, ' ').trim();
      const correct = desc.split('.').slice(0, 1).join('.');

      // pick 3 distractors from other topics
      const others = topics.filter(x => x !== t).map(x => (tutorialData[activeLang].topics[x].description || '').split('.').slice(0, 1).join('.'));
      while (others.length < 3) others.push('A core concept in this language.');
      const opts = [correct, others[0], others[1] || others[0], others[2] || others[0]];

      // shuffle
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }

      return {
        id: idx,
        question: `What is the primary focus of the topic "${t}"?`,
        options: opts,
        correct: opts.indexOf(correct)
      };
    });
    return q;
  }, [activeLang]);

  const select = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = Object.keys(answers).reduce((s, k) => s + (questions[k] && answers[k] === questions[k].correct ? 1 : 0), 0);

  return (
    <div className="glass-strong p-6 rounded-2xl overflow-y-auto max-h-[80vh] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Quiz — {tutorialData[activeLang]?.name}</h2>
        <div className="text-sm text-gray-400">5 Questions • Multiple Choice</div>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="p-4 bg-[#0f1724] rounded-lg border border-white/5">
            <div className="text-white font-medium mb-3">{q.id + 1}. {q.question}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                const correct = submitted && i === q.correct;
                const wrong = submitted && selected && i !== q.correct;
                return (
                  <button
                    key={i}
                    onClick={() => select(q.id, i)}
                    className={`text-left p-3 rounded-lg border transition-colors ${selected ? 'ring-2 ring-purple-500 bg-purple-700/10' : 'bg-white/3 hover:bg-white/5'} ${correct ? 'border-emerald-400 bg-emerald-700/10' : ''} ${wrong ? 'border-red-400 bg-red-700/10' : ''}`}
                  >
                    <div className="text-sm text-gray-200">{opt}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-gray-300">Answered: {Object.keys(answers).length} / {questions.length}</div>
        <div className="flex gap-2">
          <button
            onClick={() => { setSubmitted(false); setAnswers({}); }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-gray-200"
          >
            Reset
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded text-sm font-semibold"
          >
            Submit
          </button>
        </div>
      </div>

      {submitted && (
        <div className="mt-3 p-4 bg-[#07122b] rounded-lg border border-white/5">
          <div className="text-lg font-bold text-white">Result: {score} / {questions.length}</div>
          <div className="text-sm text-gray-300 mt-2">Correct answers are highlighted in green. Wrong selections are highlighted in red.</div>
        </div>
      )}
    </div>
  );
};

const OutputPanel = ({ activeLang, output, previewHtml, isFullScreen, toggleFullScreen }) => (
  <>
    <div className="px-4 py-2 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
          {['html', 'css', 'js'].includes(activeLang) ? 'Live Preview' : 'Terminal Output'}
        </span>
        {isFullScreen && <span className="text-[10px] bg-purple-600 px-2 py-0.5 rounded text-white">FULL SCREEN</span>}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleFullScreen}
          className="text-gray-400 hover:text-white transition-colors"
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          {isFullScreen ? <FaCompress /> : <FaExpand />}
        </button>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
        </div>
      </div>
    </div>

    {['html', 'css', 'js'].includes(activeLang) ? (
      <iframe
        id="preview-frame"
        title="preview"
        srcDoc={previewHtml}
        className="flex-1 w-full bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
    ) : (
      <div className="flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar h-full bg-[#0d0d0d]">
        {output ? (
          <pre className="whitespace-pre-wrap text-emerald-400 font-bold">{output}</pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-3">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
              <FaCode size={24} />
            </div>
            <p className="uppercase tracking-widest text-xs">Ready to execute</p>
          </div>
        )}
      </div>
    )}
  </>
);

export default Tutorials;
