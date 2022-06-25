const router = require("express").Router();

router.post("/record", require("../service/record"));

router.get("/", (req, res) => {
    res.sendFile(`${process.cwd()}/index.html`);
});

module.exports = router;
