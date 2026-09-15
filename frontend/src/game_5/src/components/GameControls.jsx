import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { cn } from "../lib/utils";
function GameControls({
  level,
  setLevel,
  gameStarted,
  onStart,
  onReset
}) {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  return <main className="w-full space-y-4">
      <RadioGroup
    value={level.toString()}
    onValueChange={(value) => setLevel(Number(value))}
    className="grid grid-cols-5 gap-2"
    disabled={gameStarted}
  >
        {levels.map((lvl) => <div key={lvl}>
            <RadioGroupItem
    value={lvl.toString()}
    id={`level-${lvl}`}
    className="peer sr-only"
  />
            <Label
    htmlFor={`level-${lvl}`}
    className={cn(
      "flex flex-col items-center justify-center text-sm md:text-base rounded-md border-2 border-muted bg-popover p-2 md:p-4 hover:bg-accent hover:text-accent-foreground",
      "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
      "cursor-pointer transition-all",
      gameStarted ? "opacity-50 cursor-not-allowed" : ""
    )}
  >
              Level {lvl}
            </Label>
          </div>)}
      </RadioGroup>

      <div className="flex gap-4">
        {!gameStarted ? <Button
    size="lg"
    className="p-4 sm:p-8 text-sm md:text-xl w-full"
    onClick={onStart}
  >
            Start Game
          </Button> : <Button
    variant="outline"
    size="lg"
    className="p-4 sm:p-8 text-sm md:text-xl w-full"
    onClick={onReset}
  >
            Reset Game
          </Button>}
      </div>
    </main>;
}
export {
  GameControls
};
