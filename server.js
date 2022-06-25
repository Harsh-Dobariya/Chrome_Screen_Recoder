const express = require("express");
const app = express();

app.use("/", express.static(process.cwd() + "/video"));
app.use(express.json());
app.use("/", require("./routes/video"));

const port = process.env.PORT || 8080;
app.listen(port, "143.244.132.244", () => console.log(`Server is running on...https://143.244.132.244:${port}`));
