import { useEffect } from "react";

function Toast({ mensagem, tipo, onClose }) {

  useEffect(() => {    
    setTimeout(onClose, 3000);
  }, [onClose]);

  const bgColor =
    {
      sucesso: "#4CAF50",
      erro: "#F44336",
    }[tipo] || "#4CAF50";

  return (
    <div
      className="toast animate-fade" style={{backgroundColor: bgColor}}
    >
      {mensagem}
    </div>
  );
}

export default Toast;
