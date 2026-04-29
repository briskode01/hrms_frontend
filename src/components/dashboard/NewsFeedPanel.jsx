import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Megaphone, Pin, ArrowRight } from "lucide-react";
import API from "@/api/axios";

export default function NewsFeedPanel({ setActiveTab }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await API.get("/announcements");
                setAnnouncements(res.data.announcements.slice(0, 3)); // show top 3
            } catch (error) {
                // Ignore error silently
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    // const serverUrl = API.defaults.baseURL.replace("/api", "");

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-indigo-500" />
                        Company Connect
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Latest announcements and news</p>
                </div>
                <button
                    onClick={() => setActiveTab("announcements")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {announcements.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                        <Megaphone className="w-10 h-10 text-slate-200 mb-2" />
                        <p className="text-sm font-medium">No recent announcements</p>
                    </div>
                ) : (
                    announcements.map((post) => (
                        <div
                            key={post._id}
                            className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => setActiveTab("announcements")}
                        >
                            {post.isPinned && (
                                <div className="absolute top-0 right-0 z-10 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-bl-lg shadow-sm flex items-center gap-1">
                                    <Pin className="w-2.5 h-2.5 fill-white" />
                                </div>
                            )}

                            <div className="flex gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 leading-tight pr-12 lg:pr-0">{post.title}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.content}</p>
                                </div>
                                {post.image && (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm z-0 relative">
                                        <img
                                            src={`https://sportyfi.com/images${post.image}`}
                                            alt="Announcement preview"
                                            className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50">
                                <div className="flex items-center gap-2">
                                    {post.author?.avatar ? (
                                        <img src={post.author.avatar} alt="author" className="w-5 h-5 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px] uppercase">
                                            {post.author?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <span className="text-[11px] font-semibold text-slate-700">{post.author?.name || "Management"}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
