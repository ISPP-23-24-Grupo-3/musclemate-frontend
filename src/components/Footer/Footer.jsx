
import { Grid, Box, Flex} from '@radix-ui/themes';

const Footer = () => {
  return (
    <Box className="bg-gray-100 border-t-2 border-black">
        <Flex justify="center">
            <img src="/pwa-64x64.png" alt="Logo" />
        </Flex>
      <Grid
        columns="3" // Adjust the column distribution as needed
        gap="4">
        {/* Left column */}
        <Box className="flex justify-center" height="9">
          <p>Example information</p>
        </Box>

        {/* Middle column */}
        <Box className="flex justify-center" height="9">
          {/* Add your example information here */}
          <p>Example information</p>
        </Box>

        {/* Right column */}
        <Box className="flex justify-center" height="9">
          {/* Add your example information here */}
          <p>Example information</p>
        </Box>
      </Grid>
    </Box>
  );
};

export default Footer;
