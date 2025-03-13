export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicle: Vehicle;
}

export interface Vehicle {
  make: string;
  model: string;
  year: string;
  vin: string;
  licensePlate: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedHours: number;
}

export interface QuoteItem {
  serviceId: string;
  quantity: number;
}

export interface Quote {
  id: string;
  customerId: string;
  date: string;
  items: QuoteItem[];
  notes: string;
  status: QuoteStatus;
  total: number;
}

export type QuoteStatus =
  | "rascunho"
  | "enviado"
  | "aprovado"
  | "rejeitado"
  | "concluido"
  | "pendente";
