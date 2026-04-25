import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Editor from '@monaco-editor/react';
import { api_base_url } from '../helper';
import { MdCode, MdArrowBack, MdSend, MdClose, MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';

const AskQuestion = () => {
    const navigate = useNavigate();
    const { questionId } = useParams();
    const isEditMode = !!questionId;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchQuestionData();
        }
    }, [questionId]);

    const fetchQuestionData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api_base_url}/questions/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId })
            });
            const data = await res.json();
            if (data.success) {
                const q = data.question;
                // Check if current user is the author
                if (q.askedBy._id !== localStorage.getItem('userId')) {
                    toast.error("You can only edit your own questions");
                    navigate('/qna');
                    return;
                }
                setTitle(q.title);
                setDescription(q.description);
                setCode(q.code || '');
                setLanguage(q.language || 'javascript');
                setTags(q.tags || []);
                setShowCodeEditor(!!q.code);
            } else {
                toast.error("Question not found");
                navigate('/qna');
            }
        } catch (error) {
            toast.error("Failed to fetch question");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (tags.length < 5 && !tags.includes(tagInput.trim().toLowerCase())) {
                setTags([...tags, tagInput.trim().toLowerCase()]);
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error('Please fill in the title and description.');
            return;
        }

        setSubmitting(true);
        try {
            const endpoint = isEditMode ? '/questions/update' : '/questions/create';
            const body = {
                userId: localStorage.getItem('userId'),
                title,
                description,
                code,
                language,
                tags
            };

            if (isEditMode) {
                body.questionId = questionId;
            }

            const response = await fetch(`${api_base_url}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (data.success) {
                toast.success(isEditMode ? 'Question updated successfully!' : 'Question posted successfully!');
                navigate(`/qna/${isEditMode ? questionId : data.questionId}`);
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to connect to the server');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0f0f0f] text-white p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate(isEditMode ? `/qna/${questionId}` : '/qna')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                    >
                        <MdArrowBack className="group-hover:-translate-x-1 transition-transform" /> Back to {isEditMode ? 'Question' : 'Q&A'}
                    </button>

                    <div className="glass p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                        <h1 className="text-3xl font-bold mb-2">{isEditMode ? 'Edit Question' : 'Ask a Public Question'}</h1>
                        <p className="text-gray-400 mb-8">{isEditMode ? 'Update your question details below.' : 'Be specific and imagine you\'re asking a question to another person.'}</p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                                    className="w-full bg-[#151515] border border-gray-700 focus:border-purple-500 rounded-xl px-5 py-4 text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                                />
                                <p className="text-xs text-gray-500 text-right">{title.length}/200</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Select Language</label>
                                <div className="relative">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full bg-[#151515] border border-gray-700 focus:border-purple-500 rounded-xl px-5 py-4 text-white outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="php">PHP</option>
                                        <option value="html">HTML</option>
                                        <option value="css">CSS</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Description</label>
                                <div className="bg-[#151515] border border-gray-700 rounded-xl overflow-hidden focus-within:border-purple-500 transition-colors">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Include all the information someone would need to answer your question..."
                                        className="w-full bg-transparent p-5 text-gray-300 outline-none h-64 resize-y leading-relaxed"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                        <MdCode size={18} className="text-blue-400" /> Code Snippet <span className="text-gray-600 normal-case font-normal">(Optional)</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        {showCodeEditor ? 'Remove Snippet' : '+ Add Code Snippet'}
                                    </button>
                                </div>

                                {showCodeEditor && (
                                    <div className="animate-slideDown space-y-3">
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="bg-[#222] border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="html">HTML</option>
                                            <option value="css">CSS</option>
                                        </select>
                                        <div className="border border-gray-700 rounded-xl overflow-hidden shadow-inner">
                                            <Editor
                                                height="300px"
                                                language={language}
                                                value={code}
                                                onChange={(val) => setCode(val)}
                                                theme="vs-dark"
                                                options={{
                                                    minimap: { enabled: false },
                                                    fontSize: 14,
                                                    padding: { top: 16 }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Tags</label>
                                <div className="bg-[#151515] border border-gray-700 rounded-xl px-4 py-3 flex flex-wrap gap-2 focus-within:border-purple-500 transition-colors">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-purple-500/30">
                                            #{tag}
                                            <MdClose
                                                className="cursor-pointer hover:text-purple-100"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder={tags.length < 5 ? (tags.length === 0 ? "e.g. javascript, react (Press Enter to add)" : "") : "Max 5 tags reached"}
                                        disabled={tags.length >= 5}
                                        className="bg-transparent outline-none flex-1 min-w-[120px] text-gray-300 placeholder:text-gray-600"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Add up to 5 tags to describe what your question is about.</p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(isEditMode ? `/qna/${questionId}` : '/qna')}
                                    className="px-6 py-3 rounded-xl text-gray-400 hover:text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                                >
                                    {submitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>{isEditMode ? 'Update' : 'Post'} Question <MdSend /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AskQuestion;
