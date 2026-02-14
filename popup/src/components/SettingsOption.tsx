import type { FunctionComponent } from "react";

function valueToTitle(value: string): string {
    // [https://stackoverflow.com/a/7888303]
    const splitStr: string[] = value.split(/(?<![A-Z])(?=[A-Z])/);

    for (let i = 0; i < splitStr.length; i++) {
        // change case
        if (i === 0)
            splitStr[i] =
                splitStr[i].charAt(0).toUpperCase() +
                splitStr[i].substring(1).toLowerCase();
        else splitStr[i] = splitStr[i].toLowerCase();
    }
    // Directly return the joined string
    return splitStr.join(" ");
}

export type SettingOptionProps = {
    optionName: string;
    optionValue: string;
    onCheck: (newOptionValue: string) => void;
};

export const SettingsOption: FunctionComponent<SettingOptionProps> = ({
    optionName,
    optionValue,
    onCheck,
}) => {
    return (
        <label
            htmlFor={optionName + "." + optionValue}
            className="w-full px-6 py-2 m-0 flex flex-row gap-6 border-transparent border-b"
        >
            <input
                type="radio"
                name={optionName}
                id={optionName + "." + optionValue}
                value={optionValue}
                onChange={() => onCheck(optionValue)}
            />
            <h3 className="text-sm font-normal text-gray-200 w-full pb-2 border-b-neutral-700 border-b">
                {valueToTitle(optionValue)}
            </h3>
        </label>
    );
};
