import type { FunctionComponent } from "react";
import { SettingsOption } from "./SettingsOption";

type Props = {
    title: string;
    settingName: string;
    settingValues: string[];
    onChange: (newOptionValue: string) => void;
};

export const Setting: FunctionComponent<Props> = ({
    title,
    settingName,
    settingValues,
    onChange,
}) => {
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
                <div>
                    {settingValues.map((setting) => (
                        <SettingsOption
                            optionName={settingName}
                            optionValue={setting}
                            onCheck={onChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
