export default function ErrorBox({ message }) {
    return (
        <div className="mt-8 bg-red-50 border border-red-300 p-4 rounded-xl text-red-700">
            {message}
        </div>
    );
}
