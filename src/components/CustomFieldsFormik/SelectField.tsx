import { twMerge } from "tailwind-merge";
import { AdditionalFormikProps, SelectOption } from "@/interfaces/common.interface";
import { Label } from "../ui/label";
import { get, isEqual, isString } from "lodash";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import CommonIcons from "../CommonIcons";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const ModeSelectEnums = {
  default: "default",
  autocomplete: "autocomplete",
} as const;

interface SelectFieldProps {
  label?: string | React.ReactNode;
  required?: boolean;
  classNameLabel?: string;
  classNameContainer?: string;
  placeholder?: string;
  placeholderSearch?: string;
  messageItemNotFound?: string;
  options: SelectOption[];
  afterOnChange?: (e: string | number) => void;
  disableUnselect?: boolean;
  mode?: (typeof ModeSelectEnums)[keyof typeof ModeSelectEnums];

  customPlaceholderSelected?: (
    value: string | React.ReactNode,
    options: SelectOption[]
  ) => React.ReactNode | string;
}

const SelectField = (props: SelectFieldProps & AdditionalFormikProps) => {
  //! State
  const {
    options,
    classNameContainer,
    field,
    form,
    label,
    classNameLabel,
    placeholder,
    placeholderSearch,
    messageItemNotFound,
    required,
    afterOnChange,
    disableUnselect,
    mode = "default",
    customPlaceholderSelected,
  } = props;
  const [open, setOpen] = useState(false);
  const { value, name } = field;
  const { setFieldValue, setFieldTouched, errors, touched } = form;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const msgError = get(touched, name) && (get(errors, name) as string);

  const valueFound = options.find(
    (option) => `${option.value}` === `${value}`
  )?.label;

  //! Function

  //! Render
  // const widthPopover = buttonRef.current?.getBoundingClientRect().width || 0;

  const renderSelectByMode = () => {
    if (mode === "default") {
      return (
        <Select
          value={value}
          onValueChange={(value) => {
            setFieldValue(name, value);
            afterOnChange && afterOnChange(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                (customPlaceholderSelected &&
                  customPlaceholderSelected(valueFound || "", options)) ||
                valueFound ||
                placeholder
              }
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setFieldTouched(name, true);
          }
        }}
      >
        <PopoverTrigger>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={twMerge(
              "w-full justify-between text-sm font-normal",
              msgError && "border-red-500"
            )}
          >
            {valueFound || placeholder}
            <CommonIcons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          style={{
            width: "max-content",
          }}
        >
          <Command>
            <CommandInput placeholder={placeholderSearch || "Search item"} />
            <CommandEmpty>
              {messageItemNotFound || "No item found."}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="w-max"
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    if (disableUnselect && isEqual(value, option.value)) {
                      return;
                    }

                    const result =
                      `${value}` === `${option.value}` ? "" : option.value;
                    setFieldValue(name, result);
                    afterOnChange && afterOnChange(result);
                    setOpen(false);
                  }}
                >
                  <CommonIcons.Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div
      className={twMerge(
        "grid w-full items-center gap-1.5",
        classNameContainer
      )}
    >
      {label && (
        <Label
          className={twMerge("mb-1", required && "required", classNameLabel)}
        >
          {label}
        </Label>
      )}

      {renderSelectByMode()}

      {isString(msgError) && <span className="invalid-text">{msgError}</span>}
    </div>
  );
};

export default SelectField;
