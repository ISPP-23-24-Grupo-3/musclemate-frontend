
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import { Theme, Container } from '@radix-ui/themes';
import Footer from '../../components/Footer/Footer';

const MainLayout = ({ children }) => {
  return (
    <Theme>
    <div className="flex flex-col min-h-screen">
      <Header/> 
    <Container>
            {children}
      </Container>
      <Footer/>
    </div>
    </Theme>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
