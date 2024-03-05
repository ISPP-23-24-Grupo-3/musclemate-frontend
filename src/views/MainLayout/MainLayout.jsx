import Header from "../../components/Header/Header";
import { Theme, Container } from "@radix-ui/themes";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <Theme>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Container>
          <Outlet />
        </Container>
        <Footer />
      </div>
    </Theme>
  );
};

export default MainLayout;
