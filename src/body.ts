export interface BodyDTO {
  
    type: string; // Type of the event, e.g., 'transaction'
    data: {
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
  