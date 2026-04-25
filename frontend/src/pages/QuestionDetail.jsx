import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Editor from '@monaco-editor/react';
import { api_base_url } from '../helper';
import { MdThumbUp, MdThumbDown, MdChatBubbleOutline, MdCheckCircle, MdArrowBack, MdPerson, MdCalendarToday, MdAccessTime, MdCode, MdShare, MdDelete, MdEdit } from 'react-icons/md';
import Avatar from 'react-avatar';
import { toast } from 'react-toastify';

const QuestionDetail = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [replyCode, setReplyCode] = useState('');
    const [showReplyEditor, setShowReplyEditor] = useState(false);
    const [postingAnswer, setPostingAnswer] = useState(false);

    // Comment states
    const [commentInputs, setCommentInputs] = useState({});
    const [commentsVisible, setCommentsVisible] = useState({});
    const [questionComments, setQuestionComments] = useState([]);
    const [answerComments, setAnswerComments] = useState({});

    // Fetch data
    const fetchData = async () => {
        try {
            const res = await fetch(`${api_base_url}/questions/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId })
            });
            const data = await res.json();
            if (data.success) {
                setQuestion(data.question);
                setAnswers(data.answers);

                // Load comments
                fetchComments(questionId, 'Question');
                data.answers.forEach(ans => fetchComments(ans._id, 'Answer'));
            } else {
                toast.error('Question not found');
                navigate('/qna');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load question');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (parentId, parentType) => {
        try {
            const res = await fetch(`${api_base_url}/comments/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parentId, parentType })
            });
            const data = await res.json();
            if (data.success) {
                if (parentType === 'Question') setQuestionComments(data.comments);
                else setAnswerComments(prev => ({ ...prev, [parentId]: data.comments }));
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchData();
        // Increment view count
        if (userId) {
            fetch(`${api_base_url}/questions/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, userId })
            }).then(res => res.json()).then(data => {
                if (data.success && data.views !== undefined) {
                    setQuestion(prev => ({ ...prev, views: data.views }));
                }
            });
        } else {
            fetch(`${api_base_url}/questions/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId })
            });
        }
    }, [questionId, userId]);

    const handleVote = async (type, id, voteType) => {
        if (!userId) { toast.warn("Please login to vote"); return; }
        const endpoint = type === 'question' ? '/questions/vote' : '/answers/vote';
        const body = type === 'question' ? { questionId: id, voteType, userId } : { answerId: id, voteType, userId };

        try {
            const res = await fetch(`${api_base_url}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                if (type === 'question') {
                    setQuestion(prev => ({ ...prev, votes: data.votes, upvotedBy: data.hasUpvoted ? [...prev.upvotedBy, userId] : prev.upvotedBy.filter(u => u !== userId), downvotedBy: data.hasDownvoted ? [...prev.downvotedBy, userId] : prev.downvotedBy.filter(u => u !== userId) }));
                } else {
                    setAnswers(prev => prev.map(a => a._id === id ? { ...a, votes: data.votes, upvotedBy: data.hasUpvoted ? [...a.upvotedBy, userId] : a.upvotedBy.filter(u => u !== userId), downvotedBy: data.hasDownvoted ? [...a.downvotedBy, userId] : a.downvotedBy.filter(u => u !== userId) } : a));
                }
            } else {
                toast.error(data.message);
            }
        } catch (err) { toast.error("Voting failed"); }
    };

    const postAnswer = async () => {
        if (!replyContent.trim()) { toast.warn("Answer cannot be empty"); return; }
        setPostingAnswer(true);
        try {
            const res = await fetch(`${api_base_url}/answers/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, questionId, content: replyContent, code: replyCode })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Answer posted!");
                setReplyContent('');
                setReplyCode('');
                setShowReplyEditor(false);
                fetchData();
            } else toast.error(data.message);
        } catch (err) { toast.error("Failed to post answer"); }
        finally { setPostingAnswer(false); }
    };

    const postComment = async (parentId, parentType) => {
        const content = commentInputs[parentId];
        if (!content?.trim()) return;

        try {
            const res = await fetch(`${api_base_url}/comments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, parentId, parentType, content })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Comment added");
                setCommentInputs(prev => ({ ...prev, [parentId]: '' }));
                fetchComments(parentId, parentType);
            }
        } catch (err) { toast.error("Comment failed"); }
    };

    const acceptAnswer = async (answerId) => {
        try {
            const res = await fetch(`${api_base_url}/answers/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, questionId, answerId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Answer accepted!");
                fetchData();
            }
        } catch (err) { toast.error("Action failed"); }
    };

    const handleDeleteQuestion = async () => {
        if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${api_base_url}/questions/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, questionId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Question deleted successfully");
                navigate('/qna');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete question");
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
            <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-8">
                <div className="max-w-6xl mx-auto">
                    <button onClick={() => navigate('/qna')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors">
                        <MdArrowBack /> Back to Q&A
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                        {/* Main Content */}
                        <div className="space-y-6">
                            {/* Question Card */}
                            <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="flex gap-6">
                                    {/* Voting Side */}
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => handleVote('question', question._id, 'upvote')}
                                            className={`p-3 rounded-xl transition-all ${question.upvotedBy.includes(userId) ? 'bg-orange-500/20 text-orange-500 ring-1 ring-orange-500/50' : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#252525] hover:text-orange-400'}`}
                                        >
                                            <MdThumbUp size={24} />
                                        </button>
                                        <span className={`text-xl font-bold ${question.votes > 0 ? 'text-orange-400' : question.votes < 0 ? 'text-red-400' : 'text-gray-400'}`}>{question.votes}</span>
                                        <button
                                            onClick={() => handleVote('question', question._id, 'downvote')}
                                            className={`p-3 rounded-xl transition-all ${question.downvotedBy.includes(userId) ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/50' : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#252525] hover:text-red-400'}`}
                                        >
                                            <MdThumbDown size={24} />
                                        </button>
                                    </div>

                                    {/* Question Body */}
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{question.title}</h1>

                                        <div className="prose prose-invert max-w-none text-gray-300 mb-6 leading-relaxed">
                                            {question.description}
                                        </div>

                                        {question.code && (
                                            <div className="mb-6 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
                                                <div className="bg-[#1e1e1e] px-4 py-2 border-b border-gray-700/50 text-xs text-gray-500 font-mono uppercase">
                                                    {question.language} snippet
                                                </div>
                                                <Editor
                                                    height="250px"
                                                    language={question.language}
                                                    value={question.code}
                                                    theme="vs-dark"
                                                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {question.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium">#{tag}</span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={question.askedBy.name} size="36" round={true} className="border-2 border-white/10" />
                                                <div className="text-sm">
                                                    <span className="block text-white font-medium">{question.askedBy.username}</span>
                                                    <span className="text-gray-500 text-xs">Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setCommentsVisible(prev => ({ ...prev, [question._id]: !prev[question._id] }))}
                                                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
                                                >
                                                    <MdChatBubbleOutline size={18} /> {questionComments.length} Comments
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                                    <MdShare size={18} /> Share
                                                </button>
                                                {question.askedBy._id === userId && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/qna/edit/${question._id}`)}
                                                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                                                        >
                                                            <MdEdit size={18} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={handleDeleteQuestion}
                                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                                                        >
                                                            <MdDelete size={18} /> Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Question Comments */}
                                        {commentsVisible[question._id] && (
                                            <div className="mt-6 bg-[#151515] rounded-xl p-4 border border-white/5 animate-slideDown">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Comments</h4>
                                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                    {questionComments.map(c => (
                                                        <div key={c._id} className="text-sm bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                                                            <span className="text-blue-400 font-semibold">{c.commentedBy.username}</span>
                                                            <span className="text-gray-400 ml-2">{c.content}</span>
                                                            <span className="text-gray-600 text-xs ml-2 opacity-60">• {new Date(c.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    ))}
                                                    {questionComments.length === 0 && <p className="text-gray-600 text-sm italic">No comments yet.</p>}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={commentInputs[question._id] || ''}
                                                        onChange={e => setCommentInputs(prev => ({ ...prev, [question._id]: e.target.value }))}
                                                        placeholder="Add a comment..."
                                                        className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                    <button onClick={() => postComment(question._id, 'Question')} className="text-blue-500 hover:bg-blue-500/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Post</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-bold text-white">{answers.length} Answers</h3>
                                <div className="text-sm text-gray-500 bg-[#1a1a1a] px-3 py-1 rounded-lg border border-white/5">
                                    Sorted by Votes
                                </div>
                            </div>

                            {/* Answers List */}
                            <div className="space-y-4">
                                {answers.map(ans => (
                                    <div key={ans._id} className={`glass p-6 rounded-2xl border ${ans.isAccepted ? 'border-green-500/50 bg-green-500/5' : 'border-white/5'} shadow-lg transition-all`}>
                                        {ans.isAccepted && (
                                            <div className="flex items-center gap-2 text-green-400 mb-4 bg-green-500/10 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                <MdCheckCircle size={16} /> Accepted Solution
                                            </div>
                                        )}

                                        <div className="flex gap-5">
                                            <div className="flex flex-col items-center gap-2 pt-1">
                                                <button
                                                    onClick={() => handleVote('answer', ans._id, 'upvote')}
                                                    className={`p-2 rounded-lg transition-all ${ans.upvotedBy.includes(userId) ? 'text-blue-500 bg-blue-500/20' : 'text-gray-500 hover:bg-[#222]'}`}
                                                >
                                                    <MdThumbUp size={20} />
                                                </button>
                                                <span className="font-bold text-gray-300">{ans.votes}</span>
                                                <button
                                                    onClick={() => handleVote('answer', ans._id, 'downvote')}
                                                    className={`p-2 rounded-lg transition-all ${ans.downvotedBy.includes(userId) ? 'text-red-500 bg-red-500/20' : 'text-gray-500 hover:bg-[#222]'}`}
                                                >
                                                    <MdThumbDown size={20} />
                                                </button>

                                                {!question.isResolved && question.askedBy._id === userId && (
                                                    <button
                                                        onClick={() => acceptAnswer(ans._id)}
                                                        className="mt-2 text-gray-500 hover:text-green-500 transition-colors tooltip"
                                                        title="Mark as accepted"
                                                    >
                                                        <MdCheckCircle size={24} className="opacity-50 hover:opacity-100" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="prose prose-invert max-w-none text-gray-300 mb-4 whitespace-pre-wrap text-sm leading-relaxed">
                                                    {ans.content}
                                                </div>

                                                {ans.code && (
                                                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-700/50 bg-[#1e1e1e]">
                                                        <Editor
                                                            height="150px"
                                                            language={question.language}
                                                            value={ans.code}
                                                            theme="vs-dark"
                                                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12, lineNumbers: 'off' }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-sm">
                                                    <button
                                                        onClick={() => setCommentsVisible(prev => ({ ...prev, [ans._id]: !prev[ans._id] }))}
                                                        className="text-gray-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <MdChatBubbleOutline /> {answerComments[ans._id]?.length || 0} Comments
                                                    </button>

                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <span>Answered by</span>
                                                        <span className="text-blue-400 font-medium">{ans.answeredBy.username}</span>
                                                        <span className="text-xs opacity-60">{new Date(ans.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {/* Answer Comments */}
                                                {commentsVisible[ans._id] && (
                                                    <div className="mt-4 bg-[#151515] rounded-xl p-3 border border-white/5 animate-slideDown">
                                                        <div className="space-y-2 mb-3">
                                                            {answerComments[ans._id]?.map(c => (
                                                                <div key={c._id} className="text-sm flex gap-2">
                                                                    <span className="text-blue-400 font-bold whitespace-nowrap">{c.commentedBy.username}:</span>
                                                                    <span className="text-gray-400">{c.content}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={commentInputs[ans._id] || ''}
                                                                onChange={e => setCommentInputs(prev => ({ ...prev, [ans._id]: e.target.value }))}
                                                                placeholder="Reply..."
                                                                className="flex-1 bg-transparent border-b border-gray-700 px-2 py-1 text-sm outline-none focus:border-blue-500"
                                                            />
                                                            <button onClick={() => postComment(ans._id, 'Answer')} className="text-xs font-bold text-blue-500 uppercase">Post</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Editor */}
                            <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 shadow-2xl">
                                <h3 className="text-lg font-bold text-white mb-4">Your Answer</h3>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="w-full bg-[#1e1e1e] border border-gray-700/50 rounded-xl p-4 text-gray-300 outline-none focus:border-blue-500/50 transition-colors min-h-[120px] mb-4"
                                    placeholder="Write your solution here..."
                                ></textarea>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setShowReplyEditor(!showReplyEditor)}
                                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                                    >
                                        <MdCode /> {showReplyEditor ? 'Remove Code' : 'Add Code'}
                                    </button>

                                    <button
                                        onClick={postAnswer}
                                        disabled={postingAnswer}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {postingAnswer ? 'Posting...' : 'Post Answer'}
                                    </button>
                                </div>

                                {showReplyEditor && (
                                    <div className="mt-4 border border-gray-700/50 rounded-xl overflow-hidden animate-slideUp">
                                        <Editor
                                            height="200px"
                                            language={question.language}
                                            value={replyCode}
                                            onChange={(val) => setReplyCode(val)}
                                            theme="vs-dark"
                                            options={{ minimap: { enabled: false }, fontSize: 13 }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                            <div className="glass p-5 rounded-2xl border border-white/5">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#1a1a1a] p-3 rounded-xl">
                                        <span className="block text-xl font-bold text-white">{question.views}</span>
                                        <span className="text-xs text-gray-500">Views</span>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-3 rounded-xl">
                                        <span className="block text-xl font-bold text-white">{answers.length}</span>
                                        <span className="text-xs text-gray-500">Answers</span>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-3 rounded-xl">
                                        <span className="block text-xl font-bold text-white">{question.votes}</span>
                                        <span className="text-xs text-gray-500">Score</span>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-3 rounded-xl">
                                        <span className={`block text-xl font-bold ${question.isResolved ? 'text-green-500' : 'text-yellow-500'}`}>{question.isResolved ? 'Yes' : 'No'}</span>
                                        <span className="text-xs text-gray-500">Resolved</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionDetail;
