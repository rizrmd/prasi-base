import { initFrontend } from "standalone/frontend";
import "./app/index.build.css";
import Layout from "./app/layout";

initFrontend({ layout: <Layout /> });
