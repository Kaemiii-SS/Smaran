import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Timer, Trophy, Layers, Crosshair } from "lucide-react";
function GameStats({
  timer,
  highScore,
  matches,
  totalPairs,
  accuracy
}) {
  const stats = [
    {
      icon: <Timer className="size-5 md:size-8 text-blue-500" />,
      label: "Time",
      value: `${timer}s`
    },
    {
      icon: <Trophy className="size-5 md:size-8 text-yellow-500" />,
      label: "Best",
      value: highScore !== null ? `${highScore}s` : "--"
    },
    {
      icon: <Layers className="size-5 md:size-8 text-purple-500" />,
      label: "Matches",
      value: `${matches}/${totalPairs}`
    },
    {
      icon: <Crosshair className="size-5 md:size-8 text-green-500" />,
      label: "Accuracy",
      value: `${accuracy}%`
    }
  ];
  return <Card className="shadow-none w-full">
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => <div key={stat.label} className="flex items-center gap-3">
              <div className="p-3 border rounded-sm md:rounded-md bg-muted">
                {stat.icon}
              </div>
              <div>
                <p className="text-base md:text-xl text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-xl md:text-3xl font-bold">{stat.value}</p>
              </div>
            </div>)}
        </div>

        {totalPairs > 0 && <div className="mt-5 space-y-5">
            <div className="flex justify-between text-base md:text-xl text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(matches / totalPairs * 100)}%</span>
            </div>
            <Progress
    value={matches / totalPairs * 100}
    className="h-2 [&>div]:bg-green-500"
  />
          </div>}
      </CardContent>
    </Card>;
}
export {
  GameStats
};
