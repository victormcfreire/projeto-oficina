import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Customer, Quote, Service } from "../models/types";
import { v4 as uuidv4 } from "uuid";

interface DataContextType {
  customers: Customer[];
  services: Service[];
  quotes: Quote[];
  addCustomer: (customer: Omit<Customer, "id">) => string;
  updateCustomer: (customer: Customer) => void;
  addQuote: (quote: Omit<Quote, "id">) => string;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getServiceById: (id: string) => Service | undefined;
  getQuoteById: (id: string) => Quote | undefined;
  addService: (service: Omit<Service, "id">) => string;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data
const initialServices: Service[] = [
  {
    id: "1",
    name: "Troca de Óleo",
    description: "Troca de óleo padrão com troca de filtro",
    price: 49.99,
    estimatedHours: 0.5,
  },
  {
    id: "2",
    name: "Reposição de Pastilha de Freio",
    description: "Reposição de pastilha do freio dianteiro",
    price: 149.99,
    estimatedHours: 1.5,
  },
  {
    id: "3",
    name: "Rotação do Pneu",
    description: "Serviço padrão de rotação do pneu",
    price: 35.99,
    estimatedHours: 0.5,
  },
  {
    id: "4",
    name: "Diagnóstico do Motor",
    description: "Diagnóstico completo do motor",
    price: 89.99,
    estimatedHours: 1.0,
  },
  {
    id: "5",
    name: "Reposição do Filtro de Ar",
    description: "Reposição do filtro de ar do motor",
    price: 29.99,
    estimatedHours: 0.3,
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);

  // Load data from localStorage on init
  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers");
    const storedQuotes = localStorage.getItem("quotes");
    const storedServices = localStorage.getItem("services");

    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    }

    if (storedQuotes) {
      setQuotes(JSON.parse(storedQuotes));
    }

    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  // Add a new customer
  const addCustomer = (customer: Omit<Customer, "id">): string => {
    const id = uuidv4();
    const newCustomer = { ...customer, id };
    setCustomers([...customers, newCustomer]);
    return id;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
  };

  const addQuote = (quote: Omit<Quote, "id">) => {
    const id = uuidv4();
    const newQuote = { ...quote, id };
    setQuotes([...quotes, newQuote]);
    return id;
  };

  const updateQuote = (quote: Quote) => {
    setQuotes(quotes.map((q) => (q.id === quote.id ? quote : q)));
  };

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter((q) => q.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id);
  };

  const getServiceById = (id: string) => {
    return services.find((s) => s.id === id);
  };

  const getQuoteById = (id: string): Quote | undefined => {
    return quotes.find((quote) => quote.id === id);
  };

  // Add a new service
  const addService = (service: Omit<Service, "id">): string => {
    const id = uuidv4();
    const newService = { id, ...service };
    setServices((prev) => [...prev, newService]);
    return id;
  };

  // Update a service
  const updateService = (service: Service): void => {
    setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
  };

  // Delete a service
  const deleteService = (id: string): void => {
    // Check if service is used in any quotes
    const serviceInUse = quotes.some((quote) =>
      quote.items.some((item) => item.servico.id === id),
    );

    if (serviceInUse) {
      alert(
        "Este serviço está em uso em algum orçamento. Não é possível excluí-lo.",
      );
      return;
    }

    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        services,
        quotes,
        addCustomer,
        updateCustomer,
        addQuote,
        updateQuote,
        deleteQuote,
        addService,
        updateService,
        deleteService,
        getCustomerById,
        getServiceById,
        getQuoteById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
