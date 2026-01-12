export default function ErrorBox({ message, details, upgradeUrl }) {
    return (
        <div className="mt-8 bg-red-50 border border-red-300 p-4 rounded-xl text-red-700">
            <div className="font-semibold">{message}</div>
            {details && <div className="mt-1 text-sm text-red-700">{details}</div>}
            {upgradeUrl && (
                <div className="mt-4">
                    <a
                        href={upgradeUrl}
                        className="inline-block bg-white text-red-700 border border-red-300 px-4 py-2 rounded-lg font-semibold hover:bg-red-50"
                    >
                        Upgrade plan
                    </a>
                </div>
            )}
        </div>
    );
}
