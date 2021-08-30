import React from "react";
import { Route } from "react-router-dom";
import Chat from './Containers/Chat';
import Hoc from "./hoc/hoc";


const BaseRouter = () => (
  <Hoc>
    <Route exact path="/:chatID/" component={Chat} />
  </Hoc>
);

export default BaseRouter;