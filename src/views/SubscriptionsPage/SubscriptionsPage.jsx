import { Button, Flex, Heading, Table } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";

import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { getFromApi } from "../../utils/functions/api";
import { CreateCheckoutSession } from "../../utils/functions/stripe";
import { useLocation } from "react-router";
import SubscriptionContext from "../../utils/context/SubscriptionContext";
import AuthContext from "../../utils/context/AuthContext";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY

const stripe = new Stripe(STRIPE_SECRET_KEY)

function Gym({
  id,
  name,
  address,
  zip_code,
  descripcion,
  phone_number,
  email,
  subscription_plan,
  handleCheck,
  subscription_plan_id,
  notSubscribedGyms
}) {
  const location = useLocation();
  const {user} = useContext(AuthContext);

  async function handleClick() {
    const owner = await getFromApi(`owners/detail/${user.username}/`);
    const { customer_id } = await owner.json();
    const customer = await stripe.customers.retrieve(customer_id, {
      expand: ["subscriptions"],
    });
    const subcription_quantity = customer.subscriptions.data[0].quantity;
    if (subcription_quantity === 1) {
      await stripe.subscriptions.cancel(customer.subscriptions.data[0].id);
      console.log("Subscription deleted successfully");
    } else {
      const item_id = customer.subscriptions.data[0].items.data[0].id;
      await stripe.subscriptions.update(customer.subscriptions.data[0].id, {
        items: [
          {
            id: item_id,
            quantity: subcription_quantity - 1,
          },
        ],
      });
      console.log("Subscription updated successfully");
    }
    notSubscribedGyms(id);
  }


 
  return (
    <div className="border border-radixgreen rounded-lg w-full">
      <div className="space-y-1.5 p-4 flex flex-col items-center gap-1">
        <h3 className="font-semibold whitespace-nowrap tracking-tight text-base text-center">
          {name}
        </h3>
      </div>
      <div className="p-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <strong className="text-radixgreen">Address:</strong>
          <div>{address}</div>
          <strong className="text-radixgreen">Postal Code:</strong>
          <div>{zip_code}</div>
          <strong className="text-radixgreen">Phone:</strong>
          <div>{phone_number}</div>
          <strong className="text-radixgreen">Email:</strong>
          <div>{email}</div>
        </dl>
        {location.state?.subscription_plan ? <div className="flex justify-center items-center mt-5">
        <Checkbox.Root
          className="w-6 h-6 border border-black rounded-sm flex items-center justify-center"
          onCheckedChange={() => handleCheck(id, location.state?.subscription_plan)}
        >
          <Checkbox.Indicator className="bg-radixgreen w-full h-full flex justify-center items-center" >
            <CheckIcon color="white" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        </div>
        : <div className="flex justify-center items-center mt-5"> 
        <Button color="red" onClick={() => handleClick(id)}>Cancelar suscripción</Button>
        </div>}
        
      </div>
    </div>
  );
}

function SubscriptionsPage() {
  const location = useLocation();
  const { gymnSubscription, setGymnSubscription, saveGymnSubscription } =
    useContext(SubscriptionContext);
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState(null);

  function notSubscribedGyms(id) {
    setGyms((prevGimnasios) => {
      const gimnasioIndex = prevGimnasios.findIndex(
        (gimnasio) => gimnasio.id === id
      );
      if (gimnasioIndex !== -1) {
        const updatedGimnasios = [...prevGimnasios];
        updatedGimnasios.splice(gimnasioIndex, 1);
        return updatedGimnasios;
      } else {
        return [...prevGimnasios];
      }
    });
    console.log(gyms);
  }

  function cleanGymnSubscription() {
    setGymnSubscription([]);
  }

  function handleCheck(id, subscription_plan) {
    setGymnSubscription((prevGimnasios) => {
      const gimnasioIndex = prevGimnasios.findIndex(
        (gimnasio) => gimnasio.gym === id
      );
      if (gimnasioIndex !== -1) {
        const updatedGimnasios = [...prevGimnasios];
        updatedGimnasios.splice(gimnasioIndex, 1);
        return updatedGimnasios;
      } else {
        return [...prevGimnasios, { gym: id, subscription_plan }];
      }
    });
    console.log(gymnSubscription);
  }

  function handleClicked(priceId) {
    if (gymnSubscription.length === 0) {
      setError("Por favor selecciona al menos un gimnasio.");
      return;
    }
    saveGymnSubscription();
    const quantity = gymnSubscription.length;
    CreateCheckoutSession(priceId, quantity).then((session) => {
      window.location.href = JSON.parse(session).url;
    });
  }

  const GetGyms = async () => {
    const response = await getFromApi("gyms/");
    if (response.ok) {
      const data = await response.json();
      setGyms(data);
    } else {
      alert("Error al obtener los gimnasios.");
    }
  };

  useEffect(() => {
    cleanGymnSubscription();
    GetGyms();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 m-5">
        <div className="text-center ">
          <Heading size="5" className="text-radixgreen !mt-8 !mb-3 text-center">
            {location.state?.subscription_plan ? "Selecciona tus gimnasios" : "Gestiona tus gimnasios suscritos"}
          </Heading>
        </div>
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
        {gyms.map((gym) => (
          <Gym
            key={gym.id}
            id={gym.id}
            name={gym.name}
            address={gym.address}
            zip_code={gym.zip_code}
            descripcion={gym.descripcion}
            phone_number={gym.phone_number}
            email={gym.email}
            subscription_plan={gym.subscription_plan ? gym.subscription_plan : null}
            subscription_plan_id={gym.subscription_plan_id ? gym.subscription_plan_id : null}
            notSubscribedGyms={notSubscribedGyms}
            handleCheck={handleCheck}
          />
        ))}
        </div>
        {location.state?.priceId && (
          <div className="flex flex-col justify-center items-center m-5 w-full">
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="bg-radixgreen text-white p-2 rounded-lg w-full"
              onClick={() => handleClicked(location.state.priceId)}
            >
              Pagar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SubscriptionsPage;
