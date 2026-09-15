import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
function HowToPlay({ open, onClose }) {
  return <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Play</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Objective</h3>
              <p className="text-sm text-muted-foreground">
                Find all matching pairs of cards by flipping them two at a time.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Gameplay</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>Click on any card to flip it over</li>
                <li>Click on a second card to try to find a match</li>
                <li>If the cards match, they'll stay flipped</li>
                <li>If they don't match, they'll flip back over</li>
                <li>Remember what was on each card and where it was</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Difficulty Levels</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li><strong>Easy:</strong> 6 pairs (12 cards)</li>
                <li><strong>Medium:</strong> 10 pairs (20 cards)</li>
                <li><strong>Hard:</strong> 15 pairs (30 cards)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>Try to remember the positions of cards as you flip them</li>
                <li>Start with the edges and work your way inward</li>
                <li>Take your time - there's no time penalty for thinking!</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>;
}
export {
  HowToPlay
};
