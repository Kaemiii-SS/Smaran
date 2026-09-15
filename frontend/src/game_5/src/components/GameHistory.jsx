import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Trophy, Award, Clock, List } from "lucide-react";
function GameHistory({ history }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  const highScore = history.find((score) => score.isHighScore);
  const otherScores = history.filter((score) => !score.isHighScore).sort((a, b) => a.time - b.time);
  return <Card className="shadow-none hover:shadow-lg rounded-lg w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-2xl font-medium">
            <List className="size-5 md:size-7" />
            History
          </CardTitle>
          {highScore && <div className="flex items-center gap-1.5 md:gap-3 text-base md:text-xl text-muted-foreground">
              <Trophy className="size-4 md:size-5 text-yellow-500" />
              <span>Best : {formatTime(highScore.time)}</span>
            </div>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {history.length === 0 ? <div className="text-center py-6 text-muted-foreground">
            No game history yet
          </div> : <div className="space-y-2">
            {
    /* High Score */
  }
            {highScore && <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 p-3 rounded-md border border-yellow-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start text-start justify-start gap-3 h-full">
                    <Trophy className="size-5 text-yellow-500 mt-1" />
                    <div className="flex flex-col items-start justify-start text-start">
                      <p className="font-medium">High Score</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(highScore.date)} • {highScore.cardCount} cards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-base font-mono leading-none">
                    <Clock className="size-4" />
                    {formatTime(highScore.time)}
                  </div>
                </div>
              </div>}

            {
    /* Other Scores */
  }
            {otherScores.map((score) => <div
    key={score.id}
    className="p-3 rounded-md border hover:bg-accent/50 transition-colors"
  >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{formatDate(score.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        {score.cardCount} cards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="h-4 w-4" />
                    {formatTime(score.time)}
                  </div>
                </div>
              </div>)}
          </div>}
      </CardContent>
    </Card>;
}
export {
  GameHistory
};
