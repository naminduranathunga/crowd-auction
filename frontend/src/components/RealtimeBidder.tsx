import { useEffect, useState } from "react";
import { AuctionResponse, ItemResponse } from "../services/itemApi";
import { getBidsByItemId, placeBid } from "../services/bidApi";
import { subscribeToBidUpdates } from "../services/bidSocket";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface BidSingle {
    id: number;
    bidder: string;
    amount: number;
    time: string;
}

export default function RealtimeBidder({ItemId, Auction, Item}: {ItemId: number, Auction: AuctionResponse, Item: ItemResponse}) {
    const [bids, setBids] = useState<BidSingle[]>([]);
    const [showBidHistory, setShowBidHistory] = useState(false);
    const [bidAmount, setBidAmount] = useState<number>(0);

    const {user} = useAuth();
    /*
    useEffect(() => {
    const fetchBids = async () => {
            try {
        const response = await getBidsByItemId(ItemId);
        console.log("Fetched bids:", response);
        alert(`Fetched bids: ${JSON.stringify(response)}`);
        setBids(
          response.map((bid) => ({
            id: bid.id,
            bidder: bid.userId,
            amount: Number(bid.amount),
            time: bid.createdAt,
          }))
        );
            } catch (error) {
                console.error("Error fetching bids:", error);
            }
        };

        fetchBids();
    const disconnect = subscribeToBidUpdates(
      ItemId,
      (bid) => {
        setBids((currentBids) => [
          {
            id: bid.id,
            bidder: bid.userId,
            amount: Number(bid.amount),
            time: bid.createdAt,
          },
          ...currentBids,
        ]);
      },
      (message) => console.error(message)
    );

    return () => disconnect();
    }, [ItemId]);*/

    useEffect(() => {
      const handleFetchBids = ()=> {
        getBidsByItemId(Item.id).then((response) => {
          console.log("Fetched bids:", response);
          setBids(
            response.map((bid) => ({
              id: bid.id,
              bidder: (bid.userId === user?.id) ? "Me" : "User #" + bid.userId,
              amount: Number(bid.amount),
              time: bid.createdAt,
            }))
          );
        }).catch((error) => {
          console.error("Error fetching bids:", error);
        });
      }

      const handlePlaceBid = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail.itemId !== Item.id) {
          return; // Ignore events for other items
        }
        const bid = detail.bid;
        setBids((currentBids) => [
          {
            id: bid.id,
            bidder: "Me", // Assuming the current user is the one who placed the bid
            amount: Number(bid.amount),
            time: bid.createdAt,
          },
          ...currentBids,
        ]);
        handleFetchBids();
      }

      document.addEventListener("bid-placed", handlePlaceBid);

      handleFetchBids();
      const intervalId = setInterval(handleFetchBids, 1000); // Fetch bids every 10 seconds

      return () => {
        clearInterval(intervalId);
        document.removeEventListener("bid-placed", handlePlaceBid);
      }; // Cleanup on unmount

    }, [Item.id]);  

    const handlePlaceBid = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to place a bid goes here
        placeBid(Item.id, bidAmount, user?.id || '')
        .then((response) => {
          alert(`Bid placed: $${response.amount}`);
          setBidAmount(0);
          document.dispatchEvent(new CustomEvent("bid-placed", { detail: { itemId: Item.id, bid: response } }));
        })
        .catch((error) => {
          console.error('Error placing bid:', error);
          alert('Failed to place bid. Please try again.');
        });
    }

    let currentBid: BidSingle | null = null;
    let minNextBid: number = 0;

    if (bids.length > 0) {
        currentBid = bids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
        minNextBid = currentBid.amount + 1;
    } else {
        currentBid = (Item) ? { id: 0, bidder: "No bids yet", amount: parseFloat(`${Item.currentPrice}`), time: "" } : null;
        minNextBid = (Item) ? Item.currentPrice : 0;
    }

    return (
        <>
            <div className="glass-card rounded-3xl p-6">
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-1">
                  Current highest bid
                </p>
                <p className="text-3xl font-bold font-mono text-slate-800">
                  ${currentBid ? currentBid.amount.toLocaleString() : "No bids yet"}
                </p>
              </div>

              <div className="border-t border-white/40 pt-4">
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Your bid (must be higher than $
                      {currentBid ? (currentBid.amount + 1).toLocaleString() : minNextBid.toLocaleString()})
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                      min={currentBid ? currentBid.amount + 1 : minNextBid}
                      className="w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40"
                      placeholder={currentBid ? (currentBid.amount + 1).toString() : minNextBid.toString()}
                      disabled={Auction.status !== "ACTIVE"}
                      required />
                    
                  </div>
                  <button
                    type="submit"
                    disabled={Auction.status !== "ACTIVE"}
                    className="w-full bg-slate-800 text-white py-3 rounded-full font-semibold hover:bg-slate-900 transition-colors">
                    
                    Place bid
                  </button>
                  <p className="text-xs text-slate-600 text-center">
                    Funds will be held in escrow immediately
                  </p>
                </form>
              </div>
            </div>

            <div className="glass-card rounded-3xl">
              <button
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="w-full flex items-center justify-between p-4 text-left">
                
                <span className="font-semibold text-slate-800">
                  Bid History
                </span>
                {showBidHistory ?
                <ChevronUp className="w-5 h-5 text-slate-600" /> :

                <ChevronDown className="w-5 h-5 text-slate-600" />
                }
              </button>
              {showBidHistory &&
              <div className="border-t border-white/40">
                  {bids.map((bid, idx) =>
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border-b border-white/30 last:border-0">
                  
                      <div>
                        <p className="font-medium text-slate-800">
                          {bid.bidder}
                        </p>
                        <p className="text-xs text-slate-600">{bid.time}</p>
                      </div>
                      <p className="font-mono font-bold text-slate-800">
                        ${bid.amount.toLocaleString()}
                      </p>
                    </div>
                )}
                </div>
              }
            </div>
        </>
    );
}