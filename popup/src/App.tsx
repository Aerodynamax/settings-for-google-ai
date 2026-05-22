import { useState } from "react";
import { Setting } from "./components/Setting";
import {
    AnimatedNavBarSkeleton,
    TopNavAnimationState,
} from "./components/skeleton/AnimatedNavBarSkeleton";
import {
    AnimatedOverviewSkeleton,
    OverviewAnimationState,
} from "./components/skeleton/AnimatedOverviewSkeleton";
import {
    AnimatedPAASkeleton,
    PAAAnimationState,
} from "./components/skeleton/AnimatedPAASkeleton";
import { AnimatedSkeleton } from "./components/skeleton/AnimatedSkeleton";
import { SearchNavSkeleton } from "./components/skeleton/SearchNavSkeleton";
import { SearchResultSkeleton } from "./components/skeleton/SearchResultSkeleton";
import "./tailwind config.css";

function App() {
    const [overviewDisplay, setOverviewDisplay] = useState("");
    const [paaDisplay, setPaaDisplay] = useState("");
    const [aiModeDisplay, setAiModeDisplay] = useState("");

    const overviewDisplayAnimation = (value: string, instant: boolean) => {
        setOverviewDisplay(value);
        return (
            <AnimatedSkeleton>
                <SearchNavSkeleton />
                <AnimatedNavBarSkeleton
                    animationState={aiModeDisplay as TopNavAnimationState}
                    instant={instant}
                />
                <AnimatedOverviewSkeleton
                    animationState={overviewDisplay as OverviewAnimationState}
                    instant={instant}
                />
                <SearchResultSkeleton />
                <SearchResultSkeleton />
                <AnimatedPAASkeleton
                    animationState={paaDisplay as PAAAnimationState}
                    instant={instant}
                />
                <SearchResultSkeleton />
            </AnimatedSkeleton>
        );
    };
    const paaDisplayAnimation = (value: string, instant: boolean) => {
        setPaaDisplay(value);
        return (
            <AnimatedSkeleton offset={50}>
                <SearchResultSkeleton />
                <AnimatedPAASkeleton
                    animationState={paaDisplay as PAAAnimationState}
                    instant={instant}
                />
                <SearchResultSkeleton />
                <SearchResultSkeleton />
                <SearchResultSkeleton />
            </AnimatedSkeleton>
        );
    };
    const AIModeDisplayAnimation = (value: string, instant: boolean) => {
        setAiModeDisplay(value);
        return (
            <AnimatedSkeleton>
                <SearchNavSkeleton />
                <AnimatedNavBarSkeleton
                    animationState={aiModeDisplay as TopNavAnimationState}
                    instant={instant}
                />
                <AnimatedOverviewSkeleton
                    animationState={overviewDisplay as OverviewAnimationState}
                    instant={instant}
                />
                <SearchResultSkeleton />
                <SearchResultSkeleton />
            </AnimatedSkeleton>
        );
    };

    return (
        <div className="items-center-safe min-w-72 mw-max max-w-2xl m-auto">
            <form id="overviewSettings" className="">
                <Setting
                    title="AI Overview"
                    settingName="overviewDisplay"
                    PreviewSkeleton={overviewDisplayAnimation}
                    settingDefault="condensed"
                    settingValues={[
                        { name: "hidden" },
                        { name: "condensed" },
                        { name: "visible" },
                    ]}
                />

                <Setting
                    title='AI in "People also ask"'
                    settingName="peopleAlsoAskDisplay"
                    PreviewSkeleton={paaDisplayAnimation}
                    settingDefault="labelled"
                    settingValues={[
                        { name: "hidden" },
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

                <Setting
                    title="AI mode button"
                    settingName="AIModeDisplay"
                    PreviewSkeleton={AIModeDisplayAnimation}
                    settingDefault="hidden"
                    settingValues={[{ name: "hidden" }, { name: "visible" }]}
                />

                <br />
            </form>
        </div>
    );
}

export default App;
