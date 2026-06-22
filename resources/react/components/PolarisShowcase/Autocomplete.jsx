import { LegacyStack, Tag, Autocomplete } from '@shopify/polaris';
import { useState, useCallback, useMemo } from 'react';
import React from 'react';

export default function AutocompleteSection() {
    const deselectedOptions = useMemo(
        () => [
            { value: 'Apple', label: 'Apple' },
            { value: 'Banana', label: 'Banana' },
            { value: 'Orange', label: 'Orange' },
            { value: 'Strawberry', label: 'Strawberry' },
            { value: 'Mango', label: 'Mango' },
        ],
        [],
    );
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(deselectedOptions);

    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === '') {
                setOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex),
            );

            setOptions(resultOptions);
        },
        [deselectedOptions],
    );

    const removeTag = useCallback(
        (tag) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);
            setSelectedOptions(options);
        },
        [selectedOptions],
    );

    const verticalContentMarkup =
        selectedOptions.length > 0 ? (
            <LegacyStack spacing="extraTight" alignment="center">
                {selectedOptions.map((option) => {
                    let tagLabel = '';
                    tagLabel = option.replace('_', ' ');
                    tagLabel = titleCase(tagLabel);
                    return (
                        <Tag key={`option${option}`} onRemove={removeTag(option)}>
                            {tagLabel}
                        </Tag>
                    );
                })}
            </LegacyStack>
        ) : null;

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Tags"
            value={inputValue}
            placeholder="Mango, Banana, Apple"
            verticalContent={verticalContentMarkup}
            autoComplete="off"
        />
    );

    return (
        <div style={{ height: '325px' }}>
            <Autocomplete
                allowMultiple
                options={options}
                selected={selectedOptions}
                textField={textField}
                onSelect={setSelectedOptions}
                listTitle="Suggested Tags"
            />
        </div>
    );

    function titleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join('');
    }
}
