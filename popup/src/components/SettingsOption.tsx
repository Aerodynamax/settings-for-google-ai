import { useState, type FunctionComponent } from "react";
import { type SettingProps } from "./Setting";
import { SubSetting } from "./SubSetting";

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
    optionSettings?: SettingProps[];
    onCheck: (newOptionValue: string) => void;
};

export const SettingsOption: FunctionComponent<SettingOptionProps> = ({
    optionName,
    optionValue,
    optionSettings,
    onCheck,
}) => {
    const [subsettingsOpen, setSubsettingsOpen] = useState(false);
    return (
        <div className="w-full py-1 m-0 flex flex-col gap-2 last:[&>div]:border-b-0">
            <div
                className={`flex flex-row w-full ${optionSettings?.length ? "justify-between" : ""}`}
            >
                <label
                    htmlFor={optionName + "." + optionValue}
                    className="flex flex-row grow gap-6 pl-1 cursor-pointer"
                >
                    <input
                        className=""
                        type="radio"
                        name={optionName}
                        id={optionName + "." + optionValue}
                        value={optionValue}
                        onChange={() => onCheck(optionValue)}
                    />
                    <h3 className="text-sm font-normal text-gray-200 w-full h-full justify-between">
                        {valueToTitle(optionValue)}
                    </h3>
                </label>
                {optionSettings?.length ? (
                    <>
                        <label
                            htmlFor={
                                optionName +
                                "." +
                                optionValue +
                                ".settingsToggle"
                            }
                            className="cursor-pointer pl-2 border-l border-neutral-700" // [&>input:checked~div>img]:rotate-0 [&>input:checked~div]:-translate-y [&>input:checked~div]:translate-x-0
                        >
                            <input
                                className="hidden"
                                type="checkbox"
                                id={
                                    optionName +
                                    "." +
                                    optionValue +
                                    ".settingsToggle"
                                }
                                onChange={(event) =>
                                    setSubsettingsOpen(event.target.checked)
                                }
                            />
                            <div className="w-6 flex align-middle justify-center rounded-full hover:bg-neutral-700">
                                <img
                                    src="./dropdown-arrow.svg"
                                    alt="show settings dropdown button"
                                    className={`w-6 transition-all ${subsettingsOpen ? "rotate-0" : "-rotate-90"}`}
                                />
                            </div>
                        </label>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div
                id={optionName + "." + optionValue + ".subsettings"}
                className={`border-neutral-700 border-b pb-0 overflow-hidden h-0 ${optionSettings?.length && subsettingsOpen ? "border-l rounded-bl-md h-auto ml-2" : ""}`}
            >
                {optionSettings?.map((setting) => (
                    <SubSetting
                        title={setting.title}
                        description={setting.description}
                        settingName={setting.settingName}
                        settingDefault={setting.settingDefault}
                        settingValues={setting.settingValues}
                    ></SubSetting>
                ))}
            </div>
        </div>
    );
};
