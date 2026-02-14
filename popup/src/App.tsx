import { Setting } from "./components/Setting";
import "./tailwind config.css";

function App() {
    return (
        <div className="items-center-safe min-w-72 mw-max max-w-2xl m-auto">
            <form id="overviewSettings" className="">
                <Setting
                    title="AI Overview"
                    settingName="overviewDisplay"
                    settingValues={["hide", "condensed", "visible"]}
                    onChange={() => {}}
                />

                <Setting
                    title='AI in "People also ask"'
                    settingName="peopleAlsoAskDisplay"
                    settingValues={["hide", "labelled", "normal"]}
                    onChange={() => {}}
                />

                <br />
            </form>
        </div>
    );
}

export default App;
