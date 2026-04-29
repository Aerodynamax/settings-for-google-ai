import type { CSSProperties, FunctionComponent } from "react";

type AnimatedSkeletonProps = {
    animationState: TopNavAnimationState;
};

// stupid enum workaround
export const TopNavAnimationState = {
    Visible: "visible",
    Hidden: "hidden",
} as const;

// Create a type from the object values
export type TopNavAnimationState =
    (typeof TopNavAnimationState)[keyof typeof TopNavAnimationState];

//

export const AnimatedNavBarSkeleton: FunctionComponent<
    AnimatedSkeletonProps
> = ({ animationState }) => {
    const AIModeBtnStyles: CSSProperties = { transition: "all 0.5s" };
    const MoreElemBtnStyles: CSSProperties = { transition: "all 0.5s" };

    switch (animationState) {
        case TopNavAnimationState.Hidden:
            AIModeBtnStyles.width = "0";

            MoreElemBtnStyles.width = "2em";
            MoreElemBtnStyles.margin = "0 0.2em";
            break;
        default:
            break;
    }

    return (
        <>
            <link rel="stylesheet" href="search-skeleton.css" />
            <div className="top-nav">
                <div style={AIModeBtnStyles}></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div style={MoreElemBtnStyles}></div>
                <div></div>
            </div>
        </>
    );
};
