import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from '@/components/contexts/UserContext'; // Đường dẫn đúng tới UserContext
import "./global.css";
import "./styles/style.scss";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <UserProvider>  {/* Bọc App bằng UserProvider */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </UserProvider>
    </QueryClientProvider>
);
