import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdAdd, MdThumbUp, MdChatBubbleOutline, MdVisibility, MdCode } from 'react-icons/md';
import Avatar from 'react-avatar';

const QnA = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLanguage, setFilterLanguage] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${api_base_url}/questions/list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    search: searchQuery,
                    language: filterLanguage || undefined,
                    sortBy,
                    page,
                    limit: 10
                })
            });
            const data = await response.json();
            if (data.success) {
                setQuestions(data.questions);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [searchQuery, filterLanguage, sortBy, page]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0f0f0f] text-white p-8 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                Community Q&A
                            </h1>
                            <p className="text-gray-400 text-lg">Ask questions, share knowledge, and grow together.</p>
                        </div>
                        <button
                            onClick={() => navigate('/qna/ask')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            <MdAdd size={24} />
                            Ask a Question
                        </button>
                    </div>

                    {/* Controls Bar */}
                    <div className="glass p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-elevated border border-white/5">
                        <div className="relative w-full md:w-96 group">
                            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-gray-700/50 focus:border-purple-500/50 rounded-xl py-3 pl-12 pr-4 text-gray-200 outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-48">
                                <select
                                    value={filterLanguage}
                                    onChange={(e) => setFilterLanguage(e.target.value)}
                                    className="w-full appearance-none bg-[#1a1a1a] border border-gray-700/50 rounded-xl py-3 px-4 text-gray-300 outline-none focus:border-purple-500/50 cursor-pointer"
                                >
                                    <option value="">All Languages</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="php">PHP</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                </select>
                                <MdFilterList className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>

                            <div className="bg-[#1a1a1a] p-1 rounded-xl border border-gray-700/50 flex">
                                {['newest', 'votes', 'unanswered'].map((sort) => (
                                    <button
                                        key={sort}
                                        onClick={() => setSortBy(sort)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${sortBy === sort
                                                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-purple-400 border border-purple-500/20 shadow-sm'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                            }`}
                                    >
                                        {sort}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Questions Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400 animate-pulse">Loading amazing questions...</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-20 bg-[#1a1a1a]/50 rounded-2xl border border-white/5 border-dashed">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MdSearch size={40} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">No questions found</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Be the first to ask about this topic or try adjusting your search filters.</p>
                            <button
                                onClick={() => navigate('/qna/ask')}
                                className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
                            >
                                Ask a Question &rarr;
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {questions.map((question) => (
                                <div
                                    key={question._id}
                                    onClick={() => navigate(`/qna/${question._id}`)}
                                    className="group glass p-6 rounded-2xl hover:bg-[#1f1f1f]/80 transition-all border border-white/5 hover:border-purple-500/30 cursor-pointer shadow-elevated relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>

                                    <div className="flex gap-6">
                                        {/* Stats Column */}
                                        <div className="flex flex-col gap-2 min-w-[80px] text-center">
                                            <div className="bg-[#151515] p-2 rounded-xl border border-white/5">
                                                <span className="block text-lg font-bold text-gray-200">{question.votes}</span>
                                                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Votes</span>
                                            </div>
                                            <div className={`p-2 rounded-xl border ${question.isResolved ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#151515] border-white/5 text-gray-400'}`}>
                                                <span className="block text-lg font-bold">{question.answerCount}</span>
                                                <span className="text-[10px] uppercase font-semibold tracking-wider">Answers</span>
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold text-gray-100 group-hover:text-purple-400 transition-colors line-clamp-1 pr-10">
                                                    {question.title}
                                                </h3>
                                                {question.language && question.language !== 'other' && (
                                                    <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                                                        {question.language}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                                                {question.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex gap-2">
                                                    {question.tags.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#252525] text-gray-400 text-xs hover:bg-[#333] transition-colors border border-white/5">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {question.tags.length > 3 && (
                                                        <span className="px-2 py-1 text-xs text-gray-500">+{question.tags.length - 3}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5" title="Views">
                                                        <MdVisibility className="text-gray-600" />
                                                        {question.views}
                                                    </div>
                                                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                                    <div className="flex items-center gap-2 pl-2 border-l border-gray-700/50">
                                                        <Avatar name={question.askedBy.name} size="24" round={true} className="opacity-80" />
                                                        <span className="group-hover:text-gray-300 transition-colors">{question.askedBy.username}</span>
                                                        <span className="text-gray-600">•</span>
                                                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#252525] transition-colors"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${page === p
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-[#1a1a1a] border border-white/10 text-gray-400 hover:bg-[#252525] hover:text-white'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#252525] transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default QnA;
