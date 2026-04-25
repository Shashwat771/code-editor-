import React, { useEffect, useState } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import Editor from '@monaco-editor/react';
import { MdLightMode, MdDarkMode, MdPlayArrow, MdSave } from 'react-icons/md';
import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
import { api_base_url } from '../helper';
import { tutorialData } from '../data/tutorialData';
import problems from '../data/problemsData';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Editior = () => {
  const [tab, setTab] = useState("js");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // test panel is always visible now
  const [jsCode, setJsCode] = useState("// some comment");
  const [pythonCode, setPythonCode] = useState("print(\"Hello from Python\")");
  const [phpCode, setPhpCode] = useState("<?php\n echo 'Hello from PHP';\n?>");
  const [javaCode, setJavaCode] = useState("public class Main { public static void main(String[] args){ System.out.println(\"Hello from Java\"); } }");
  const [cppCode, setCppCode] = useState("#include <iostream>\nusing namespace std;\nint main(){ cout << \"Hello from C++\" << endl; return 0; }");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [projectTitle, setProjectTitle] = useState(""); // State for project title

  // Extract projectID from URL using useParams
  const { projectID } = useParams();
  const practiceMode = projectID && projectID.startsWith('practice-');
  const problemId = practiceMode ? projectID.replace('practice-', '') : null;
  const [currentProblem, setCurrentProblem] = useState(null);
  const [testResult, setTestResult] = useState(null); // { success: bool, message: string }

  // Cleanup: remove any stray text nodes (e.g. leftover '})') that might be injected
  useEffect(() => {
    try {
      const removeMatching = (root = document.body) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const toRemove = [];
        let node = walker.nextNode();
        while (node) {
          if (node.nodeValue && node.nodeValue.indexOf('})') !== -1) toRemove.push(node);
          node = walker.nextNode();
        }
        toRemove.forEach(n => n.parentNode && n.parentNode.removeChild(n));
      };

      // initial sweep
      removeMatching(document.body);

      // observe for future additions (HMR or other scripts)
      const obs = new MutationObserver(mutations => {
        for (const m of mutations) {
          if (m.addedNodes && m.addedNodes.length) {
            m.addedNodes.forEach(n => {
              if (n.nodeType === Node.TEXT_NODE) {
                if (n.nodeValue && n.nodeValue.indexOf('})') !== -1) n.parentNode && n.parentNode.removeChild(n);
              } else if (n.nodeType === Node.ELEMENT_NODE) {
                removeMatching(n);
              }
            });
          }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });

      // also run a brief interval sweep in case nodes are added quickly by HMR
      const interval = setInterval(() => removeMatching(document.body), 500);
      const timeout = setTimeout(() => clearInterval(interval), 10000);

      // inject CSS to position toasts in the upper middle (top-center)
      const styleTag = document.createElement('style');
      styleTag.id = 'toast-fix-style';
      styleTag.innerHTML = `
        .Toastify__toast-container--top-center { left: 50% !important; transform: translateX(-50%); top: 12px !important; right: auto !important; }
        .Toastify__toast { margin: 6px !important; }
      `;
      document.head.appendChild(styleTag);

      // cleanup observer on unmount
      return () => {
        obs.disconnect();
        clearInterval(interval);
        clearTimeout(timeout);
        if (styleTag.parentNode) styleTag.parentNode.removeChild(styleTag);
      };
    } catch (e) {
      // ignore
    }
  }, []);

  const changeTheme = () => {
    const editorNavbar = document.querySelector(".EditiorNavbar");
    if (isLightMode) {
      if (editorNavbar) editorNavbar.style.background = "#141414";
      document.body.classList.remove("lightMode");
      setIsLightMode(false);
    } else {
      if (editorNavbar) editorNavbar.style.background = "#f4f4f4";
      document.body.classList.add("lightMode");
      setIsLightMode(true);
    }
  };

  const run = async () => {
    // Only allow running supported languages (js, python, php, java)
    if (!['js','python','php','java','cpp','c++'].includes(tab)) {
      setOutput('Language not supported for execution');
      return;
    }

    // for supported languages, call backend /run
    let codeToRun = '';
    if (tab === 'js') codeToRun = jsCode;
    else if (tab === 'python') codeToRun = pythonCode;
    else if (tab === 'php') codeToRun = phpCode;
    else if (tab === 'java') codeToRun = javaCode;
    else if (tab === 'cpp' || tab === 'c++') codeToRun = cppCode;

    setIsRunning(true);
    setOutput('Executing code...');

    // If practiceMode and we have tests, wrap code with a simple test harness
    let payloadCode = codeToRun;
    if (practiceMode && currentProblem && currentProblem.tests && currentProblem.tests.length > 0) {
      if (tab === 'js') {
        // build JS harness: user code + runner that prints JSON with results
        const harness = `\n(function(){\n  try {\n    const __tests = ${JSON.stringify(currentProblem.tests)};\n    const results = [];\n    for (const t of __tests) {\n      try {\n        // user must export or define a function matching the problem id name\n        const res = typeof twoSum === 'function' ? JSON.stringify(twoSum(t.input.nums, t.input.target)) : (typeof reverseString === 'function' ? JSON.stringify(reverseString(t.input.s)) : (typeof isPalindrome === 'function' ? JSON.stringify(isPalindrome(t.input.s)) : 'undefined'));\n        results.push({ ok: res == t.expected, expected: t.expected, got: res });\n      } catch (e) { results.push({ ok: false, error: String(e) }); }\n    }\n    console.log('===TEST_RESULTS===');\n    console.log(JSON.stringify(results));\n  } catch(err) { console.log('===TEST_RESULTS==='); console.log(JSON.stringify([{ok:false,error:String(err)}])); }\n})();`;
        payloadCode = codeToRun + '\n' + harness;
      } else if (tab === 'python') {
        const harness = `\nimport json\n__tests = ${JSON.stringify(currentProblem.tests)}\nresults=[]\nfor t in __tests:\n    try:\n        if 'nums' in t['input'] and 'target' in t['input']:\n            res = twoSum(t['input']['nums'], t['input']['target'])\n            results.append({'ok': str(res)==t['expected'], 'expected': t['expected'], 'got': str(res)})\n        elif 's' in t['input']:\n            # try reverseString first, else isPalindrome\n            if 'reverseString' in globals():\n                res = reverseString(t['input']['s'])\n            else:\n                res = isPalindrome(t['input']['s'])\n            results.append({'ok': str(res)==t['expected'], 'expected': t['expected'], 'got': str(res)})\n    except Exception as e:\n        results.append({'ok':False, 'error':str(e)})\nprint('===TEST_RESULTS===')\nprint(json.dumps(results))\n`;
        payloadCode = codeToRun + '\n' + harness;
      }
    }

    fetch(api_base_url + '/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: tab, code: payloadCode })
    })
      .then(res => res.json())
      .then(data => {
        setIsRunning(false);
        const stdout = (data.stdout || '') + (data.stderr ? '\n' + data.stderr : '');

        // Check if execution service is rate limited
        if (stdout.includes('rate limited') || stdout.includes('experiencing high load')) {
          setOutput(stdout);
          toast.warning('Execution services are busy. Please try again in a moment.');
          return;
        }

        // If practice mode and tests exist, separate console output from test results
        if (practiceMode && stdout.includes('===TEST_RESULTS===')) {
          const parts = stdout.split('===TEST_RESULTS===');
          const consoleOut = parts[0].trim();
          const jsonPart = parts.slice(1).join('===TEST_RESULTS===').trim();

          // attempt to locate JSON array inside jsonPart
          let results = null;
          const firstBracket = jsonPart.indexOf('[');
          const lastBracket = jsonPart.lastIndexOf(']');
          if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            const jsonStr = jsonPart.substring(firstBracket, lastBracket + 1);
            try { results = JSON.parse(jsonStr); } catch (e) { results = null; }
          }

          // fallback: try to parse entire jsonPart
          if (!results) {
            try { results = JSON.parse(jsonPart); } catch (e) { results = null; }
          }

          setOutput(consoleOut);
          if (results) {
            const allOk = results.every(r => r.ok);
            setTestResult({ success: allOk, results, consoleOut });
            // Only show success when all tests passed and no execution stderr
            if (allOk && !data.stderr) {
              toast.success('All tests passed! 🎉');
            } else if (!allOk) {
              toast.error('Some tests failed. Check output for details.');
            }
          } else {
            setTestResult({ success: false, results: [{ ok: false, error: 'Could not parse test results' }], consoleOut });
            toast.error('Could not parse test results');
          }
        } else {
          // non-practice runs: show full stdout
          setOutput(stdout);
          toast.success('Code executed successfully!');
        }
        // handled above in practice-mode parsing
      })
      .catch(err => {
        setIsRunning(false);
        setOutput('Error connecting to execution service: ' + err.message + '\n\nPlease try again in a moment.');
        toast.error('Connection error. Please try again.');
      });
  };

  const saveProject = () => {
    fetch(api_base_url + "/updateProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
        jsCode: jsCode,
        pythonCode: pythonCode,
        phpCode: phpCode,
        javaCode: javaCode
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Project saved successfully");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        console.error("Error saving project:", err);
        alert("Failed to save project. Please try again.");
      });
  };

  // auto-run disabled; user clicks Run to execute

  useEffect(() => {
    if (practiceMode) {
      const p = problems.find(pp => pp.id === problemId);
      if (p) {
        setCurrentProblem(p);
        setProjectTitle(p.title);
        // prefill starter code for JS and Python
        if (p.starter) {
          if (p.starter.js) setJsCode(p.starter.js);
          if (p.starter.python) setPythonCode(p.starter.python);
        }
      }
    }
  }, [practiceMode, problemId]);

  useEffect(() => {
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.project) {
          if (data.project.jsCode) setJsCode(data.project.jsCode);
          if (data.project.pythonCode) setPythonCode(data.project.pythonCode);
          if (data.project.phpCode) setPhpCode(data.project.phpCode);
          if (data.project.javaCode) setJavaCode(data.project.javaCode);
          setProjectTitle(data.project.title); // Set project title
        }
      });
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, jsCode, pythonCode, phpCode, javaCode]);


  const activeTabClass = "bg-[#1E1E1E] text-white border-t-2 border-primary-purple";
  const inactiveTabClass = "bg-transparent text-gray-400 hover:text-white";

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col overflow-hidden">
      <EditiorNavbar projectTitle={projectTitle} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem (practice mode) or Editor */}
        {practiceMode ? (
          <div className="w-2/5 p-6 border-r border-[#2A2A35] overflow-auto">
            {!currentProblem ? (
              <div className="text-gray-300">Problem not found.</div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white">{currentProblem.title} <span className="ml-2 text-sm bg-green-600 text-black px-2 py-0.5 rounded-full">{currentProblem.difficulty}</span></h2>
                <p className="text-gray-300 mt-4">{currentProblem.description}</p>

                <div className="mt-6">
                  <h4 className="text-white font-semibold">Examples</h4>
                  <div className="mt-2 space-y-2">
                    {currentProblem.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-black/30 rounded">
                        <div className="text-sm text-gray-300">Input: <span className="text-green-300">{ex.input}</span></div>
                        <div className="text-sm text-gray-300">Output: <span className="text-green-300">{ex.output}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-400">
                  <div className="text-xs text-gray-400 mb-2">Constraints</div>
                  <div className="space-y-2">
                    {currentProblem?.constraints?.map((c, i) => (
                      <div key={i} className="inline-block w-full md:w-auto px-3 py-1 bg-black/20 rounded text-sm text-gray-200 font-mono">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

          <div className={practiceMode ? "w-3/5 flex flex-col" : `flex flex-col transition-all duration-300 ${isExpanded ? "w-full" : "w-1/2"} border-r border-[#2A2A35]`}>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 h-12 bg-[#141419] border-b border-[#2A2A35]">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['js', 'python', 'java', 'php'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setTab(lang)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${tab === lang ? 'text-white bg-[#1E1E1E]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-4">
              {/* Run Button */}
              <button
                onClick={run}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
              >
                <MdPlayArrow size={16} /> {isRunning ? 'RUNNING...' : 'RUN'}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language={tab === 'js' ? 'javascript' : tab}
              value={tab === 'js' ? jsCode : tab === 'python' ? pythonCode : tab === 'php' ? phpCode : javaCode}
              onChange={(value) => {
                const v = value || "";
                if (tab === 'js') setJsCode(v);
                else if (tab === 'python') setPythonCode(v);
                else if (tab === 'php') setPhpCode(v);
                else if (tab === 'java') setJavaCode(v);
              }}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
            {practiceMode && !isExpanded && (
              <div className="border-t border-[#2A2A35] bg-[#09090d] p-0">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="text-sm text-gray-300 font-semibold">Test Cases</div>
                </div>

                <div className="h-64 p-4 overflow-auto font-mono text-sm text-gray-300">
                  <div className="mt-2 space-y-2">
                    {testResult ? (
                      testResult.results.map((r, i) => (
                        <div key={i} className={`p-3 rounded ${r.ok ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${r.ok ? 'bg-green-400' : 'bg-red-400'} text-black`}>{r.ok ? '✓' : '✗'}</div>
                              <div className="text-sm text-gray-200">Test {i + 1}</div>
                            </div>
                            <div className="text-xs text-gray-300">{r.ok ? 'Passed' : 'Failed'}</div>
                          </div>
                          <div className="mt-2 text-xs text-gray-300 font-mono">expected: <span className="text-green-300">{String(r.expected)}</span></div>
                          <div className="text-xs text-yellow-300 font-mono">got: {String(r.got)}</div>
                          {r.error && <div className="mt-2 text-xs text-red-300">Error: {r.error}</div>}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-black/20 rounded text-sm text-gray-400">No test results yet. Run to execute tests.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* Right Panel: Output/Preview for non-practice mode or practice-mode test/results */}
        {!isExpanded && !practiceMode && (
          <div className={`w-1/2 flex flex-col bg-[#0A0A0F]`}>
            <div className="h-12 flex items-center px-4 bg-[#141419] border-b border-[#2A2A35]">
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                {tab === 'js' ? 'Live Preview' : 'Terminal Output'}
              </span>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="w-full h-full p-4 font-mono text-sm overflow-auto text-gray-300 whitespace-pre-wrap">
                {output || <span className="text-gray-600 italic">Click Run to execute code...</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default Editior;
