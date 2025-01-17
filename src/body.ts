export interface BodyDTO {
  
    type: string; // Type of the event, e.g., 'transaction'
    data: {
      companyId?: number; // Company ID
      paymentLinkTenf?: string; // Payment link
  paymentLinkRefrete?: string; // Payment link
      id: string; // Unique transaction ID
      status: string; // Status of the transaction, e.g., 'paid'
      paymentMethod: string; // Payment method, e.g., 'pix'
      customer: {
        email: string; // Customer's email address
        name?: string; // Customer's name (optional)
        phone?: string; // Customer's phone number (optional)
        address?: {
          zipCode?: string; // Customer's address ZIP code (optional)
          street?: string; // Customer's street address (optional)
          state?: string; // Customer's state (optional)
        };
        document: {
          number: string; // Customer's document number
        };
        id?: string; // Customer ID (optional, undefined in final transformations)
      };
      items: {
        title: string; // Title of the item
        unitPrice: number; // Price per unit in cents
        quantity: number; // Quantity of the item
        tangible?: boolean; // Indicates if the item is physical (optional)
      }[]; // List of items in the transaction
      amount: number; // Total amount of the transaction in cents
      shipping?: {
        amount?: number; // Shipping cost in cents (optional)
      };
      secureUrl?: string; // Secure URL for the transaction (optional)
    };
  }
  
  /** @see {CashDto} ts-auto-guard:type-guard */

export interface CreateWebhookDto {
  id:       number;
  type:     string;
  objectId: string;
  url:      string;
  data:     {
      id:             number;
      amount:         number;
      refundedAmount: number;
      companyId:      number;
      installments:   number;
      paymentMethod:  string;
      status:         string;
      postbackUrl?:    string;
      metadata?:       string;
      traceable:      boolean;
      secureId:       string;
      secureUrl:      string;
      createdAt:      string;
      updatedAt:      string;
      ip:             any;
      externalRef:    any;
      customer:       {
          id:          number;
          externalRef?: string;
          name:        string;
          email:       string;
          phone:       string;
          birthdate?:   string;
          createdAt:   string;
          document:    {
              number: string;
              type:   string;
          };
          address:     {
              street:       string;
              streetNumber: string;
              complement?:   string;
              zipCode:      string;
              neighborhood: string;
              city:         string;
              state:        string;
              country:      string;
          };
      };
      boleto:         any;
      pix?:            any;
      shipping:       any;
      refusedReason:  any;
      items:          {
          externalRef?: string;
          title:       string;
          unitPrice:   number;
          quantity:    number;
          tangible:    boolean;
      }[];
      splits:         {
          recipientId: number;
          amount:      number;
          netAmount:   number;
      }[];
      refunds:        any[];
      delivery?:       string;
      fee: {
          fixedAmount:      number;
          spreadPercentage: number;
          estimatedFee:     number;
          netAmount:        number;
      };
  };
}

export interface nota_fiscal_config  {
  id: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  url_logo: string;
  endereco: string;
  complemento: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  store_id: string;
}

export interface SplitWave {
  orderId:                string;
  amount:                 number;
  formattedAmount:        string;
  status:                 string;
  isInfoProducts:         boolean;
  postbackUrl:            string;
  flag:                   null;
  acquirer:               string;
  paymentMethod:          string;
  formattedPaymentMethod: string;
  discount:               number;
  customer:               Customer;
  items:                  Item[];
  pix:                    Pix;
}

export interface Customer {
  ip:       string;
  name:     string;
  email:    string;
  phone:    string;
  document: Document;
}

export interface Document {
  number: string;
  type:   string;
}

export interface Item {
  id:               string;
  price:            number;
  promotionalPrice: null;
  tangible:         boolean;
  type:             string;
  quantity:         number;
  originalItemId:   string;
}

export interface Pix {
  payload:      string;
  encodedImage: string;
}
