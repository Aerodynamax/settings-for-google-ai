import { useEffect, type FunctionComponent } from "react";
import { SettingsOption } from "./SettingsOption";
import type { SettingProps } from "./Setting";

export const SubSetting: FunctionComponent<SettingProps> = ({
    title,
    description,
    settingName,
    settingDefault,
    settingValues,
}) => {
    // Get data from storage when the component mounts
    useEffect(() => {
        // don't break when designing on dev server
        if (!chrome.storage) return;

        chrome.storage.local.get([settingName]).then((result) => {
            let settingValue = result[settingName] as string;

            if (!result[settingName]) settingValue = settingDefault;

            // update ui
            const elem = document.getElementById(
                settingName + "." + settingValue,
            ) as HTMLInputElement;

            if (elem) elem.checked = true;
        });
    });

    return (
        <div className="ml-2">
            <legend className="py-2 px-2">
                <p className="text-sm">{title}</p>
                <p
                    className={`text-neutral-400 text-sm ${description ? "pt-1" : ""}`}
                >
                    {description}
                </p>
            </legend>
            <div className="pt-2">
                {settingValues.map((setting) => (
                    <SettingsOption
                        optionName={settingName}
                        optionValue={setting.name}
                        optionSettings={setting.settings}
                        onCheck={(newValue) => {
                            // don't break when designing on dev server
                            if (!chrome.storage) return;

                            chrome.storage.local.set({
                                [settingName]: newValue,
                            });
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
