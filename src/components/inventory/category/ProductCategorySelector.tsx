
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
import ProductCategory from "@/interfaces/product_category"



export function ProductCategorySelector({ value, categories, onChange, ...props}: { value?: string, categories:ProductCategory[], onChange?: (value: string) => void }){
    const [open, setOpen] = React.useState(false);
    if (value === undefined) value = ""

    const setValue = React.useCallback((value: string) => {
        if (onChange === undefined) return;
        onChange(value)
    }, [onChange])
  

    categories = categories.filter((category) => category.parent === null);

    const citems = categories.map((category:ProductCategory, i) => (
        <CommandItem
          key={i}
          value={category.id}
          onSelect={(currentValue) => {
            setValue(currentValue === value ? "" : currentValue)
            setOpen(false)
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              value === category.id ? "opacity-100" : "opacity-0"
            )}
          />
          {category.name}
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
            ? categories.find((framework) => framework.id === value)?.name
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
