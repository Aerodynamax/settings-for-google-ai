import { Setting } from "./components/Setting";
import { AnimatedNavBarSkeleton } from "./components/skeleton/AnimatedNavBarSkeleton";
import {
    AnimatedOverviewSkeleton,
    OverviewAnimationState,
} from "./components/skeleton/AnimatedOverviewSkeleton";
import { AnimatedSkeleton } from "./components/skeleton/AnimatedSkeleton";
import { SearchNavSkeleton } from "./components/skeleton/SearchNavSkeleton";
import { SearchResultSkeleton } from "./components/skeleton/SearchResultSkeleton";
import "./tailwind config.css";

function App() {
    const overviewDisplayAnimation = (value: string) => (
        <AnimatedSkeleton>
            <SearchNavSkeleton />
            <AnimatedNavBarSkeleton />
            <AnimatedOverviewSkeleton
                animationState={value as OverviewAnimationState}
            />
            <SearchResultSkeleton />
            <SearchResultSkeleton />
            <SearchResultSkeleton />
        </AnimatedSkeleton>
    );

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
                    settingDefault="hidden"
                    settingValues={[{ name: "hidden" }, { name: "visible" }]}
                />

                <br />
            </form>
        </div>
    );
}

export default App;
