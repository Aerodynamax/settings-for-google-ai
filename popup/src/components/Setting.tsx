import { useEffect, type FunctionComponent } from "react";
import { SettingsOption } from "./SettingsOption";

export type SettingProps = {
    title: string;
    description?: string;
    settingName: string;
    settingDefault: string;
    settingValues: SettingValue[];
};

type SettingValue = {
    name: string;
    settings?: SettingProps[];
};

export function SetSettingsValuesInitial({
    settingName,
    settingDefault,
}: Pick<SettingProps, "settingName" | "settingDefault">) {
    // don't break when designing on dev server
    if (!chrome.storage) return;

    chrome.storage.local.get([settingName]).then((result) => {
        let settingValue = result[settingName] as string;

        if (!result[settingName]) {
            settingValue = settingDefault;
            // set in storage
            chrome.storage.local.set({
                [settingName]: settingDefault,
            });
        }

        // update ui
        const elem = document.getElementById(
            settingName + "." + settingValue,
        ) as HTMLInputElement;

        if (elem) elem.checked = true;
    });
}

export const Setting: FunctionComponent<SettingProps> = ({
    title,
    settingName,
    settingDefault,
    settingValues,
}) => {
    // Get data from storage when the component mounts
    useEffect(() => {
        SetSettingsValuesInitial({ settingName, settingDefault });
    });

    return (
        <div className="mx-4">
            <br />

            <legend className="mx-0 py-4">
                <h2 className="text-lg">{title}</h2>
            </legend>

            <div className="bg-neutral-800 py-4 rounded-lg drop-shadow-lg">
                <div className="flex align-middle justify-center m-1.5">
                    <img
                        className="w-11/12 max-w-96 min-h-40 rounded-3xl bg-neutral-700"
                        src=""
                        alt={title + " Display Preview"}
                    />
                </div>
                <div className="pt-2 px-6">
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
        </div>
    );
};
