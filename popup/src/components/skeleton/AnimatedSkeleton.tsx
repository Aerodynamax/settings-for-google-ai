// import {
//     AnimatedOverviewSkeleton,
//     OverviewAnimationState,
// } from "./AnimatedOverviewSkeleton";
// import {
//     AnimatedNavBarSkeleton,
//     TopNavAnimationState,
// } from "./AnimatedNavBarSkeleton";
// import { AnimatedPAASkeleton, PAAAnimationState } from "./AnimatedPAASkeleton";
// import { SearchResultSkeleton } from "./SearchResultSkeleton";
// import { SearchNavSkeleton } from "./SearchNavSkeleton";
import { type PropsWithChildren } from "react";

export type AnimatedSkeletonProps = {
    offset?: number;
};

export const AnimatedSkeleton = ({
    offset = 0,
    children,
}: PropsWithChildren<AnimatedSkeletonProps>) => {
    return (
        <>
            <link rel="stylesheet" href="search-skeleton.css" />
            <div
                className="canvas"
                style={{ transform: `translateY(-${offset}px)` }}
            >
                {children}
            </div>
        </>
    );
};
