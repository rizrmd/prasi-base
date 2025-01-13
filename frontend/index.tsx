import { initFrontend } from "system/frontend";
import "./app/index.build.css";
import Layout from "./app/layout";

initFrontend({ layout: <Layout /> });

export const html = (
  <div className="relative flex flex-1 items-center justify-center"></div>
);
