const { PrismaClient } = require("@prisma/client");

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");
  fs.createReadStream(path.resolve(__dirname, "../../exampleData.CSV"))
    .pipe(csv.parse({ headers: false }))
    .on("error", (error) => console.error(error))
    .on("data", async function (data) {
      const number = await prisma.number.create({
        data: {
          from: data[0],
          to: data[1],
          code: data[2],
          name: data[3],
        }
      });
      console.log(`Created number with id: ${number.id}`);
    })
    .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
