
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const FunctionDisplay = ({ toolCall }) => {
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;

    const parsedResults = (() => {
        if (!results) return null;
        try {
            return typeof results === 'string' ? JSON.parse(results) : results;
        } catch {
            return results;
        }
    })();

    const isError = results && (
        (typeof results === 'string' && /error|failed/i.test(results)) ||
        (parsedResults?.success === false)
    );

    const statusConfig = {
        pending: { icon: Clock, color: 'text-slate-400', text: 'قيد الانتظار' },
        running: { icon: Loader2, color: 'text-slate-500', text: 'جاري التشغيل...', spin: true },
        in_progress: { icon: Loader2, color: 'text-slate-500', text: 'جاري التشغيل...', spin: true },
        completed: isError ?
            { icon: AlertCircle, color: 'text-red-500', text: 'فشل' } :
            { icon: CheckCircle2, color: 'text-green-600', text: 'نجاح' },
        success: { icon: CheckCircle2, color: 'text-green-600', text: 'نجاح' },
        failed: { icon: AlertCircle, color: 'text-red-500', text: 'فشل' },
        error: { icon: AlertCircle, color: 'text-red-500', text: 'فشل' }
    }[status] || { icon: Zap, color: 'text-slate-500', text: '' };

    const Icon = statusConfig.icon;
    const formattedName = name.split('.').reverse().join(' ').toLowerCase();

    return (
        <div className="mt-2 text-xs" dir="ltr">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
                    "hover:bg-slate-50",
                    expanded ? "bg-slate-50 border-slate-300" : "bg-white border-slate-200"
                )}
            >
                <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-slate-700">{formattedName}</span>
                {statusConfig.text && (
                    <span className={cn("text-slate-500", isError && "text-red-600")}>
                        • {statusConfig.text}
                    </span>
                )}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (
                    <ChevronRight className={cn("h-3 w-3 text-slate-400 transition-transform ml-auto",
                        expanded && "rotate-90")} />
                )}
            </button>

            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 space-y-2 text-left">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">المدخلات:</div>
                            <pre className="bg-slate-50 rounded-md p-2 text-xs text-slate-600 whitespace-pre-wrap">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2);
                                    } catch {
                                        return toolCall.arguments_string;
                                    }
                                })()}
                            </pre>
                        </div>
                    )}
                    {parsedResults && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">النتيجة:</div>
                            <pre className="bg-slate-50 rounded-md p-2 text-xs text-slate-600 whitespace-pre-wrap max-h-48 overflow-auto">
                                {typeof parsedResults === 'object' ?
                                    JSON.stringify(parsedResults, null, 2) : parsedResults}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function MessageBubble({ message, isThinking = false }) {
    const isUser = message.role === 'user';

    if (isThinking) {
        return (
            <div className={cn("flex gap-3", "justify-start")}>
                <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center mt-0.5 shrink-0">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <div className={cn("max-w-[85%]")}>
                    <div className={cn("rounded-2xl px-4 py-2.5", "bg-white border border-slate-200")}>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                           <Loader2 className="w-4 h-4 animate-spin" />
                           <span>{message.content || 'يفكر...'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                </div>
            )}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-2xl px-4 py-2.5",
                        isUser ? "bg-slate-800 text-white" : "bg-white border border-slate-200"
                    )}>
                        {isUser ? (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                            <div className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}

                {message.tool_calls?.length > 0 && (
                    <div className="space-y-1">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}
            </div>
             {isUser && (
                <div className="h-7 w-7 rounded-lg bg-slate-700 text-white flex items-center justify-center mt-0.5 shrink-0">
                   م
                </div>
            )}
        </div>
    );
}
