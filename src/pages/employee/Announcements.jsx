import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatDistanceToNow, format } from "date-fns";
import { 
    Megaphone, 
    Send,
    Image as ImageIcon
} from "lucide-react";
import API from "../../api/axios";
import AnnouncementItem from "../../components/announcements/AnnouncementItem";

export default function EmployeeAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [commentData, setCommentData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    const fetchAnnouncements = async () => {
        try {
            const res = await API.get("/announcements");
            setAnnouncements(res.data.announcements);
        } catch (error) {
            toast.error("Failed to load news feed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        API.get("/auth/me").then(res => setCurrentUser(res.data.data)).catch(() => {});
        fetchAnnouncements();
    }, []);

    // ─── Post Actions ───
    const onSubmitPost = async (data) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            if (data.image && data.image[0]) formData.append("image", data.image[0]);

            await API.post("/announcements", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Post created successfully!");
            reset();
            fetchAnnouncements();
        } catch (error) {
            toast.error("Failed to create post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("Delete your post?")) return;
        try {
            await API.delete(`/announcements/${id}`);
            setAnnouncements(announcements.filter(a => a._id !== id));
            toast.success("Post deleted");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const toggleLike = async (id) => {
        try {
            const res = await API.put(`/announcements/${id}/like`);
            setAnnouncements(announcements.map(a => 
                a._id === id ? { ...a, likes: res.data.likes } : a
            ));
        } catch (error) {
            toast.error("Failed to toggle like");
        }
    };

    // ─── Comment Actions ───
    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        if (!commentData[postId] || commentData[postId].trim() === "") return;
        
        try {
            const res = await API.post(`/announcements/${postId}/comments`, {
                text: commentData[postId]
            });
            setAnnouncements(announcements.map(a => 
                a._id === postId ? { ...a, comments: res.data.comments } : a
            ));
            setCommentData({ ...commentData, [postId]: "" });
            toast.success("Comment added");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Delete your comment?")) return;
        try {
            const res = await API.delete(`/announcements/${postId}/comments/${commentId}`);
            setAnnouncements(announcements.map(a => 
                a._id === postId ? { ...a, comments: res.data.comments } : a
            ));
            toast.success("Comment deleted");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex items-center justify-between">
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                        <Megaphone className="w-3.5 h-3.5" />
                        Company Connect
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        The Hub
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base font-medium">Stay up to date with company news and share updates with your team.</p>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-bl from-indigo-100/50 to-transparent pointer-events-none" />
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />
                <div className="absolute right-20 -bottom-12 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Create post form */}
                <div className="lg:col-span-5 relative order-first lg:sticky lg:top-6 self-start">
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                    {currentUser?.avatar ? (
                        <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-200" alt="me" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm uppercase border border-indigo-200">
                            {currentUser?.name?.charAt(0) || "U"}
                        </div>
                    )}
                    <h2 className="text-base font-bold text-slate-800">Share something with the team...</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmitPost)}>
                    <input
                         {...register("title", { required: true })}
                         className="w-full bg-transparent border-b border-slate-200 px-2 py-3 text-sm focus:border-indigo-500 outline-none font-bold text-slate-800 placeholder-slate-400 mb-3 transition-colors"
                         placeholder="Subject / Title"
                    />
                    <textarea
                        {...register("content", { required: true })}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-400 resize-none mb-3"
                        placeholder="What's on your mind?"
                    />
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all text-slate-500">
                        <ImageIcon className="w-5 h-5" />
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className="w-full text-sm font-medium file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-end mt-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                        >
                            {isSubmitting ? "Posting..." : "Post Update"}
                            {!isSubmitting && <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
                    </div>
                </div>

                {/* Feed */}
                <div className="lg:col-span-7 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center text-slate-500">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Megaphone className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">The feed is quiet!</h3>
                        <p className="mt-2 text-sm">There are no updates to display right now.</p>
                    </div>
                ) : (
                    announcements.map((post) => (
                        <AnnouncementItem
                            key={post._id}
                            post={post}
                            currentUser={currentUser}
                            handleDeletePost={handleDeletePost}
                            toggleLike={toggleLike}
                            handleCommentSubmit={handleCommentSubmit}
                            handleDeleteComment={handleDeleteComment}
                            commentData={commentData}
                            setCommentData={setCommentData}
                        />
                    ))
                )}
                </div>
            </div>
        </div>
    );
}
