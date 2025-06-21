
import { useQuery } from "@tanstack/react-query";
import serviceService from "../services/service.service";

export const useServices = () => {
  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => serviceService.getServices(),
  });

  return { services, isLoading, error };
};
