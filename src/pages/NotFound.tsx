
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 text-barber-primary">404</h1>
        <p className="text-xl text-barber-dark mb-4">Página não encontrada</p>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe.
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn-primary"
        >
          Voltar para o Início
        </button>
      </div>
    </div>
  );
};

export default NotFound;
