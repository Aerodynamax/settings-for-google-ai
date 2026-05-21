import { useEffect, useRef, useState } from "react";
import { SettingsOption } from "./SettingsOption";

export type SettingProps = {
    title: string;
    description?: string;
    PreviewSkeleton?: (value: string, instant: boolean) => React.ReactElement;
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

const hoverWaitBeforePlayingAnimationsMs = 300;
const hoverWaitBeforeStoppingAnimationsMs = 500;

export const Setting = ({
    title,
    settingName,
    settingDefault,
    PreviewSkeleton,
    settingValues,
}: SettingProps) => {
    const [storedValue, setStoredValue] = useState(settingDefault);

    // Get data from storage when the component mounts
    GetSettingsValues({ settingName, settingDefault, settingValues }).then(
        (settingValue) => {
            // update animation state
            setStoredValue(settingValue);
        },
    );

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
    // TODO: learn state management :(

    const [pendingAnimationState, setPendingAnimationState] =
        useState(settingDefault);
    const [allowAnimationUpdates, setAllowAnimationUpdates] = useState(false);

    const [currentAnimationState, setCurrentAnimationState] =
        useState(settingDefault);
    const [currentValue, setCurrentValue] = useState(settingDefault);

    const [updatePreviewInstantly, setUpdatePreviewInstantly] = useState(true);

    // force update default value after chrome returns it (useEffect slop 🤩)
    useEffect(() => {
        setCurrentValue(settingDefault);
        setCurrentAnimationState(settingDefault);
    }, [settingDefault]);

    const hoverTimeoutRef = useRef<number>(null);
    const unhoverTimeoutRef = useRef<number>(null);

    // wait before hover does anything
    useEffect(() => {
        // if not hovering the current one or currently pending hovers
        if (
            (hoverTimeoutRef.current === null || !allowAnimationUpdates) &&
            pendingAnimationState !== currentValue
        ) {
            // if indecisive, don't show animations yet
            if (hoverTimeoutRef.current !== null) {
                clearTimeout(hoverTimeoutRef.current);
            }

            // clear
            setAllowAnimationUpdates(false);
            setCurrentAnimationState(currentValue);

            // wait before playing any animations
            hoverTimeoutRef.current = setTimeout(() => {
                setAllowAnimationUpdates(true);
            }, hoverWaitBeforePlayingAnimationsMs);
        }

        // update if allowed
        if (allowAnimationUpdates) {
            setCurrentAnimationState(pendingAnimationState);

            // remove pending unhover
            if (
                unhoverTimeoutRef.current &&
                pendingAnimationState !== currentValue // not sure how but this fixes animation clearing
            ) {
                clearTimeout(unhoverTimeoutRef.current);
                unhoverTimeoutRef.current = null;
            }
        }
    }, [allowAnimationUpdates, pendingAnimationState]);

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
                    <div className="flex align-middle justify-center m-1.5 scroll">
                        <div className="w-11/12 max-w-56 min-h-40 max-h-56 rounded-3xl bg-neutral-700 overflow-clip flex justify-center">
                            {PreviewSkeleton(
                                currentAnimationState,
                                updatePreviewInstantly,
                            )}
                        </div>
                    </div>
                )}
                <div
                    className="pt-2 px-6"
                    onMouseLeave={() => {
                        // remove old
                        if (unhoverTimeoutRef.current) {
                            clearTimeout(unhoverTimeoutRef.current);
                            unhoverTimeoutRef.current = null;
                        }

                        unhoverTimeoutRef.current = setTimeout(() => {
                            // clear hover after leaving
                            if (hoverTimeoutRef.current) {
                                clearTimeout(hoverTimeoutRef.current);
                                hoverTimeoutRef.current = null;

                                // updating state done last as it kills this timeout
                                setAllowAnimationUpdates(false);
                                setPendingAnimationState(currentValue);
                            }
                        }, hoverWaitBeforeStoppingAnimationsMs);
                    }}
                >
                    {settingValues.map((setting) => (
                        <SettingsOption
                            optionName={settingName}
                            optionValue={setting.name}
                            optionSettings={setting.settings}
                            initialState={setting.name === currentValue} // TODO: fix so switching to condensed works
                            onCheck={(newValue) => {
                                // don't break when designing on dev server
                                if (!chrome.storage) return;

                                // update animation
                                setCurrentValue(newValue);
                                setPendingAnimationState(newValue);

                                chrome.storage.local.set({
                                    [settingName]: newValue,
                                });
                            }}
                            onHover={(val) => {
                                // actually play animations
                                setUpdatePreviewInstantly(false);

                                setPendingAnimationState(val);
                            }}
                            onUnhover={() => {
                                setPendingAnimationState(currentValue);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
