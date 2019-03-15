const app = require("./app");
const port = process.env.PORT || 8080;

const inProduction = app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server is running on heroku with PORT number ${port}`);
  } else {
    console.log(`Server is running on https://localhost:${port}`);
  }
});
