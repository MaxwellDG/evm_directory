
import { Menu, Button, Text } from "@chakra-ui/react"
import { HiChevronDown } from "react-icons/hi"
import { forwardRef } from "react"

export interface Option<T> {
    value: T
    label: string
}

export interface SelectProps<T> {
    options: Option<T>[]
    selectedOption?: T
    onOptionChange?: (value: T) => void
    placeholder?: string
    size?: "sm" | "md" | "lg"
    variant?: "outline" | "solid" | "subtle" | "surface" | "ghost" | "plain"
    isDisabled?: boolean
    width?: string | number
    height?: string | number
}

function Select<T extends string | number>(
    {
        options,
        selectedOption,
        onOptionChange,
        placeholder = "Select an option...",
        size = "md",
        variant = "outline",
        isDisabled = false,
        width,
        height,
    }: SelectProps<T>,
    ref: React.Ref<HTMLButtonElement>
) {
    const selectedOptionData = options.find((option) => option.value === selectedOption)

    const handleOptionSelect = (value: T) => {
        onOptionChange?.(value)
    }

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button
                    ref={ref}
                    size={size}
                    variant={variant}
                    disabled={isDisabled}
                    width={width}
                    height={height}
                    textAlign="left"
                    justifyContent="space-between"
                >
                    <Text>{selectedOptionData ? selectedOptionData.label : placeholder}</Text>
                    <HiChevronDown />
                </Button>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content>
                    {options.map((option) => (
                        <Menu.Item
                            key={String(option.value)}
                            value={String(option.value)}
                            onClick={() => handleOptionSelect(option.value)}
                        >
                            {option.label}
                        </Menu.Item>
                    ))}
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}

export default forwardRef(Select) as <T extends string | number>(
    props: SelectProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement
