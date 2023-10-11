import "./assets/app.css";
import "./assets/index.css";
import Rotas from "./routes";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.minimal.css";

function App() {
  return (
    <>
      <ToastContainer
        limit={3}
        draggable
        rtl={false}
        pauseOnHover
        closeOnClick
        autoClose={5000}
        pauseOnFocusLoss
        newestOnTop={false}
        position="top-right"
        hideProgressBar={false}
      />
      <Rotas />
    </>
  );
}

export default App;
