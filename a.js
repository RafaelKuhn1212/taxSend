const b = [
    { field: '6', value: item.items.map((item) => `
      <tr>
        <td style="border-collapse: collapse;"></td>
      </tr>
      <tr>
        <td style="border-collapse: collapse; width: 75px;">
          <img src="https://s3.rastreou.org/cod-rastreio/placeholder.png"
              style="width:50px; border: 2px solid; border-radius: 10px;">
        </td>
        <td style="border-collapse: collapse;">
          <p style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">
            <strong>${item.title}</strong>
          </p>
          <p style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">
            ${item.quantity} un. x R$&nbsp;${item.unitPrice / 100}
          </p>
        </td>
      </tr>
      <tr>
        <td style="border-collapse: collapse;"></td>
      </tr>
    `).join("\n") },
    { field: '7', value: item.secureUrl },
    { field: '8', value: "PAGUESEGURO" },
    { field: '9', value: ((item.shipping?.amount / 100 || 0) + 27.99).toString() },
    { field: '10', value: (item.amount / 100).toString() },
    { field: '11', value: item.customer.address?.state },
    { field: '12', value: item.customer.address?.street },
    { field: '13', value: new Date().toLocaleTimeString() },
    { field: '14', value: `https://s3.rastreou.org/cod-rastreio/jadlog.png` },
    { field: '15', value: new Date().toLocaleDateString() },
    { field: '16', value: item.customer?.address?.zipCode || "70872050" },
    { field: '17', value: codigoRastreio },
    { field: '18', value: item.customer.document.number },
    { field: '19', value: item.customer.phone },
    { field: '20', value: item.customer.name },
    { field: '21', value: item.customer.email }
  ];
  