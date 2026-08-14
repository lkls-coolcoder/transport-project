import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquarePlus, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Link2, 
  FileText, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { FeedbackReport } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackReport['type']>('broken_link');
  const [urlOrLocation, setUrlOrLocation] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [existingReports, setExistingReports] = useState<FeedbackReport[]>([]);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setExistingReports(data.items || []);
      }
    } catch (err) {
      console.warn('Failed to load feedback logs:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReports();
      setSubmittedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          urlOrLocation,
          details,
          userEmail: email
        })
      });

      if (res.ok) {
        setSubmittedSuccess(true);
        setDetails('');
        setUrlOrLocation('');
        setEmail('');
        fetchReports();
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl text-slate-800 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quality Assurance</h3>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Feedback & Broken Link Reporting Center</h2>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="my-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
            <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Report Successfully Logged</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you! Our automated telemetry pipeline and operations team have received your report and will verify data integrity.
            </p>
            <button
              onClick={() => setSubmittedSuccess(false)}
              className="mt-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-xs"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Issue Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'broken_link', label: 'Broken Link / 404', icon: Link2 },
                  { id: 'transit_delay', label: 'Transit Mismatch', icon: AlertTriangle },
                  { id: 'incorrect_traffic', label: 'Inaccurate Delay', icon: FileText },
                  { id: 'weather_hazard', label: 'Weather Hazard', icon: AlertTriangle },
                  { id: 'general_feedback', label: 'Platform Feedback', icon: MessageSquarePlus }
                ].map(cat => {
                  const Icon = cat.icon;
                  const isSelected = feedbackType === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFeedbackType(cat.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs flex items-center space-x-2 transition-colors ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0 text-indigo-600" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Defective URL or Specific Route Location
              </label>
              <input
                type="text"
                value={urlOrLocation}
                onChange={(e) => setUrlOrLocation(e.target.value)}
                placeholder="e.g. /transit/live-mta-subway-map or Broadway 7th Ave Line"
                className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Observation <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what went wrong, missing links, or unexpected transit disruptions..."
                className="w-full bg-slate-50 text-xs text-slate-900 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commuter@example.com"
                  className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !details}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Quality Report'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Live Operational Log */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent Community Reports & Resolution Status</span>
          </h4>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {existingReports.map(rep => (
              <div key={rep.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{rep.id}</span>
                    <span className="font-bold text-slate-900">{rep.urlOrLocation}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{rep.details}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rep.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {rep.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
