import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TooltipWrapper({ children, description }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}