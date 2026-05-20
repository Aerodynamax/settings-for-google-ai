import type { CSSProperties, FunctionComponent } from "react";

type AnimatedSkeletonProps = {
    animationState?: PAAAnimationState;
};

// stupid enum workaround
export const PAAAnimationState = {
    Normal: "normal",
    Labelled: "labelled",
    Hidden: "hidden",
} as const;

// Create a type from the object values
export type PAAAnimationState =
    (typeof PAAAnimationState)[keyof typeof PAAAnimationState];

//

export const AnimatedPAASkeleton: FunctionComponent<AnimatedSkeletonProps> = ({
    animationState = "normal",
}) => {
    // TODO: ADD SUB SETTING ANIMATIONS
    const AIItemStyles: CSSProperties = { transition: "all 0.5s" };
    const AILabelStyles: CSSProperties = { transition: "all 0.5s" };
    const NonAILabelStyles: CSSProperties = { transition: "all 0.5s" };

    switch (animationState) {
        case PAAAnimationState.Hidden:
            // AIItemStyles.display = "none";
            AIItemStyles.height = "0";
            AIItemStyles.opacity = "0";
            AIItemStyles.border = "#444746 0px solid";
            AIItemStyles.marginTop = "-0.5em"; // remove the gap
            NonAILabelStyles.borderBottom = "#444746 0px";
            break;
        case PAAAnimationState.Labelled:
            AILabelStyles.marginLeft = "2%";
            AILabelStyles.width = "2em";
            break;
        default:
            break;
    }

    return (
        <div className="people-also-ask">
            <div className="title">People Also Ask</div>
            <div className="item" style={AIItemStyles}>
                <span
                    className="ai-label"
                    style={{ ...AILabelStyles, transitionDelay: "0s" }}
                ></span>
                <div className="content"></div>
                <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg>
            </div>
            <div className="item" style={NonAILabelStyles}>
                <div className="content"></div>
                <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg>
            </div>
            <div className="item" style={AIItemStyles}>
                <span
                    className="ai-label"
                    style={{ ...AILabelStyles, transitionDelay: "0.1s" }}
                ></span>
                <div className="content"></div>
                <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg>
            </div>
            <div className="item" style={AIItemStyles}>
                <span
                    className="ai-label"
                    style={{ ...AILabelStyles, transitionDelay: "0.2s" }}
                ></span>
                <div className="content"></div>
                <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg>
            </div>
        </div>
    );
};
