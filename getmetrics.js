import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
const prisma = new PrismaClient();

const keys =  [
  {
    "name": "summit",
    "key": "sk_live_DurWr46sfHxoHloCcWJNoUH4GKM0bruufuUln49zkI",
    "url": "https://api.conta.summitpagamentos.com/v1"
  },
  {
    "name": "cashtime",
    "key": "sk_live_WuFHQbIoHmAZgpIDHn4YBfqGhjFOIOFC9hFNQxO3Oa",
    "url": "https://api.gateway.cashtimepay.com.br/v1"
  },
  {
    "name": "fivepagamentos",
    "key": "sk_live_BqUqmFKFSinzr22AgfiwLZk98hiHbLQV4OpLc94fi2",
    "url": "https://api.fivepayments.com.br/v1"
  },
  {
    "name":"paguesafe",
    "key":"sk_live_sThYg93FIBMDHGCUPASUGVHm0Q5OEoON7JOpDxWfGK",
    "url":"https://api.paguesafe.io/v1"
  }
]
const gatName = "paguesafe";
const secretKey = keys.find((key) => key.name === gatName).key;
const url =  keys.find((key) => key.name === gatName).url;

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
      source: "paguesafe"
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
// generateProductSummary();

async function smtpSummary() {

  const emails = JSON.parse(fs.readFileSync("/home/rafa/Documents/email_202501140101.json")).email;


  const allSents = await prisma.sents.findMany({
    where:{
      source: "paguesafe"
    }
  });

  const allemailsSent = allSents.map((sent) => sent.data.customer.email);
  

  let sents = JSON.parse(fs.readFileSync("/home/rafa/Documents/sents_email_202501172339.json")).sents_email;
  sents = sents.filter((sent) => allemailsSent.includes(sent.to));
  const allPaid = await getAllCashtime();
  const allEmails = new Set(allPaid.map((sell) => sell.customer.email));

  // Map to track how many emails each user has sent and if they have paid
  const emailMap = new Map();

  // Process sent emails and check if they are in paid emails
  sents.forEach((sent) => {
    const user = sent.user; // Assuming 'sent.user' is the email address
    if (!emailMap.has(user)) {
      emailMap.set(user, { sent: 0, paid: 0 });
    }

    if (allEmails.has(sent.to)) {
      emailMap.get(user).paid += 1;
    } else {
      emailMap.get(user).sent += 1;
    }
  });

  // Convert the map to an array of objects with email, sent count, and paid count
  let result = Array.from(emailMap.entries()).map(([email, { sent, paid }]) => ({
    email,
    sent,
    paid,
    percentPaid: sent + paid > 0 ? ((paid / (sent + paid)) * 100).toFixed(2) : 0
  }));

  // Order by sent count and then by paid count
  result = result.sort((a, b) => b.sent - a.sent || b.paid - a.paid);
  result.map((res) => {
    res.email = emails.find((email) => email.user === res.email)?.host || 'brevo';
  });
  // Write the result to a JSON file
  fs.writeFileSync("smtp_summary.json", JSON.stringify(result, null, 2));

  console.log("SMTP summary generated successfully.");
}

smtpSummary();

async function findSmtpSummaryHost(){
  const emails = JSON.parse(fs.readFileSync("/home/rafa/Documents/email_202501121817.json")).email;
  const sents = JSON.parse(fs.readFileSync("smtp_summary.json"));
  sents.map((sent) => {
    sent.email = emails.find((email) => email.user === sent.email)?.host || 'brevo';
  });
  fs.writeFileSync("smtp_summary.json", JSON.stringify(sents, null, 2));

}
// findSmtpSummaryHost();

async function findemail(){
  const sents = await prisma.sents.findMany({
    where:{
      data: {
        path: ["companyId"],
        equals: 70254
      }
    }
  })
  console.log(sents);
}

// findemail();

async function findFive(){
  const sents = await prisma.sents.findMany({
    where:{
      source: "zyon"
    }
  });
  const paids = await getAllCashtime();
  const paidEmails = paids.map((paid) => paid.customer.email);
  const uniquePaidEmails = new Set(paidEmails);
  console.log(uniquePaidEmails.size);

  const sentsPaid = sents.filter((sent) => uniquePaidEmails.has(sent.data.customer.email));
  const noRepeatSents = sentsPaid.map((sent) => sent.data.customer.email);
  const uniqueSents = new Set(noRepeatSents);
  console.log(uniqueSents.size);
  fs.writeFileSync("five_emails.json", JSON.stringify(sentsPaid, null, 2));
}
// findFive()

async function allSource(){
  const allSource = await prisma.sents.groupBy({
    by: ['source'],
    _count: {
      source: true
    }
  })
  console.log(allSource);
}

// allSource();