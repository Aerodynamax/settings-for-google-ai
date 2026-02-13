import "./tailwind config.css";

function App() {
    return (
        <>
            <div className="items-center-safe w-max">
                <form
                    id="overviewSettings"
                    className="border-stone-700 border-2 bg-stone-900"
                >
                    <legend>
                        <h2>Display Settings</h2>
                    </legend>
                    <div className="">
                        <img src="" alt="AI Overview Display Preview" />
                    </div>
                    <label htmlFor="overviewHide">
                        <h3>Hide</h3>
                        <input
                            type="radio"
                            name="overviewDisplay"
                            id="overviewHide"
                            value="hide"
                        />
                    </label>
                    <label htmlFor="overviewCondensed">
                        <h3>Condensed</h3>
                        <input
                            type="radio"
                            name="overviewDisplay"
                            id="overviewCondensed"
                            value="condensed"
                        />
                    </label>
                    <label htmlFor="overviewVisible">
                        <h3>Visible</h3>
                        <input
                            type="radio"
                            name="overviewDisplay"
                            id="overviewVisible"
                            value="visible"
                        />
                    </label>
                    <br />
                    <legend>
                        <h2>AI in "People also ask"</h2>
                    </legend>
                    <div className="">
                        <img src="" alt="AI People Also Ask Display Preview" />
                    </div>
                    <label htmlFor="peopleAlsoAskHide">
                        <h3>Hide</h3>
                        <input
                            type="radio"
                            name="peopleAlsoAskDisplay"
                            id="peopleAlsoAskHide"
                            value="hide"
                        />
                    </label>
                    <label htmlFor="peopleAlsoAskCondensed">
                        <h3>Labelled</h3>
                        <input
                            type="radio"
                            name="peopleAlsoAskDisplay"
                            id="peopleAlsoAskCondensed"
                            value="labelled"
                        />
                    </label>
                    <label htmlFor="peopleAlsoAskVisible">
                        <h3>Normal</h3>
                        <input
                            type="radio"
                            name="peopleAlsoAskDisplay"
                            id="peopleAlsoAskVisible"
                            value="normal"
                        />
                    </label>
                </form>
            </div>
        </>
    );
}

export default App;
