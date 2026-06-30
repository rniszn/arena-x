import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Arena X server is running." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
