'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import type {
  Dictionary,
  GetResponse,
  ListQueryParams,
} from '@/contracts/types';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export type AutocompleteOption = {
  label: string;
  value: string;
};

type AutocompleteInputProps<TData> = {
  value: string | null;
  onChange: (value: string) => void;
  queryKey: string;
  queryFn: (queryParams: ListQueryParams) => Promise<GetResponse<TData>>;
  queryParams?: Dictionary<TData>;
  placeholder?: string;
  disabled?: boolean;
  minChars?: number;
  mapOption?: (
    item: TData extends (infer U)[] ? U : never
  ) => AutocompleteOption;
};

export function AutocompleteCs<TItem>({
  value,
  onChange,
  queryKey,
  queryFn,
  placeholder = 'Buscar...',
  disabled,
  mapOption,
  queryParams,
}: AutocompleteInputProps<TItem>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['autocomplete', queryKey, search, queryParams],
    queryFn: async () => {
      const { data } = await queryFn({ search, showAll: true, ...queryParams });
      return data;
    },
    enabled: open,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (data: any[]) =>
      mapOption
        ? data?.map?.(mapOption)
        : (data?.map?.((item) => {
            if (!item?.name || !item?.id) return { label: '', value: '' };
            return {
              label: item?.name,
              value: item?.id,
            };
          }) ?? []),
  });

  const options = data ?? [];
  const selected = options.find((option) => option?.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between"
        >
          {selected?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder={placeholder} onValueChange={setSearch} />
          <CommandList>
            {isFetching && <CommandEmpty>Buscando...</CommandEmpty>}
            {!isFetching && options.length === 0 && (
              <CommandEmpty>Sin resultados</CommandEmpty>
            )}
            {options.map((option) => (
              <CommandItem
                key={option?.value}
                value={option?.label}
                onSelect={() => {
                  onChange(option?.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === option?.value ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {option?.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
