// @ts-nocheck
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";

const gradeStyles = {
  Excellent: "bg-emerald-100 text-emerald-700",
  Good: "bg-blue-100 text-blue-700",
  Average: "bg-amber-100 text-amber-700",
  "Needs Improvement": "bg-orange-100 text-orange-700",
  Poor: "bg-red-100 text-red-700",
};

const statusStyles = {
  Draft: "bg-slate-100 text-slate-600",
  Submitted: "bg-blue-100 text-blue-700",
  Acknowledged: "bg-violet-100 text-violet-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

export default function EmployeePerformance() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/performance");
        setReviews(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch performance reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading your performance reviews...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl pb-8">
      <div className="absolute inset-0 bg-[url('/performance.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative z-10 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight p-1">My Performance</h2>
        <p className="text-sm text-slate-400 mt-0.5">Track your review history and feedback</p>
      </div>

      <section className="bg-white/88 rounded-2xl border border-slate-100 shadow-sm overflow-hidden backdrop-blur-[1px]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900">Review History</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">{reviews.length} reviews</span>
        </div>

        <div className="divide-y divide-slate-50">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <div className="text-4xl mb-3">📈</div>
              <p className="text-sm font-semibold text-slate-500">No reviews found</p>
              <p className="text-xs mt-1">Your performance reviews will appear here once HR publishes them</p>
            </div>
          ) : (
            reviews.map((review) => {
              const gradeClass = gradeStyles[review.grade] || "bg-slate-100 text-slate-600";
              const statusClass = statusStyles[review.status] || "bg-slate-100 text-slate-600";

              return (
                <div key={review._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{review.reviewCycle} {review.year}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Reviewer: {review.reviewerName || "HR Team"}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${gradeClass}`}>{review.grade || "N/A"}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}>{review.status || "Draft"}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Score</p>
                      <p className="text-2xl font-extrabold text-slate-900">{review.overallScore ?? "--"}<span className="text-sm text-slate-400 font-semibold"> / 100</span></p>
                    </div>
                    {review.incrementRecommended && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">+{review.incrementPercent || 0}% Increment</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
