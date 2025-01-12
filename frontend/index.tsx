import { initFrontend } from "system/frontend";
import "./app/index.build.css";
import Layout from "./app/layout";

initFrontend({ layout: <Layout /> });

const _ = (
  <div className="relative flex flex-1 items-center justify-center"></div>
);
