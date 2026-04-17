import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

function ArrowButton({
  disabled,
  direction,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
  direction: "left" | "right";
}) {
  const Icon = direction === "left" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <Button
      disabled={disabled}
      size="icon-sm"
      variant="outline"
      onClick={onClick}
    >
      <Icon className="size-4" />
    </Button>
  );
}
