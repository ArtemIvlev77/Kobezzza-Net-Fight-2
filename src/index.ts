import { RootApp } from "modules/root";
import { SceneRoot } from "pages/scene";

import "./app/styles/init.css";

const rootApp = new RootApp()
rootApp.root.connection.init()
const sceneRoot = new SceneRoot()
rootApp.initSceneRoot(sceneRoot)
