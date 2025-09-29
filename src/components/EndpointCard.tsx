// components/EndpointCard.tsx
interface EndpointCardProps {
    method: string;
    path: string;
    description: string;
    onClick: () => void;
    isActive?: boolean;
}

export default function EndpointCard({
                                         method,
                                         path,
                                         description,
                                         onClick,
                                         isActive = false
                                     }: EndpointCardProps) {
    const methodColors: Record<string, string> = {
        GET: 'bg-blue-100 text-blue-800 border-blue-200',
        POST: 'bg-green-100 text-green-800 border-green-200',
        PUT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        DELETE: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <div
            className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 mb-2">
        <span
            className={`px-3 py-1 rounded text-sm font-medium border ${
                methodColors[method]
            }`}
        >
          {method}
        </span>
                <code className="text-gray-700 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                    {path}
                </code>
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}