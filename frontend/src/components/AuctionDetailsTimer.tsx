import { useEffect, useState } from "react";
import { AuctionResponse } from "../services/itemApi";


export default function AuctionDetailsTimer({ auction }: { auction: AuctionResponse }) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endTime = new Date(auction.endTime);
            const difference = endTime.getTime() - now.getTime();

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ hours, minutes, seconds });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                document.dispatchEvent(new CustomEvent("auction-timer-expired", { detail: { auctionId: auction.id } }));
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [auction.endTime]);

    return (
        <div className="flex gap-3">
              {(['hours', 'minutes', 'seconds'] as const).map((unit) =>
            <div
            key={unit}
            className="flex-1 glass-card-strong rounded-2xl p-4 text-center">
            
                <div className="text-3xl font-bold font-mono text-slate-800">
                {String(timeLeft[unit]).padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-600 uppercase mt-1">
                {unit}
                </div>
            </div>
            )}
        </div>
    );
}
