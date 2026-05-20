import { useEffect, useState } from "react";
import { SettingsOption } from "./SettingsOption";

export type SettingProps = {
    title: string;
    description?: string;
    PreviewSkeleton?: (value: string) => React.ReactElement;
    settingName: string;
    settingDefault: string;
    settingValues: SettingValue[];
};

type SettingValue = {
    name: string;
    settings?: SettingProps[];
};

async function GetSettingsValues({
    settingName,
    settingDefault,
    settingValues,
}: Pick<SettingProps, "settingName" | "settingDefault" | "settingValues">) {
    // don't break when designing on dev server
    if (!chrome.storage) return settingDefault;

    const result = await chrome.storage.local.get([settingName]);

    let settingValue = result[settingName] as string;

    // if unset or invalid
    if (
        !result[settingName] ||
        (result[settingName] &&
            !settingValues.find((val) => val.name === result[settingName]))
    ) {
        settingValue = settingDefault;
        // set to default in storage
        chrome.storage.local.set({
            [settingName]: settingDefault,
        });
    }

    return settingValue;
}

export const Setting = ({
    title,
    settingName,
    settingDefault,
    PreviewSkeleton,
    settingValues,
}: SettingProps) => {
    const [storedValue, setStoredValue] = useState(settingDefault);

    // Get data from storage when the component mounts
    useEffect(() => {
        GetSettingsValues({ settingName, settingDefault, settingValues }).then(
            (settingValue) => {
                // update animation state
                setStoredValue(settingValue);
            },
        );
    });

    return (
        <>
            <SettingInternal
                title={title}
                settingName={settingName}
                settingDefault={storedValue}
                PreviewSkeleton={PreviewSkeleton}
                settingValues={settingValues}
            />
        </>
    );
};

const SettingInternal = ({
    title,
    settingName,
    settingDefault,
    PreviewSkeleton,
    settingValues,
}: SettingProps) => {
    const [currentAnimationState, setCurrentAnimationState] =
        useState(settingDefault);
    const [currentValue, setCurrentValue] = useState(settingDefault);

    // force update (idk what i'm doing)
    useEffect(() => {
        setCurrentValue(settingDefault);
    }, [settingDefault]);

    return (
        <div className="mx-4">
            <br />

            <legend className="mx-0 py-4">
                <h2 className="text-lg">{title}</h2>
            </legend>

            <div className="bg-neutral-800 py-4 rounded-lg drop-shadow-lg">
                {PreviewSkeleton === undefined ? (
                    ""
                ) : (
                    <div className="flex align-middle justify-center m-1.5">
                        <div className="w-11/12 max-w-56 min-h-40 max-h-56 rounded-3xl bg-neutral-700 overflow-hidden flex justify-center">
                            {PreviewSkeleton(currentAnimationState)}
                        </div>
                    </div>
                )}
                <div className="pt-2 px-6">
                    {settingValues.map((setting) => (
                        <SettingsOption
                            optionName={settingName}
                            optionValue={setting.name}
                            optionSettings={setting.settings}
                            initialState={setting.name === currentValue}
                            onCheck={(newValue) => {
                                // don't break when designing on dev server
                                if (!chrome.storage) return;

                                // update animation
                                setCurrentValue(newValue);

                                chrome.storage.local.set({
                                    [settingName]: newValue,
                                });
                            }}
                            onHover={(val) => setCurrentAnimationState(val)}
                            onUnhover={() =>
                                setCurrentAnimationState(currentValue)
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
