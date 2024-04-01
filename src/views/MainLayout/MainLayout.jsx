import Header from "../../components/Header/Header";
import { Theme, Container } from "@radix-ui/themes";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router";
import { AuthProvider } from "../../utils/context/AuthContext";
import { SubscriptionProvider } from "../../utils/context/SubscriptionContext";

const MainLayout = ({ children }) => {
  return (
    <SubscriptionProvider>
      <AuthProvider>
      <Theme>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Container>
            {children}
            <Outlet />
          </Container>
          <Footer />
        </div>
      </Theme>
    </AuthProvider>
    </SubscriptionProvider>
  );
};

export default MainLayout;
