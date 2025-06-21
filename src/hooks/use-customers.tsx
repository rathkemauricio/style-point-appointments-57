
import { useQuery } from "@tanstack/react-query";
import customerService from "../services/customer.service";

export const useCustomers = () => {
  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getCustomers(),
  });

  return { customers, isLoading, error };
};
