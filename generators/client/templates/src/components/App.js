import React from "react";
<% if(this.options.reactRouter) { %>
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
<% } %>
import { hot } from "react-hot-loader/root";

import "../assets/scss/main.scss";

const App = props => {
<% if(this.options.reactRouter) { %>
  return (<Route exact path="/">
    <h2>Hello from react</h2>
  </Route>)
<% } else { %>
  return <h1>Hello from React</h1>;
};
 } -%>

export default hot(App);
