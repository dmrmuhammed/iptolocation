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
app.get("/", async (req, res) => {
  const numbers = await prisma.number.findMany();
  res.json(numbers);
});

app.post("/", async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    res.status(400).json({ error: "IP is required" });
    return;
  }

  const arr = parser.parseIp(ip);
  const str =
    arr[0] * 256 * 256 * 256 + arr[1] * 256 * 256 + arr[2] * 256 + arr[3];
  const number = parseFloat(str);
  const exampleIpNumber = 2957694646;

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
        {
          from: {
            lt: exampleIpNumber,
          },
          to: {
            gt: exampleIpNumber,
          },
        },
      ],
    },
  });

  res.json(numbers);
});

// Start Server
app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});
