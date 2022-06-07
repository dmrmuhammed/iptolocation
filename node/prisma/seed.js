const { PrismaClient } = require("@prisma/client");

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const prisma = new PrismaClient();

async function main() {
  let csvData = [];
  let stream = fs
    .createReadStream(path.resolve(__dirname, "../../exampleData2.CSV"))
    .pipe(csv.parse({ headers: false }))
    .on("error", (error) => console.error(error))
    .on("data", async function (data) {
      csvData.push({
        from: data[0],
        to: data[1],
        countryCode: data[2],
        countryName: data[3],
        region: data[4],
        city: data[5],
        latitude: parseFloat(data[6]),
        longitude: parseFloat(data[7]),
        zipCode: data[8],
        timeZone: data[9],
        ispName: data[10],
        domainName: data[11],
        netSpeed: data[12],
        iddCode: data[13],
        areaCode: data[14],
        weatherStationCode: data[15],
        weatherStationName: data[16],
        mcc: data[17],
        mnc: data[18],
        mobileBrand: data[19],
        elevation: parseFloat(data[20]),
        usageType: data[21],
      });
    })
    .on("end", async () => {
      console.log("CSV parsing finished");
      const t = 10000;
      for (let i = 0; i < csvData.length / t; i++) {
        await prisma.number
          .createMany({
            data: csvData.slice(i * t, t * (i + 1)),
            skipDuplicates: true,
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
