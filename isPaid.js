function checkItem(data, title, status, email) {
    return data.some(item =>
        item.items.some(subItem => subItem.title === title) &&
        item.status === status &&
        item.customer.email === email
    );
}

const response = await fetch('https://api.gateway.cashtimepay.com.br/v1/transactions/?email=',{
    headers: {
        "Authorization": "Basic c2tfbGl2ZV9XdUZIUWJJb0htQVpncElESG40WUJmcUdoakZPSU9GQzloRk5ReE8zT2E6eA==",
        "Content-Type": "application/json"

    }
})
const data = JSON.parse(response)

const title = "Taxa Tenf";
const status = "paid";
const email = "celioribeirinho67@gmail.com";
const result = checkItem(data, title, status, email);
setVariable("isPaid", result);
