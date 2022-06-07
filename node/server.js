require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const parser = require("ip-parse");

const app = express();
const port = process.env.PORT || 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:8080" }));

// Routes
// app.get("/", async (req, res) => {
//   const numbers = await prisma.number.findMany({
//     take: 50,
//   });
//   res.json(numbers);
// });

app.post("/", async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    res.status(400).json({ error: "IP is required" });
    return;
  }

  const arr = parser.parseIp(ip);
  const number =
    parseFloat(arr[0]) * 256 * 256 * 256 +
    parseFloat(arr[1]) * 256 * 256 +
    parseFloat(arr[2]) * 256 +
    parseFloat(arr[3]);

  const numbers = await prisma.number.findMany({
    where: {
      OR: [
        {
          from: {
            lt: number,
          },
          to: {
            gt: number,
          },
        },
      ],
    },
  });

  if (numbers.length === 0) {
    res.json({ error: "No number found on database!" });
  } else res.json(numbers);
});

// Start Server
app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});
