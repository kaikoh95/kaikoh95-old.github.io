import { FC, ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const App: FC = (): ReactElement => {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <div />
                    </Route>
                    <Route path="/about">
                        <div />
                    </Route>
                    <Route path="/dashboard">
                        <div />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
