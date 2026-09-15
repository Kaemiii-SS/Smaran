import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../components/ui/dialog";
import { Trophy } from "lucide-react";
function GameModal({
  open,
  timer,
  highScore,
  onNextLevel,
  onClose
}) {
  const isNewHighScore = highScore !== null && timer <= highScore;
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl md:text-2xl">
            🎉 Congratulations ! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-xs md:text-sm">
            You matched all the cards !
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2 md:py-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-5xl font-bold">{timer}s</p>
            <p className="text-muted-foreground text-2xl">Your time</p>
          </div>
          
          {highScore !== null && <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 md:size-8 text-yellow-500" />
                <p className="font-medium text-2xl md:text-4xl">Best : {highScore}s</p>
              </div>
              {isNewHighScore && <p className="text-green-500 font-medium mt-1">
                  New high score !
                </p>}
            </div>}
        </div>
        
        <div className="grid md:grid-cols-2 gap-2">
          <Button variant="outline" className="flex-1 p-6" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1 p-6 font-bold text-lg" onClick={onNextLevel}>
            Next &rarr;
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
}
export {
  GameModal
};
