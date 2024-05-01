
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@radix-ui/react-label"



export function ProductCategorySelector({ value, onChange, ...props}: { value?: string, onChange?: (value: string) => void }){
    const [open, setOpen] = React.useState(false);
    if (value === undefined) value = ""

    const setValue = React.useCallback((value: string) => {
        if (onChange === undefined) return;
        onChange(value)
    }, [onChange])
  
    const categories = [
        { label: "No parent category", value: ""},
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Books", value: "books" },
        { label: "Furniture", value: "furniture" },
    ];

    const citems = categories.map((category, i) => (
        <CommandItem
          key={i}
          value={category.value}
          onSelect={(currentValue) => {
            setValue(currentValue === value ? "" : currentValue)
            setOpen(false)
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              value === category.value ? "opacity-100" : "opacity-0"
            )}
          />
          {category.label}
        </CommandItem>
      ))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((framework) => framework.value === value)?.label
            : "No parent category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {citems}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
