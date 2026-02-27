import { Setting } from "./components/Setting";
import "./tailwind config.css";

function App() {
    // const paaLabelledSettingsPage = <SettingsPage></SettingsPage>;

    return (
        <div className="items-center-safe min-w-72 mw-max max-w-2xl m-auto">
            <form id="overviewSettings" className="">
                <Setting
                    title="AI Overview"
                    settingName="overviewDisplay"
                    settingDefault="condensed"
                    settingValues={[
                        { name: "hide" },
                        { name: "condensed" },
                        { name: "visible" },
                    ]}
                />

                <Setting
                    title='AI in "People also ask"'
                    settingName="peopleAlsoAskDisplay"
                    settingDefault="labelled"
                    settingValues={[
                        { name: "hide" },
                        {
                            name: "labelled",
                            settings: [
                                {
                                    title: "Animate",
                                    description:
                                        'Changes whether to animate the "AI Overview" badges when they spawn in.',
                                    settingName: "paaAnimated",
                                    settingDefault: "onlyFirst",
                                    settingValues: [
                                        { name: "always" },
                                        { name: "onlyFirst" },
                                        { name: "never" },
                                    ],
                                },
                            ],
                        },
                        { name: "normal" },
                    ]}
                />

                <br />
            </form>
        </div>
    );
}

export default App;
