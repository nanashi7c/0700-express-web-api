import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello!\n");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
