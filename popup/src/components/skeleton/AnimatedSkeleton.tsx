import type { FunctionComponent } from "react";
import {
    AnimatedOverviewSkeleton,
    OverviewAnimationState,
} from "./AnimatedOverviewSkeleton";
import {
    AnimatedNavBarSkeleton,
    TopNavAnimationState,
} from "./AnimatedNavBarSkeleton";
import { AnimatedPAASkeleton, PAAAnimationState } from "./AnimatedPAASkeleton";

type AnimatedSkeletonProps = {
    offset: number;
    animationState: AnimationState;
};

// stupid enum workaround
export const AnimationState = {
    None: "None",
    OverviewCondensed: "OverviewCondensed",
    OverviewHidden: "OverviewHidden",
    PAALabelled: "PAALabelled",
    PAAHidden: "PAAHidden",
    AIModeHidden: "AIModeHidden",
} as const;

// Create a type from the object values
export type AnimationState =
    (typeof AnimationState)[keyof typeof AnimationState];

//

export const AnimatedSkeleton: FunctionComponent<AnimatedSkeletonProps> = ({
    offset,
}) => {
    return (
        <>
            <link rel="stylesheet" href="search-skeleton.css" />
            <div
                className="canvas"
                style={{ transform: `translateY(-${offset}px)` }}
            >
                <div className="search-bar">
                    <div></div>
                    <img src="google-logo.svg" alt="" />
                </div>
                <AnimatedNavBarSkeleton
                    animationState={TopNavAnimationState.Visible}
                ></AnimatedNavBarSkeleton>
                <AnimatedOverviewSkeleton
                    animationState={OverviewAnimationState.Hidden}
                ></AnimatedOverviewSkeleton>
                <div className="results">
                    <div className="result">
                        <div className="site-name"></div>
                        <div className="title"></div>
                        <div className="content"></div>
                        <div className="content"></div>
                    </div>
                    <AnimatedPAASkeleton
                        animationState={PAAAnimationState.Labelled}
                    ></AnimatedPAASkeleton>
                    <div className="result">
                        <div className="site-name"></div>
                        <div className="title"></div>
                        <div className="content"></div>
                        <div className="content"></div>
                    </div>
                    <div className="result">
                        <div className="site-name"></div>
                        <div className="title"></div>
                        <div className="content"></div>
                        <div className="content"></div>
                    </div>
                    <div className="result">
                        <div className="site-name"></div>
                        <div className="title"></div>
                        <div className="content"></div>
                        <div className="content"></div>
                    </div>
                </div>
            </div>
        </>
    );
};
