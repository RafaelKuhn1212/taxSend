import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
const prisma = new PrismaClient()

const secretKey = "sk_live_DurWr46sfHxoHloCcWJNoUH4GKM0bruufuUln49zkI"
const url = "https://api.conta.summitpagamentos.com/v1"

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

async function getMetrics() {
    const sells = await getAllCashtime();
    const allEmails = sells.map((sell) => sell.customer.email);
    const uniqueEmails = [...new Set(allEmails)];

    const totalSells = sells.length;
    console.log("Total sells: ", totalSells);

    const sentemails = await prisma.sents.findMany({
      where:{
        source: "summit"
         
      }
    });
    // both in totalSells and uniqueEmails
    const paidSentEmail = sentemails.filter((sent) => 
      uniqueEmails.includes(sent.data.customer.email)
    );
    console.log("Paid sent emails: ", paidSentEmail.length);
    fs.writeFileSync("sells.json", JSON.stringify(paidSentEmail, null, 2));
    }
    
    // getMetrics()

    async function processJsonGetProducts() {
      const data = JSON.parse(fs.readFileSync("sells.json", "utf-8"));
      
      // Extract all items from the sells data
      const products = data.map((sell) => sell.data.items);
      const allProducts = products.flat();
    
      // Use a Map to aggregate quantities by product title
      const productMap = new Map();
    
      allProducts.forEach((product) => {
        if (!productMap.has(product.title)) {
          productMap.set(product.title, 0);
        }
        productMap.set(product.title, productMap.get(product.title) + 1);
      });
    
      // Convert the Map back to an array of objects
      let productsQuantity = Array.from(productMap, ([name, quantity]) => ({ name, quantity }));
      productsQuantity = productsQuantity.sort((a, b) => b.quantity - a.quantity);
      // Write the result to a JSON file
      fs.writeFileSync("products.json", JSON.stringify(productsQuantity, null, 2));
    }
    
    // processJsonGetProducts();