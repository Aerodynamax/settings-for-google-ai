import type { CSSProperties, FunctionComponent } from "react";

type AnimatedSkeletonProps = {
    animationState?: OverviewAnimationState;
};

// stupid enum workaround
export const OverviewAnimationState = {
    Normal: "normal",
    Condensed: "condensed",
    Hidden: "hidden",
} as const;

// Create a type from the object values
export type OverviewAnimationState =
    (typeof OverviewAnimationState)[keyof typeof OverviewAnimationState];

//

export const AnimatedOverviewSkeleton: FunctionComponent<
    AnimatedSkeletonProps
> = ({ animationState = "normal" }) => {
    const overviewStyles: CSSProperties = { transition: "all 0.5s" };
    const bgFadeStyles: CSSProperties = { transition: "all 0.5s" };
    const moreBtnStyles: CSSProperties = { transition: "all 0.5s" };
    const moreBtnTitleStyles: CSSProperties = { transition: "all 0.5s" };
    const contentsStyles: CSSProperties = { transition: "all 0.5s" };

    switch (animationState) {
        case OverviewAnimationState.Condensed:
            overviewStyles.height = "3.6em";
            overviewStyles.borderBottom = "#424654 0px";

            contentsStyles.opacity = "0";
            bgFadeStyles.height = "2em";

            moreBtnStyles.bottom = "0";

            moreBtnTitleStyles.width = "45%";
            break;
        case OverviewAnimationState.Hidden:
            overviewStyles.height = "0";
            overviewStyles.borderBottom = "#424654 0px";
            overviewStyles.opacity = "0";
            break;
        default:
            break;
    }

    return (
        <div className="overview" style={overviewStyles}>
            <div className="title">
                <svg
                    className="fWWlmf JzISke"
                    height="24"
                    width="24"
                    aria-hidden="true"
                    viewBox="0 0 471 471"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#7aacff"
                        d="M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.34C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z"
                    ></path>
                </svg>
                AI Overview
            </div>
            <div className="contents" style={contentsStyles}>
                <div className="content"></div>
                <div className="content"></div>
                <div className="content"></div>
                <div className="content"></div>
                <div className="content"></div>
                <div className="content"></div>
            </div>
            <div className="button-bg-fade" style={bgFadeStyles}>
                <div className="show-button" style={moreBtnStyles}>
                    <div className="content" style={moreBtnTitleStyles}></div>
                    <svg
                        focusable="false"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.41 7.59L4 9l8 8 8-8-1.41-1.41L12 14.17"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};
