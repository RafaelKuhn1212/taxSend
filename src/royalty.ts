export interface Five {
    event:  string;
    secret: string;
    data:   Data;
}

export interface Data {
    id:                 string;
    customer:           Customer;
    address:            Address;
    splits:             Split[];
    affiliateSplit:     null;
    producerSplit:      Split;
    card:               null;
    pix:                Pix;
    boleto:             null;
    fee:                number;
    pending:            Pending;
    pendingReserve:     Pending;
    liquidAmount:       number;
    refundedAmount:     number;
    amount:             number;
    paidAmount:         number;
    reason:             null;
    exId:               null;
    externalId:         string;
    chargeId:           null;
    e2eId:              null;
    acquirerType:       string;
    baseAmount:         string;
    installments:       number;
    status:             string;
    internalReason:     null;
    paymentMethod:      string;
    description:        null;
    checkoutUrl:        null;
    refererUrl:         null;
    receipt:            null;
    fine:               string;
    gatewayFee:         string;
    interest:           string;
    fixedFee:           string;
    percentageFee:      string;
    costRelease:        number;
    cost:               string;
    fixedCost:          string;
    percentageCost:     string;
    rawPercentageCost:  string;
    profit:             string;
    items:              Item[];
    postbackUrl:        string;
    refusedByAntifraud: boolean;
    createdAt:          string;
    updatedAt:          string;
    paidAt:             string;
    expiresInDays:      number;
    acquirer:           number;
    shipping:           Shipping;
}

export interface Address {
    id:           number;
    street:       string;
    number:       string;
    complement:   string;
    neighborhood: null;
    city:         string;
    state:        string;
    zipcode:      string;
    customer:     number;
}

export interface Customer {
    id:        number;
    name:      string;
    email:     string;
    phone:     string;
    docNumber: string;
    docType:   string;
}

export interface Item {
    title:       string;
    quantity:    number;
    tangible:    boolean;
    unitPrice:   number;
    externalRef: string;
}

export interface Pending {
    releaseDate: string;
}

export interface Pix {
    qrCode:         string;
    expirationDate: string;
}

export interface Split {
    amount:                number;
    amountReserve:         number;
    type:                  string;
    percentage:            number;
    user:                  User;
    pendingBalance:        Pending;
    pendingBalanceReserve: Pending;
}

export interface User {
    id:    number;
    email: string;
}

export interface Shipping {
    amount: number;
}
