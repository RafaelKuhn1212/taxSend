import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
const prisma = new PrismaClient();

const secretKey = "sk_live_WuFHQbIoHmAZgpIDHn4YBfqGhjFOIOFC9hFNQxO3Oa";
const url = "https://api.gateway.cashtimepay.com.br/v1";

async function getAllCashtime() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("Authorization", 'Basic ' + Buffer.from(secretKey + ":x").toString('base64'));

  const resp2 = await fetch(`${url}/transactions/count?status=paid`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });
  const data2 = await resp2.text();
  const pages = Math.ceil(parseInt(data2) / 1000);
  let allData = [];

  for (let i = 0; i < pages; i++) {
    const offset = i * 1000;
    const resp = await fetch(`${url}/transactions?status=paid&page=${i}&offset=${offset}&limit=1000`, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    });
    const data = await resp.json();
    if (resp.status !== 200) throw new Error("Error fetching transactions");
    allData = allData.concat(data);

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return allData;
}

async function generateProductSummary() {
  // Fetch sent transactions
  const sentEmails = await prisma.sents.findMany({
    where: {
      source: "cashtime"
    }
  });
  const sentProducts = sentEmails.flatMap((sent) => sent.data.items);

  // Fetch paid transactions
  const sells = await getAllCashtime();
  const uniqueEmails = new Set(sells.map((sell) => sell.customer.email));

  // Filter sent emails that are also in paid emails
  const paidSentEmails = sentEmails.filter((sent) =>
    uniqueEmails.has(sent.data.customer.email)
  );
  const paidProducts = paidSentEmails.flatMap((sent) => sent.data.items);

  // Aggregate product data
  const productMap = new Map();

  const aggregateProducts = (products, type) => {
    products.forEach((product) => {
      const title = product.title;
      if (!productMap.has(title)) {
        productMap.set(title, { paid: 0, sent: 0 });
      }
      productMap.get(title)[type] += 1;
    });
  };

  aggregateProducts(paidProducts, "paid");
  aggregateProducts(sentProducts, "sent");

  // Convert the map to an array of objects
  const productSummary = Array.from(productMap.entries()).map(([title, { paid, sent }]) => ({
    title,
    paid,
    sent
  })).sort((a, b) => b.paid - a.paid || b.sent - a.sent);

  // Write the result to a JSON file
  fs.writeFileSync("product_summary.json", JSON.stringify(productSummary, null, 2));
  console.log("Product summary generated successfully.");
}

// Generate the summary
generateProductSummary();
