// include all of your models here using CommonJS requires
<% if(options["authentication"] === "passport"){ -%>
const User = require("./User.js")

module.exports = {User};
<% } else{ -%>
module.exports = {};
<% } -%>
