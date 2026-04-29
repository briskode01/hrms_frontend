import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Pin, User, Clock, Trash2, Heart, MessageCircle, Send } from "lucide-react";
import API from "../../api/axios";

const AnnouncementItem = ({
  post,
  currentUser,
  handleDeletePost,
  toggleLike,
  handleCommentSubmit,
  handleDeleteComment,
  commentData,
  setCommentData,
}) => {
  const isLikedByMe = currentUser && post.likes?.includes(currentUser._id);
  const isMyPost = currentUser && post.author?._id === currentUser._id;
  const canDeletePost = !currentUser || isMyPost; // Admin (no currentUser passed) or owner

  // const serverUrl = API.defaults.baseURL.replace("/api", "");

  return (
    <div className="group bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
      {post.isPinned && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-xl shadow-sm flex items-center gap-1">
          <Pin className="w-3 h-3 fill-white" /> Pinned
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt="author"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold flex items-center justify-center border-2 border-white shadow-sm text-lg uppercase">
              {post.author?.name?.charAt(0) || <User className="w-5 h-5" />}
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-900 leading-none">
              {post.author?.name || "Unknown Author"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
                {post.author?.role}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {canDeletePost && (
          <div className="flex gap-2">
            <button
              onClick={() => handleDeletePost(post._id)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{post.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">
          {post.content}
        </p>

        {post.image && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200">
            <img
              src={`http://localhost:8000${post.image}`}
              alt="Announcement Attachment"
              className="w-full h-auto max-h-96 object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}

        <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4 pb-4">
          <button
            onClick={() => toggleLike(post._id)}
            className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${isLikedByMe || post.likes?.length > 0 ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
              }`}
          >
            <Heart
              className={`w-5 h-5 ${isLikedByMe || post.likes?.length > 0 ? "fill-rose-500 border-rose-500" : ""}`}
            />
            <span>{post.likes?.length || 0}</span>
          </button>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 mt-2 space-y-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c) => {
              const isMyComment = currentUser && c.user?._id === currentUser._id;
              const canDeleteComment = !currentUser || isMyComment;

              return (
                <div key={c._id} className="flex gap-3 group/comment relative">
                  {c.user?.avatar ? (
                    <img
                      src={c.user.avatar}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                      alt="avatar"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs uppercase border border-slate-300">
                      {c.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex-1 text-sm relative border border-slate-100">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-slate-800">
                        {c.user?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDistanceToNow(new Date(c.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                  {/* Delete comment */}
                  {canDeleteComment && (
                    <button
                      onClick={() => handleDeleteComment(post._id, c._id)}
                      className="absolute -right-2 -top-2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover/comment:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-2 font-medium">
              No comments yet
            </p>
          )}

          {/* Add comment form */}
          <form
            onSubmit={(e) => handleCommentSubmit(e, post._id)}
            className="flex gap-3 pt-2 relative"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs uppercase">
              Me
            </div>
            <input
              type="text"
              value={commentData[post._id] || ""}
              onChange={(e) =>
                setCommentData({ ...commentData, [post._id]: e.target.value })
              }
              placeholder="Write a comment..."
              className="flex-1 bg-white border border-slate-200 rounded-full px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 pr-10"
            />
            <button
              type="submit"
              disabled={!commentData[post._id]?.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementItem;
