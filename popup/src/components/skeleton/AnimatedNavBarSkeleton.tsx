import type { CSSProperties, FunctionComponent } from "react";

type AnimatedSkeletonProps = {
    animationState?: TopNavAnimationState;
    instant?: boolean;
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
> = ({ animationState = "visible", instant = false }) => {
    const AIModeBtnStyles: CSSProperties = {
        transition: instant ? "" : "all 0.5s",
    };
    const MoreElemBtnStyles: CSSProperties = {
        transition: instant ? "" : "all 0.5s",
    };
    const AllBtnStyles: CSSProperties = {
        transition: instant ? "" : "all 0.5s",
    };

    switch (animationState) {
        case TopNavAnimationState.Visible:
            break;
        default:
            AIModeBtnStyles.width = "0";

            MoreElemBtnStyles.width = "2em";
            MoreElemBtnStyles.margin = "0 0.2em";
            AllBtnStyles.marginLeft = "0.8em";
            break;
    }

    return (
        <div className="top-nav">
            <div style={AIModeBtnStyles}></div>
            <div style={AllBtnStyles}></div>
            <div></div>
            <div></div>
            <div></div>
            <div style={MoreElemBtnStyles}></div>
            <div></div>
        </div>
    );
};
