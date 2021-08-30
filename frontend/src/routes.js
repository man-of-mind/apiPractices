import React from "react";
import { Route } from "react-router-dom";
import Chat from './Containers/Chat';


const BaseRouter = () => (
  <div>
    <Route exact path="/:chatID/" component={Chat} />
  </div>
);

export default BaseRouter;