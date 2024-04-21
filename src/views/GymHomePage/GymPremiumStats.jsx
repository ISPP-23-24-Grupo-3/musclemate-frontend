import { Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react"
import { getFromApi } from "../../utils/functions/api";

export default function GymPremiumStats() {

    const [data, setData] = useState([]);

    useEffect(() => {
        getFromApi("/equipments/global/")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Estadísticas no disponibles");
            }
        })
        .then((data) => {
            let lista = data.map((item, index) => {
                return {
                    id: index,
                    name: item.name,
                    brand: item.brand,
                    group: item.muscular_group,
                };
            });
            setData(lista);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    return(
        <>
            <Flex align="center" justify="center" direction="column">
                <Heading size="7" className="text-radixgreen !mt-8 !mb-3 text-center md:text-left">
                    Ranking de Máquinas más Usadas
                </Heading>

                <table className="mt-5" style={{textAlign: "center", fontSize: 18}}>
                        <thead>
                            <tr style={{color: '#444'}}>
                                <th style={{padding: 10, border: '3px solid #30A46C'}}>Puesto</th>
                                <th style={{padding: 10, border: '3px solid #30A46C'}}>Nombre</th>
                                <th style={{padding: 10, border: '3px solid #30A46C'}}>Marca</th>
                                <th style={{padding: 10, border: '3px solid #30A46C'}}>Músculo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} style={{backgroundColor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'rgba(205, 127, 50, 0.6)' : 'rgba(48, 164, 108, 0.3)'}}>                                    
                                    <td style={{padding: 10, border: '3px solid #30A46C', fontWeight: 'bold', color: "#444"}}>{index+1}</td>
                                    <td style={{padding: 10, border: '3px solid #30A46C'}}>{item.name}</td>
                                    <td style={{padding: 10, border: '3px solid #30A46C'}}>{item.brand}</td>
                                    <td style={{padding: 10, border: '3px solid #30A46C'}}>{item.group}</td>
                                </tr>
                            ))}
                        </tbody>
                </table>     
            </Flex>
        </>
    );
};