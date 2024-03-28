import { Button, Flex, Heading } from "@radix-ui/themes";
import { useContext, useState } from "react";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi } from "../../utils/functions/api";

export default function MailVerification() {
  const [verificationResult, setVerificationResult] = useState(null);
  const {user} = useContext(AuthContext);
  console.log(user?.username);

  const handleVerification = async (e) => {
    e.preventDefault();
    const token = e.target.token.value;

    try {
      // Make API call here (replace with your actual API endpoint)
      getFromApi(`users/verify/${user.username}/${token}/`)
        .then((response) => { 
          console.log(response);
          if (response.ok) {
            // If API call is successful
            setVerificationResult("success");
          } else {
            // If API call encounters an error
            setVerificationResult("error");
          }
        })
    } catch (error) {
      console.error("Error:", error);
      setVerificationResult("error");
    }
  };

  const closePopup = () => {
    setVerificationResult(null);
  };

  return (
    <>
      <Flex align="center" justify="center" direction="row">
        <Heading
          size="6"
          className="text-radixgreen !mt-8 !mb-2 text-center md:text-left"
        >
          Introduzca su token y haga click en el botón de abajo para verificar el e-mail de {user?.username}!
        </Heading>
      </Flex>

      <Flex direction="column" justify="center" align="center" gap="4" className="mb-5">
        <form onSubmit={handleVerification}>
          <div className="flex flex-col items-center justify-center mt-4">
            <input
              type="text"
              name="token"
              placeholder="Introduce el Token"
              className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 mb-2"
            />
            <Button type="submit" size="4" variant="classic">
              Verificar E-mail
            </Button>
          </div>
        </form>
      </Flex>

      {/* Popup for success */}
      {verificationResult === "success" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-green-600">Verificación de e-mail completa!</p>
            <Button onClick={closePopup} size="2" variant="classic" className="mt-2">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Popup for error */}
      {verificationResult === "error" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-red-600">Verificación de e-mail fallida. Por favor inténtelo de nuevo.</p>
            <Button onClick={closePopup} size="2" variant="classic" className="mt-2">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}