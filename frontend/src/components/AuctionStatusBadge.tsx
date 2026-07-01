

export default function AuctionStatusBadge({ status }: { status: string }) {
    let color1 = 'bg-red-500/15 text-red-700 border-red-500/30';
    let color2 = 'bg-red-500';
    if (status === 'ACTIVE') {
        color1 = 'bg-green-500/45 text-green-900 border-green-900/30';
        color2 = 'bg-green-900';
    } else if (status === 'PENDING') {
        color1 = 'bg-yellow-500/45 text-yellow-700 border-yellow-700/30';
        color2 = 'bg-yellow-700';
    }
    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${color1} text-sm font-medium rounded-md border mt-2`}>
            <span className={`w-2 h-2 rounded-full animate-pulse-dot ${color2}`}></span>
            {status}
        </div>
    )
}
