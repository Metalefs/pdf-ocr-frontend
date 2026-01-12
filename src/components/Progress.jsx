export default function Progress({ text, logs, showLogs = true }) {
    return (
        <div className="mt-8">
            <p className="text-center font-semibold text-rose-700">{text}</p>
            {showLogs && logs?.length > 0 && (
                <div className="mt-4 bg-rose-900 text-rose-100 p-4 rounded max-h-48 overflow-y-auto font-mono text-sm">
                    {logs.map((l, i) => (
                        <div key={i}>{l}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
