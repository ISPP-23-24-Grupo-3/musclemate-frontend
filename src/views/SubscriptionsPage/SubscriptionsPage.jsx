import { Button, Flex, Heading, Table } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";

import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { getFromApi, putToApi } from "../../utils/functions/api";
import { CreateCheckoutSession, CreateCheckoutSessionForOwner, CreateCheckoutFreeSession } from "../../utils/functions/stripe";
import { useLocation } from "react-router";
import SubscriptionContext from "../../utils/context/SubscriptionContext";
import AuthContext from "../../utils/context/AuthContext";
import Stripe from "stripe";
import { Link } from "react-router-dom";
import { get } from "react-hook-form";

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY);

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
  notSubscribedGyms,
  setError,
  location_subscription_plan,
}) {
  const { user } = useContext(AuthContext);

  async function handleCancel() {
    const owner = await getFromApi(`owners/detail/${user.username}/`);
    const { customer_id } = await owner.json();
    const customer = await stripe.customers.retrieve(customer_id, {
      expand: ["subscriptions"],
    });
    console.log(customer.subscriptions);
    if (customer.subscriptions.data.length === 0) {
      setError("No tienes suscripciones activas.");
      return;
    }
    if (subscription_plan === "premium") {
      const premium_subscription = customer.subscriptions.data.find(
        (subscription) => subscription.items.data[0].price.id === "price_1Ow67AHg56faYu5eTccV66kL"
      );
      const premium_subscription_quantity = premium_subscription.quantity;
      const premium_subscription_id = premium_subscription.id;
      const premium_item_id = premium_subscription.items.data[0].id;
      if (premium_subscription_quantity === 1) {
        await stripe.subscriptions.cancel(premium_subscription_id);
      } else {
        await stripe.subscriptions.update(premium_subscription_id, {
          items: [
            {
              id: premium_item_id,
              quantity: premium_subscription_quantity - 1,
            },
          ],
        });
      }
    } else {
      const standard_subscription = customer.subscriptions.data.find(
        (subscription) => subscription.items.data[0].price.id === "price_1Ow69FHg56faYu5eI3UjOlqS"
      );
      const standard_subscription_quantity = standard_subscription.quantity;
      const standard_subscription_id = standard_subscription.id;
      const standard_item_id = standard_subscription.items.data[0].id;
      if (standard_subscription_quantity === 1) {
        await stripe.subscriptions.cancel(standard_subscription_id);
      } else {
        await stripe.subscriptions.update(standard_subscription_id, {
          items: [
            {
              id: standard_item_id,
              quantity: standard_subscription_quantity - 1,
            },
          ],
        });
      }
    }
    await putToApi(`gyms/update/${id}/`, { subscription_plan: "free" });
    notSubscribedGyms(id);
  }

  async function handleUpgrade() {
    const owner = await getFromApi(`owners/detail/${user.username}/`);
    const { customer_id } = await owner.json();
    const customer = await stripe.customers.retrieve(customer_id, {
      expand: ["subscriptions"],
    });
    console.log(customer.subscriptions);
    if (customer.subscriptions.data.length === 0) {
      setError("No tienes suscripciones activas.");
      return;
    }
    console.log(customer.subscriptions);
    const standard_subscription = customer.subscriptions.data.find(
      (subscription) => subscription.items.data[0].price.id === "price_1Ow69FHg56faYu5eI3UjOlqS"
    );
    console.log(standard_subscription);
    const premium_subscription = customer.subscriptions.data.find(
      (subscription) => subscription.items.data[0].price.id === "price_1Ow67AHg56faYu5eTccV66kL"
    );
    if (!standard_subscription) {
      setError("No tienes una suscripción estándar.");
      return;
    }
    const standard_subscription_quantity = standard_subscription.quantity;
    const standard_subscription_id = standard_subscription.id;
    const standard_item_id = standard_subscription.items.data[0].id;

    if (premium_subscription) {
      const premium_subscription_quantity = premium_subscription.quantity;
      const premium_subscription_id = premium_subscription.id;
      const premium_item_id = premium_subscription.items.data[0].id;
      await stripe.subscriptions.update(premium_subscription_id, {
        items: [
          {
            id: premium_item_id,
            quantity: premium_subscription_quantity + 1,
          },
        ],
      });
      if (standard_subscription_quantity === 1) {
        await stripe.subscriptions.cancel(standard_subscription_id);
      } else {
        await stripe.subscriptions.update(standard_subscription_id, {
          items: [
            {
              id: standard_item_id,
              quantity: standard_subscription_quantity - 1,
            },
          ],
        });
      }
      await putToApi(`gyms/update/${id}/`, { subscription_plan: "premium" });
      window.location.reload();
      return;
    }

    if (standard_subscription_quantity === 1) {
      await stripe.subscriptions.update(standard_subscription_id, {
        items: [
          {
            id: standard_item_id,
            price: "price_1Ow67AHg56faYu5eTccV66kL",
          },
        ],
      });
    }
    if (standard_subscription_quantity > 1) {
      await stripe.subscriptions.update(standard_subscription_id, {
        items: [
          {
            id: standard_item_id,
            quantity: standard_subscription_quantity - 1,
          },
        ],
      });
      await stripe.subscriptions.create({
        customer: customer_id,
        items: [
          {
            price: "price_1Ow67AHg56faYu5eTccV66kL",
            quantity: 1,
          },
        ],
      });
    }
    await putToApi(`gyms/update/${id}/`, { subscription_plan: "premium" });
    window.location.reload();
    return;

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
          <strong className="text-radixgreen">Dirección:</strong>
          <div>{address}</div>
          <strong className="text-radixgreen">Código Postal</strong>
          <div>{zip_code}</div>
          <strong className="text-radixgreen">Teléfono:</strong>
          <div>{phone_number}</div>
          <strong className="text-radixgreen">Email:</strong>
          <div>{email}</div>
          {subscription_plan && (
            <>
            <strong className="text-radixgreen">Plan de suscripción:</strong>
            <div>{subscription_plan}</div>
            </>
          )}
          
        </dl>
        {location_subscription_plan ? (
          <div className="flex justify-center items-center mt-5">

            {subscription_plan ? (
              <>
                <Button color="red" onClick={() => handleCancel(id, subscription_plan)}>
                  Cancelar suscripción
                </Button>
                {subscription_plan === "standard" ? (
                  <Button color="green" onClick={() => handleUpgrade(id)}>
                    Mejorar suscripción
                  </Button>
                ) : null}
              </>
            ) : (
              <Checkbox.Root
                className="w-6 h-6 border border-black rounded-sm flex items-center justify-center"
                onCheckedChange={() =>
                  handleCheck(id, location_subscription_plan)
                }
              >
                <Checkbox.Indicator className="bg-radixgreen w-full h-full flex justify-center items-center">
                  <CheckIcon color="white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
            )}
            
          </div>
        ) : (
          <div className="flex justify-center items-center mt-5 gap-5">
            <Button color="red" onClick={() => handleCancel(id, subscription_plan)}>
              Cancelar suscripción
            </Button>
            {subscription_plan === "standard" ? (
                  <Button color="green" onClick={() => handleUpgrade(id)}>
                    Mejorar suscripción
                  </Button>
                ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function SubscriptionsPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { gymnSubscription, setGymnSubscription, saveGymnSubscription } =
    useContext(SubscriptionContext);
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState(null);
  const [location_subscription_plan, setLocation_subscription_plan] = useState({priceId: location.state?.priceId, subscription_plan: location.state?.subscription_plan})

  function notSubscribedGyms(id) {
    setGyms((prevGimnasios) => {
      const gimnasioIndex = prevGimnasios.findIndex(
        (gimnasio) => gimnasio.id === id
      );
      if (gimnasioIndex !== -1) {
        const updatedGimnasios = [...prevGimnasios];
        updatedGimnasios.splice(gimnasioIndex, 1);
        if(updatedGimnasios.length === 0) setError("No tienes gimnasios suscritos.");
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

  async function getOwnerCustomerId() {
    const owner = await getFromApi(`owners/detail/${user.username}/`);
    const { customer_id } = await owner.json();
    return customer_id;
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

  async function handleClicked(priceId) {
    if (gymnSubscription.length === 0) {
      setError("Por favor selecciona al menos un gimnasio.");
      return;
    }
    saveGymnSubscription();
    const quantity = gymnSubscription.length;
    const customer_id = await getOwnerCustomerId();
    if (customer_id) {
      CreateCheckoutSessionForOwner(priceId, quantity, customer_id).then((session) => {
        window.location.href = JSON.parse(session).url;
      });
    } else {
    if (location_subscription_plan.subscription_plan === "Estándar") {
      CreateCheckoutFreeSession(priceId, quantity).then((session) => {
        window.location.href = JSON.parse(session).url;
      });
    } else {
      CreateCheckoutSession(priceId, quantity).then((session) => {
        window.location.href = JSON.parse(session).url;
      });
    }
  }
  }

  const GetGyms = async () => {
    const response = await getFromApi("gyms/");
    if (response.ok) {
      const data = await response.json();
      if (!location.state?.subscription_plan) {
        const filteredGyms = data.filter((gym) => gym.subscription_plan !== "free");
        setGyms(filteredGyms);
        if (filteredGyms.length === 0) {
          setError("No tienes gimnasios suscritos.");
        }
      }else{
        const filteredGyms = data.filter((gym) => gym.subscription_plan === "free");
        if (filteredGyms.length === 0) {
          setError("No hay gimnasios disponibles para suscribirse.");
        }
        setGyms(filteredGyms);
      }
    } else {
      setError("Error al cargar los gimnasios.");
    }
  };

  useEffect(() => {
    getOwnerCustomerId();
    cleanGymnSubscription();
    GetGyms();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 m-5">
        <div className="text-center ">
          <Heading size="5" className="text-radixgreen !mt-8 !mb-3 text-center">
            {location_subscription_plan.subscription_plan
              ? "Selecciona tus gimnasios"
              : "Gestiona tus gimnasios suscritos"}
          </Heading>
        </div>
      {!location_subscription_plan.subscription_plan ? (
      <>
        {gyms.length === 0 &&
        <>
        <p className="text-red-500">{"No tienes gimnasios suscritos a ningún plan."}</p>
        <Link to="/owner/pricing">
          <Button color="radixgreen">Ver planes de suscripción</Button>
        </Link>
        </>
        }
      </>
      ) : null}

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
              subscription_plan={
                gym.subscription_plan !== "free" ? gym.subscription_plan : null
              }
              notSubscribedGyms={notSubscribedGyms}
              handleCheck={handleCheck}
              setError={setError}
              location_subscription_plan={location_subscription_plan.subscription_plan}
            />
          ))}
        </div>
        {location_subscription_plan.priceId  && (
          <div className="flex flex-col justify-center items-center m-5 w-full">
            {error && 
            <p className="text-red-500">{error}</p>}

            {error == "No tienes gimnasios suscritos." || error == "No hay gimnasios disponibles para suscribirse." ? null : (
              <button
              className="bg-radixgreen text-white p-2 rounded-lg w-full"
              onClick={() => handleClicked(location_subscription_plan.priceId)}
            >
              Pagar
            </button>
            )}
            
          </div>
        )}
      </div>
    </>
  );
}

export default SubscriptionsPage;
