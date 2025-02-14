"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: value }}
            />
            <span className="flex-1 text-left">{value}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <div className="text-sm font-semibold ">Click on pallete to select</div>
            <Input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-32 w-full"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}