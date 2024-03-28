import { Flex, Heading } from '@radix-ui/themes'
import React from 'react'

const tituloStyle = {
    fontSize: '30px',
    fontWeight: 'bold'
};
const subTituloStyle = {
    fontSize: '20px',
    fontWeight: 'bold'
};
const olStyle = {
    listStyleType: 'decimal',
    marginLeft: '35px',
};

const ulStyle = {
    listStyleType: 'disc',
    marginLeft: '20px',
};
export default function TermsConditions() {

    return (
        <>
            <Flex align="center" justify="center" direction="row">
                <Heading
                    size="6"
                    className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
                >
                    Términos y Condiciones de uso de
                </Heading>
                <img src="/pwa-64x64.png" alt="Logo" className="ml-2 mr-1 mt-3" />
                <Heading size="6" className="!mt-8 !mb-3 text-center">
                    MuscleMate
                </Heading>
            </Flex>
            <div style={{ marginLeft: "1%", size: "6" }}>
            <br></br>
                <p>Última actualización: 18 de marzo de 2024</p>
                <br></br>
                <h1 style={tituloStyle}>Nuestras condiciones legales</h1>
                <br></br>
                <p> Operamos el sitio web MuscleMate (el "Sitio"), así como cualquier otro producto y servicio relacionado que haga referencia o enlace a estos términos legales (los "Términos Legales") (colectivamente, los "Servicios"). </p><br></br>

                <p>Puede ponerse en contacto con nosotros por correo electrónico a <a style={{ color: "green" }}>musclemate33@gmail.com.</a></p><br></br>

                <p>Las presentes Condiciones Legales constituyen un acuerdo jurídicamente vinculante firmado entre usted, ya sea personalmente o en nombre de una entidad ("usted"),
                    y MuscleMate, Inc., en relación con su acceso y uso de los Servicios. Usted acepta que, al acceder a los Servicios, ha leído, comprendido y aceptado la totalidad
                    de las presentes Condiciones Legales. SI NO ESTÁ DE ACUERDO CON TODAS ESTAS CONDICIONES LEGALES, SE LE PROHÍBE EXPRESAMENTE EL USO DE LOS SERVICIOS Y
                    DEBE INTERRUMPIR SU USO INMEDIATAMENTE.</p><br></br>

                <p>Los términos y condiciones o documentos complementarios que puedan publicarse en los Servicios de vez en cuando se incorporan expresamente al presente
                    documento por referencia. Nos reservamos el derecho, a nuestra entera discreción, de realizar cambios o modificaciones en estas Condiciones Legales de
                    vez en cuando. Le avisaremos de cualquier cambio actualizando la fecha de "Última actualización" de estas Condiciones legales, y usted renuncia a cualquier
                    derecho a recibir un aviso específico de cada uno de dichos cambios. Es su responsabilidad revisar periódicamente estas Condiciones Legales para mantenerse
                    informado de las actualizaciones. Usted estará sujeto a los cambios de las Condiciones Legales revisadas y se considerará que los conoce y acepta
                    por el uso continuado que haga de los Servicios después de la fecha de publicación de dichas Condiciones Legales revisadas. </p><br></br>

                <p>Los Servicios están destinados a usuarios mayores de 18 años. Los menores de 18 años no están autorizados a utilizar o registrarse en los Servicios.</p><br></br>

                <p>Le recomendamos que imprima una copia de estas Condiciones Legales para tenerlas registradas.</p><br></br>

                <h1 style={tituloStyle}>Tabla de Contenidos</h1>
                <ol style={olStyle}>
                    <li>Nuestros Servicios</li>
                    <li>Derechos de Propiedad Intelectual
                        <ul style={ulStyle}>
                            <li>Nuestra propiedad intelectual</li>
                            <li>Su uso de nuestros servicios</li>
                            <li>Sus propuestas y contribuciones</li>
                        </ul>
                    </li>
                    <li>Representaciones del Usuario</li>
                    <li>Registro de usuarios</li>
                    <li>Compras y Pagos</li>
                    <li>Suscripciones
                        <ul style={ulStyle}>
                            <li>Facturación y Renovación</li>
                            <li>Prueba gratuita</li>
                            <li>Cancelación</li>
                            <li>Cambios en las tasas</li>
                        </ul>
                    </li>
                    <li>Software</li>
                    <li>Actividades prohibidas</li>
                    <li>Contribuciones generadas por usuarios</li>
                    <li>Licencia de Contribución</li>
                    <li>Directrices de reseñas</li>
                    <li>Gestión de Servicios</li>
                    <li>Política de Privacidad</li>
                    <li>Duración y Rescisión</li>
                    <li>Modificaciones e Interrupciones</li>
                    <li>Legislación aplicable</li>
                    <li>Resolución de Litigios
                        <ul style={ulStyle}>
                            <li>Arbitraje vinculante</li>
                            <li>Restricciones</li>
                        </ul>
                    </li>
                    <li>Correcciones</li>
                    <li>Aviso Legal</li>
                    <li>Limitaciones de responsabilidad</li>
                    <li>Idemnización</li>
                    <li>Datos del Usuario</li>
                    <li>Comunicaciones, transacciones y firmas electrónicas</li>
                    <li>Varios</li>
                </ol>


                <h1 style={tituloStyle}>1. Nuestros Servicios</h1>
                <br></br>
                <p>La información proporcionada al utilizar los Servicios no está destinada a ser distribuida ni utilizada por ninguna persona o entidad en ninguna
                    jurisdicción o país en el que dicha distribución o uso sea contrario a la ley o a la normativa o que nos someta a cualquier requisito de registro en
                    dicha jurisdicción o país. En consecuencia, las personas que decidan acceder a los Servicios desde otras ubicaciones lo harán por iniciativa propia
                    y son los únicos responsables del cumplimiento de las leyes locales, si éstas son aplicables y en la medida en que lo sean.</p><br></br>

                <h1 style={tituloStyle}>2. Derechos de Propiedad Intelectual</h1>
                <br></br>
                <h2 style={subTituloStyle}>Nuestra propiedad intelectual</h2>
                <br></br>
                <p>Somos el propietario o el licenciatario de todos los derechos de propiedad intelectual de nuestros Servicios, incluido todo el código fuente,
                    las bases de datos, la funcionalidad, el software, los diseños de sitios web, el audio, el vídeo, el texto, las fotografías y los gráficos de los
                    Servicios (colectivamente, el "Contenido"), así como las marcas comerciales, las marcas de servicio y los logotipos que contienen (las "Marcas").</p><br></br>

                <p>Nuestro Contenido y Marcas están protegidos por leyes de derechos de autor y marcas registradas (y otros derechos de propiedad intelectual y leyes
                    de competencia desleal) y tratados en Estados Unidos y en todo el mundo.</p><br></br>

                <p>El Contenido y las Marcas se proporcionan en o a través de los Servicios "TAL CUAL" para su uso personal, no comercial o con fines empresariales
                    internos exclusivamente.</p><br></br>

                <h2 style={subTituloStyle}>Su uso de nuestros servicios</h2>
                <br></br>
                <p>Sujeto al cumplimiento por su parte de las presentes Condiciones Legales, incluida la sección "ACTIVIDADES PROHIBIDAS" que figura a continuación,
                    le concedemos una licencia no exclusiva, intransferible y revocable para:</p><br></br>

                <ul style={{ paddingLeft: "50px", listStyleType: 'disc' }}>
                    <li>Acceder a los Servicios; y</li>
                    <li>Descargar o imprimir una copia de cualquier parte del Contenido al que haya accedido correctamente únicamente para su uso personal, no comercial o con fines empresariales internos.</li>
                </ul>
                <br></br>
                <p>Salvo lo dispuesto en esta sección o en cualquier otra parte de nuestras Condiciones Legales, ninguna parte de los Servicios ni ningún Contenido
                    o Marca podrán copiarse, reproducirse, agregarse, republicarse, cargarse, enviarse, mostrarse públicamente, codificarse, traducirse, transmitirse,
                    distribuirse, venderse, licenciarse o explotarse de cualquier otro modo con fines comerciales, sin nuestro permiso expreso previo por escrito.</p><br></br>

                <p>Si desea hacer un uso de los Servicios, Contenidos o Marcas distinto del establecido en esta sección o en cualquier otra parte de nuestras Condiciones
                    Legales, dirija su solicitud a: . Si alguna vez le concedemos el permiso para publicar, reproducir o mostrar públicamente cualquier parte de nuestros
                    Servicios o Contenidos, deberá identificarnos como propietarios o licenciantes de los Servicios, Contenidos o Marcas y asegurarse de que cualquier
                    aviso de copyright o propiedad aparezca o sea visible al publicar, reproducir o mostrar nuestros Contenidos.</p><br></br>

                <p>Nos reservamos todos los derechos no concedidos expresamente a usted sobre los Servicios, el Contenido y las Marcas. Cualquier infracción de estos
                    Derechos de Propiedad Intelectual constituirá un incumplimiento material de nuestras Condiciones Legales y su derecho a utilizar nuestros Servicios
                    finalizará inmediatamente.</p><br></br>

                <h2 style={subTituloStyle}>Sus propuestas y contribuciones</h2>
                <br></br>
                <p>Revise detenidamente esta sección y la sección "ACTIVIDADES PROHIBIDAS" antes de utilizar nuestros Servicios para comprender (a) los derechos que nos
                    otorga y (b) las obligaciones que tiene cuando publica o carga cualquier contenido a través de los Servicios.</p><br></br>

                <p><strong>Contribuciones:</strong> Los Servicios pueden invitarle a chatear, contribuir o participar en blogs, tablones de mensajes, foros en línea y
                    otras funcionalidades durante las cuales usted puede crear, enviar, publicar, mostrar, transmitir, publicar, distribuir o difundir contenido y materiales
                    a nosotros o a través de los Servicios, incluyendo pero no limitado a texto, escritos, vídeo, audio, fotografías, música,
                    gráficos, comentarios, reseñas, sugerencias de calificación, información personal u otro material ('Contribuciones'). Cualquier Envío que se publique
                    también se considerará una Contribución.</p><br></br>

                <p>Usted entiende que las Contribuciones pueden ser vistas por otros usuarios de los Servicios.</p><br></br>

                <p>Al publicar Contribuciones, nos concede una licencia (incluido el uso de su nombre, marcas comerciales y logotipos): Al publicar
                    Contribuciones, nos concede una licencia ilimitada y sin restricciones, derecho y licencia irrevocables, perpetuos, no exclusivos, transferibles,
                    libres de regalías, totalmente pagados y en todo el mundo para: utilizar, copiar, reproducir, distribuir, vender, revender, publicar, emitir,
                    retitular, almacenar, ejecutar públicamente, mostrar públicamente, reformatear, traducir, extraer (en su totalidad o en parte) y explotar sus
                    Contribuciones (incluyendo, sin limitación, su imagen, nombre y voz) para cualquier propósito, comercial, publicitario o de otro tipo, para preparar
                    trabajos derivados de, o incorporar en otros trabajos, sus Contribuciones, y para sublicenciar las licencias concedidas en esta sección.
                    Nuestro uso y distribución podrá producirse en cualquier formato y a través de cualquier canal de comunicación.</p><br></br>

                <p>Esta licencia incluye el uso que hagamos de su nombre, nombre de empresa y nombre de franquicia, según corresponda, y de cualquiera de las marcas
                    comerciales, marcas de servicio, nombres comerciales, logotipos e imágenes personales y comerciales que nos proporcione.</p><br></br>

                <p><strong>Usted es responsable de lo que publica o sube:</strong> Al enviarnos Presentaciones y/o publicar Contribuciones a través de cualquier parte de los
                    Servicios o hacer que las Contribuciones sean accesibles a través de los Servicios vinculando su cuenta a través de los Servicios a cualquiera de sus cuentas
                    de redes sociales, usted:</p><br></br>

                <ul style={{ paddingLeft: "50px", listStyleType: 'disc' }}>
                    <li>Confirma que ha leído y acepta nuestras "ACTIVIDADES PROHIBIDAS" y que no enviará, publicará, cargará ni transmitirá a través de los Servicios ninguna Contribución que sea ilegal, acosadora, odiosa, perjudicial, difamatoria, obscena, intimidatoria, abusiva, discriminatoria, amenazadora para cualquier persona o grupo, sexualmente explícita, falsa, inexacta, engañosa o que induzca a error;</li>
                    <li>En la medida en que lo permita la legislación aplicable, renuncia a todos y cada uno de los derechos morales sobre cualquier Contribución;</li>
                    <li>Garantiza que cualquiera de dichas Presentaciones y/o Contribuciones son originales suyas o que usted tiene los derechos y licencias necesarios para presentar dichas Contribuciones y que tiene plena autoridad para concedernos los derechos antes mencionados en relación con sus Contribuciones; y</li>
                    <li>Garantiza y declara que sus Contribuciones no constituyen información confidencial.</li>
                </ul>
                <br></br>
                <p>Usted es el único responsable de sus Envíos y/o Contribuciones y acepta expresamente reembolsarnos todas y cada una de las pérdidas que podamos
                    sufrir debido a su incumplimiento de (a) esta sección, (b) los derechos de propiedad intelectual de terceros, o (c) la legislación aplicable.</p><br></br>

                <p>Podemos eliminar o editar su Contenido:</p><br></br>


                <h1 style={tituloStyle}>3. Representaciones del Usuario</h1>
                <br></br>
                <p>Al utilizar los Servicios, usted declara y garantiza que: (1) toda la información de registro que envíe será verdadera, exacta, actual y completa;
                    (2) mantendrá la exactitud de dicha información y actualizará puntualmente dicha información de registro según sea necesario;
                    (3) tiene capacidad legal y acepta cumplir estas Condiciones Legales; (4) no es menor de edad en la jurisdicción en la que reside;
                    (5) no accederá a los Servicios a través de medios automatizados o no humanos, ya sea a través de un bot, script o de otro modo;
                    (6) no utilizará los Servicios para ningún propósito ilegal o no autorizado; y (7) su uso de los Servicios no violará ninguna ley o regulación aplicable.</p><br></br>
                <p>Si proporciona información falsa, inexacta, no actualizada o incompleta, tenemos derecho a suspender o cancelar su cuenta y rechazar cualquier uso actual
                    o futuro de los Servicios (o cualquier parte de los mismos).</p><br></br>

                <h1 style={tituloStyle}>4. Registro de usuarios</h1><br></br>
                <p>Es posible que tenga que registrarse para utilizar los Servicios. Usted se compromete a mantener la confidencialidad de su contraseña y
                    será responsable de todo uso que se haga de su cuenta y contraseña. Nos reservamos el derecho a eliminar, reclamar o cambiar un nombre de usuario que
                    usted seleccione si determinamos, a nuestra entera discreción, que dicho nombre de usuario es inapropiado, obsceno o censurable por cualquier otro motivo.</p><br></br>

                <h1 style={tituloStyle}>5. Compras y Pagos</h1><br></br>
                <p>Aceptamos las siguientes formas de pago:</p><br></br>

                <ul style={{ paddingLeft: "50px", listStyleType: 'disc' }}>
                    <li>PayPal</li>
                    <li>MasterCard</li>
                    <li>Visa</li>
                </ul>

                <p>Usted se compromete a proporcionar información actual, completa y precisa sobre la compra y la cuenta para todas las compras realizadas a través de los
                    Servicios. Asimismo, se compromete a actualizar puntualmente la información de la cuenta y de pago, incluida la dirección de correo electrónico,
                    el método de pago y la fecha de caducidad de la tarjeta de pago, para que podamos completar sus transacciones y ponernos en contacto con usted
                    cuando sea necesario. El impuesto sobre las ventas se añadirá al precio de las compras según consideremos necesario. Podemos modificar los precios en
                    cualquier momento. Todos los pagos se realizarán en Euros.</p><br></br>
                <p>Usted acepta pagar todos los cargos a los precios vigentes en ese momento para sus compras y cualquier gasto de envío aplicable, y nos autoriza a
                    cargar a su proveedor de pago elegido dichos importes al realizar su pedido. Nos reservamos el derecho a corregir cualquier error o equivocación en los precios, aunque ya hayamos solicitado o recibido el pago.</p><br></br>
                <p>Nos reservamos el derecho a rechazar cualquier pedido realizado a través de los Servicios. Podemos, a nuestra entera discreción, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido. Estas restricciones pueden incluir pedidos realizados por o bajo la misma cuenta de cliente, el mismo método de pago y/o pedidos que utilicen la misma dirección de facturación o envío. Nos reservamos el derecho a limitar o prohibir pedidos que, a nuestro juicio, parezcan realizados por comerciantes, revendedores o distribuidores.</p><br></br>

                <h1 style={tituloStyle}>6. Suscripciones</h1><br></br>
                <h2 style={subTituloStyle}>Facturación y Renovación</h2><br></br>
                <p>Su suscripción continuará y se renovará automáticamente a menos que se cancele. Usted da su consentimiento para que realicemos cargos recurrentes en su método de pago sin requerir su aprobación previa para cada cargo recurrente, hasta el momento en que cancele el pedido correspondiente. La duración de su ciclo de facturación es mensual.</p><br></br>
                <h2 style={subTituloStyle}>Prueba gratuita</h2><br></br>
                <p>Ofrecemos una prueba gratuita de 30 días a los nuevos usuarios que se registren en los Servicios. Se le cobrará a la cuenta registrada al finalizar la prueba gratuita.</p><br></br>
                <h2 style={subTituloStyle}>Cancelación</h2><br></br>
                <p>Las compras no son reembolsables. Puede cancelar su suscripción en cualquier momento accediendo a su cuenta. La cancelación surtirá efecto al final del periodo de pago en curso.</p><br></br>
                <h2 style={subTituloStyle}>Cambios en las tasas</h2><br></br>
                <p>Podemos, de vez en cuando, hacer cambios en la cuota de suscripción y le comunicaremos cualquier cambio de precio de conformidad con la legislación aplicable.</p><br></br>

                <h1 style={tituloStyle}>7. Software</h1><br></br>
                <p>Podemos incluir software para su uso en relación con nuestros Servicios. Si dicho software va acompañado de un contrato de licencia de usuario final ("CLUF"), los términos del CLUF regirán el uso que usted haga del software. Si dicho software no va acompañado de un CLUF, le concedemos una licencia no exclusiva, revocable, personal e intransferible para utilizar dicho software únicamente en relación con nuestros servicios y de conformidad con las presentes Condiciones Legales. Cualquier software y cualquier documentación relacionada se proporciona "TAL CUAL" sin garantía de ningún tipo, ya sea expresa o implícita, incluyendo, sin limitación, las garantías implícitas de comerciabilidad, idoneidad para un propósito particular o no infracción. Usted acepta todos y cada uno de los riesgos derivados del uso o rendimiento de cualquier software. No podrá reproducir ni redistribuir ningún software, salvo de conformidad con el CLUF o las presentes Condiciones Legales.</p><br></br>

                <h1 style={tituloStyle}>8. Actividades prohibidas</h1><br></br>
                <p>No podrá acceder a los Servicios ni utilizarlos para fines distintos de aquellos para los que los ponemos a su disposición. Los Servicios no podrán utilizarse en relación con ninguna actividad comercial, salvo aquellas que cuenten con nuestro respaldo o aprobación específicos.</p><br></br>

                <p>Como usuario de los Servicios, usted se compromete a no:</p>

                <ul style={{ paddingLeft: "50px", listStyleType: 'disc' }}>
                    <li style={{ paddingBottom: "10px" }}>Recuperar sistemáticamente datos u otros contenidos de los Servicios para crear o compilar, directa o indirectamente, una colección, compilación, base de datos o directorio sin nuestro permiso por escrito.</li>
                    <li style={{ paddingBottom: "10px" }}>Engañarnos, defraudarnos o engañarnos a nosotros y a otros usuarios, especialmente en cualquier intento de obtener información confidencial de la cuenta, como contraseñas de usuario.</li>
                    <li style={{ paddingBottom: "10px" }}>Eludir, desactivar o interferir de cualquier otro modo con las funciones de los Servicios relacionadas con la seguridad, incluidas las funciones que impiden o restringen el uso o la copia de cualquier Contenido o que aplican limitaciones al uso de los Servicios y/o del Contenido incluido en los mismos.</li>
                    <li style={{ paddingBottom: "10px" }}>Desprestigiar, empañar o perjudicar de cualquier otro modo, en nuestra opinión, a nosotros y/o a los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Utilizar cualquier información obtenida de los Servicios con el fin de acosar, abusar o dañar a otra persona.</li>
                    <li style={{ paddingBottom: "10px" }}>Hacer un uso indebido de nuestros servicios de asistencia o presentar informes falsos de abuso o mala conducta.</li>
                    <li style={{ paddingBottom: "10px" }}>Utilizar los Servicios de forma contraria a las leyes o normativas aplicables.</li>
                    <li style={{ paddingBottom: "10px" }}>Establecer marcos o enlaces no autorizados a los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Cargar o transmitir (o intentar cargar o transmitir) virus, troyanos u otro material, incluido el uso excesivo de mayúsculas y el spamming (publicación continua de texto repetitivo), que interfiera en el uso y disfrute ininterrumpido de los Servicios por cualquiera de las partes o que modifique, deteriore, perturbe, altere o interfiera en el uso, las características, las funciones, el funcionamiento o el mantenimiento de los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Participar en cualquier uso automatizado del sistema, como el uso de secuencias de comandos para enviar comentarios o mensajes, o el uso de cualquier minería de datos, bots o herramientas similares de recopilación y extracción de datos.</li>
                    <li style={{ paddingBottom: "10px" }}>Eliminar el aviso de copyright u otros derechos de propiedad de cualquier Contenido.</li>
                    <li style={{ paddingBottom: "10px" }}>Intentar suplantar a otro usuario o persona o utilizar el nombre de usuario de otro usuario.</li>
                    <li style={{ paddingBottom: "10px" }}>Cargar o transmitir (o intentar cargar o transmitir) cualquier material que actúe como mecanismo pasivo o activo de recopilación o transmisión de información, incluidos, entre otros, formatos de intercambio de gráficos claros ("gifs"), píxeles 1×1, web bugs, cookies u otros dispositivos similares (a veces denominados "spyware" o "mecanismos de recopilación pasiva" o "pcms").</li>
                    <li style={{ paddingBottom: "10px" }}>Interferir, interrumpir o crear una carga indebida en los Servicios o en las redes o servicios conectados a los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Acosar, molestar, intimidar o amenazar a cualquiera de nuestros empleados o agentes encargados de proporcionarle cualquier parte de los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Intentar eludir cualquier medida de los Servicios diseñada para impedir o restringir el acceso a los Servicios, o a cualquier parte de los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Copiar o adaptar el software de los Servicios, incluidos, entre otros, Flash, PHP, HTML, JavaScript u otros códigos.</li>
                    <li style={{ paddingBottom: "10px" }}>Salvo en la medida en que lo permita la legislación aplicable, descifrar, descompilar, desensamblar o aplicar ingeniería inversa a cualquiera de los programas informáticos que componen o forman parte de algún modo de los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Salvo que pueda ser el resultado del uso de un motor de búsqueda estándar o de un navegador de Internet, utilizar, lanzar, desarrollar o distribuir cualquier sistema automatizado, incluyendo, sin limitación, cualquier araña, robot, utilidad de engaño, raspador o lector fuera de línea que acceda a los Servicios, o utilizar o lanzar cualquier script no autorizado u otro software.</li>
                    <li style={{ paddingBottom: "10px" }}>Utilizar un agente de compras o comprador para realizar compras en los Servicios.</li>
                    <li style={{ paddingBottom: "10px" }}>Hacer cualquier uso no autorizado de los Servicios, incluida la recopilación de nombres de usuario y/o direcciones de correo electrónico de usuarios por medios electrónicos o de otro tipo con el fin de enviar correo electrónico no solicitado, o crear cuentas de usuario por medios automatizados o bajo falsos pretextos.</li>
                    <li style={{ paddingBottom: "10px" }}>Utilizar los Servicios como parte de cualquier esfuerzo para competir con nosotros o utilizar de cualquier otro modo los Servicios y/o el Contenido para cualquier esfuerzo generador de ingresos o empresa comercial.</li>
                </ul><br></br>

                <h1 style={tituloStyle}>9. Contribuciones generadas por usuarios</h1><br></br>
                <p>Los Servicios pueden invitarle a chatear, contribuir o participar en blogs, tablones de mensajes, foros en línea y otras funcionalidades, y pueden ofrecerle la oportunidad de crear, enviar, publicar, mostrar, transmitir, ejecutar, publicar, distribuir o difundir contenidos y materiales a nosotros o en los Servicios, incluyendo pero no limitado a texto, escritos, vídeo, audio, fotografías, gráficos, comentarios, sugerencias o información personal u otro material (colectivamente, "Contribuciones"). Las Contribuciones pueden ser vistas por otros usuarios de los Servicios y a través de sitios web de terceros. Por lo tanto, las contribuciones que usted transmita pueden ser tratadas como no confidenciales y sin derechos de propiedad. Al crear o poner a disposición cualquier contribución, usted declara y garantiza que:</p><br></br>

                <ul style={{ paddingLeft: "50px", listStyleType: 'disc' }}>
                    <li style={{ paddingBottom: "10px" }}>La creación, distribución, transmisión, exhibición pública o ejecución, y el acceso, descarga o copia de sus Contribuciones no infringen ni infringirán los derechos de propiedad, incluidos, entre otros, los derechos de autor, patentes, marcas comerciales, secretos comerciales o derechos morales de terceros</li>
                    <li style={{ paddingBottom: "10px" }}>Usted es el creador y propietario o tiene las licencias, derechos, consentimientos, liberaciones y permisos necesarios para utilizar y autorizarnos a nosotros, a los Servicios y a otros usuarios de los Servicios a utilizar sus Contribuciones de cualquier forma contemplada en los Servicios y en las presentes Condiciones Legales.</li>
                    <li style={{ paddingBottom: "10px" }}>Usted cuenta con el consentimiento, la autorización y/o el permiso por escrito de todas y cada una de las personas físicas identificables que aparecen en sus Contribuciones para utilizar el nombre o la imagen de todas y cada una de dichas personas físicas identificables con el fin de permitir la inclusión y el uso de sus Contribuciones de cualquier forma contemplada en los Servicios y en las presentes Condiciones Legales.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no son falsas, inexactas o engañosas. Sus contribuciones no son publicidad no solicitada o no autorizada, materiales promocionales, esquemas piramidales, cartas en cadena, spam, correos masivos u otras formas de solicitud.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no son obscenas, lascivas, obscenas, violentas, acosadoras, difamatorias, calumniosas o censurables de cualquier otra forma (según nuestro criterio).</li>
                    <li style={{ paddingBottom: "10px" }}>Sus contribuciones no ridiculizan, se burlan, menosprecian, intimidan ni maltratan a nadie.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no se utilizan para acosar o amenazar (en el sentido legal de esos términos) a ninguna otra persona ni para promover la violencia contra una persona o clase de personas concretas.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no infringen ninguna ley, reglamento o norma aplicable.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no violan los derechos de privacidad o publicidad de terceros.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no infringen ninguna ley aplicable relativa a la pornografía infantil o destinada a proteger la salud o el bienestar de los menores.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus contribuciones no deben incluir comentarios ofensivos relacionados con la raza, la nacionalidad, el sexo, las preferencias sexuales o la discapacidad física.</li>
                    <li style={{ paddingBottom: "10px" }}>Sus Contribuciones no infringen, ni enlazan a material que infrinja, ninguna disposición de las presentes Condiciones Legales, ni ninguna ley o normativa aplicable.</li>
                </ul>


                <p>Cualquier uso de los Servicios que infrinja lo anterior infringe estas Condiciones Legales y puede dar lugar, entre otras cosas, a la rescisión o suspensión de sus derechos de uso de los Servicios</p><br></br>


                <h1 style={tituloStyle}>10. Licencia de Contribución</h1><br></br>
                <p>Al publicar sus Contribuciones en cualquier parte de los Servicios, usted nos otorga automáticamente, y declara y garantiza que tiene derecho a otorgarnos, un derecho y una licencia ilimitados, irrevocables, perpetuos, no exclusivos, transferibles, libres de regalías, totalmente pagados, en todo el mundo, para alojar, utilizar, copiar, reproducir, divulgar, vender, revender, publicar, difundir, retitular, archivar, almacenar, almacenar en caché, ejecutar públicamente, mostrar públicamente, reformatear, traducir, transmitir, extractar (en su totalidad o en parte) y distribuir dichas Contribuciones (incluyendo, sin limitación, su imagen y voz) para cualquier propósito, comercial, publicitario o de otro tipo, y para preparar trabajos derivados de, o incorporar en otros trabajos, dichas Contribuciones, y conceder y autorizar sublicencias de lo anterior. El uso y la distribución podrán realizarse en cualquier formato y a través de cualquier canal de comunicación.</p><br></br>
                <p>Esta licencia se aplicará a cualquier forma, medio o tecnología conocida en la actualidad o que se desarrolle en el futuro, e incluye el uso que hagamos de su nombre, nombre de empresa y nombre de franquicia, según corresponda, y de cualquiera de las marcas comerciales, marcas de servicio, nombres comerciales, logotipos e imágenes personales y comerciales que nos proporcione. Usted renuncia a todos los derechos morales sobre sus Contribuciones, y garantiza que no se han hecho valer de otro modo derechos morales sobre sus Contribuciones.</p><br></br>
                <p>No hacemos valer ninguna propiedad sobre sus Contribuciones. Usted conserva la plena propiedad de todas sus Contribuciones y de cualquier derecho de propiedad intelectual u otros derechos de propiedad asociados a sus Contribuciones. No somos responsables de ninguna declaración o representación en sus Contribuciones proporcionadas por usted en cualquier área de los Servicios. Usted es el único responsable de sus Contribuciones a los Servicios y usted acepta expresamente exonerarnos de toda responsabilidad y abstenerse de emprender cualquier acción legal contra nosotros en relación con sus Contribuciones.</p><br></br>
                <p>Tenemos derecho, a nuestra entera y absoluta discreción, (1) a editar, redactar o modificar de cualquier otro modo cualquier Contribución; (2) a volver a categorizar cualquier Contribución para colocarla en lugares más apropiados de los Servicios; y (3) a preseleccionar o eliminar cualquier Contribución en cualquier momento y por cualquier motivo, sin previo aviso. No tenemos ninguna obligación de supervisar sus Contribuciones.</p><br></br>

                <h1 style={tituloStyle}>11. Directrices de reseñas</h1><br></br>
                <p>Podemos ofrecerle áreas en los Servicios para que deje reseñas o valoraciones. Al publicar una reseña, debe cumplir los siguientes criterios: (1) debe tener experiencia de primera mano con la persona/entidad objeto de la reseña; (2) sus reseñas no deben contener blasfemias ofensivas, ni lenguaje abusivo, racista, ofensivo o que incite al odio; (3) sus reseñas no deben contener referencias discriminatorias por motivos de religión, raza, sexo, nacionalidad, edad, estado civil, orientación sexual o discapacidad; (4) sus reseñas no deben contener referencias a actividades ilegales; (5) no debe estar afiliado a competidores si publica reseñas negativas; (6) no debe sacar conclusiones sobre la legalidad de una conducta; (7) no puede publicar declaraciones falsas o engañosas; y (8) no puede organizar una campaña animando a otros a publicar reseñas, ya sean positivas o negativas.</p><br></br>
                <p>Podemos aceptar, rechazar o eliminar opiniones a nuestra entera discreción. No tenemos obligación alguna de examinar las opiniones ni de eliminarlas, aunque alguien las considere censurables o inexactas. Las opiniones no están avaladas por nosotros y no representan necesariamente nuestras opiniones o las de cualquiera de nuestros afiliados o socios. No asumimos responsabilidad alguna por las opiniones vertidas ni por las reclamaciones, responsabilidades o pérdidas derivadas de las mismas. Al publicar una opinión, nos concede un derecho y una licencia perpetuos, no exclusivos, mundiales, libres de regalías, totalmente pagados, asignables y sublicenciables para reproducir, modificar, traducir, transmitir por cualquier medio, mostrar, ejecutar y/o distribuir todo el contenido relacionado con la opinión.</p><br></br>

                <h1 style={tituloStyle}>12. Gestión de Servicios</h1><br></br>
                <p>Nos reservamos el derecho, pero no la obligación, de: (1) supervisar los Servicios para detectar infracciones de estas Condiciones Legales; (2) emprender las acciones legales oportunas contra cualquier persona que, a nuestra entera discreción, infrinja la ley o estas Condiciones Legales, incluyendo, sin limitación, denunciar a dicho usuario ante las autoridades policiales; (3) a nuestra entera discreción y sin limitación, denegar, restringir el acceso, limitar la disponibilidad o inhabilitar (en la medida en que sea tecnológicamente factible) cualquiera de sus Contribuciones o cualquier parte de las mismas; (4) a nuestra entera discreción y sin limitación, notificación o responsabilidad, eliminar de los Servicios o deshabilitar de otro modo todos los archivos y contenidos que tengan un tamaño excesivo o que sean de algún modo una carga para nuestros sistemas; y (5) gestionar de otro modo los Servicios de un modo diseñado para proteger nuestros derechos y propiedad y para facilitar el correcto funcionamiento de los Servicios.</p><br></br>

                <h1 style={tituloStyle}>13. Política de Privacidad</h1><br></br>
                <p>Nos preocupamos por la privacidad y la seguridad de los datos. Al utilizar los Servicios, usted acepta quedar vinculado por nuestra Política de Privacidad publicada en los Servicios, que se incorpora a las presentes Condiciones Legales. Tenga en cuenta que los Servicios están alojados en España. Si accede a los Servicios desde cualquier otra región del mundo con leyes u otros requisitos que regulen la recopilación, el uso o la divulgación de datos personales que difieran de las leyes aplicables en España, entonces, a través del uso continuado de los Servicios, está transfiriendo sus datos a España, y consiente expresamente que sus datos sean transferidos y procesados en España.</p><br></br>

                <h1 style={tituloStyle}>14. Duración y Rescisión</h1><br></br>
                <p>Estas Condiciones Legales permanecerán en pleno vigor y efecto mientras usted utilice los Servicios. SIN LIMITAR NINGUNA OTRA DISPOSICIÓN DE ESTAS CONDICIONES LEGALES, NOS RESERVAMOS EL DERECHO, A NUESTRA ENTERA DISCRECIÓN Y SIN PREVIO AVISO NI RESPONSABILIDAD, DE DENEGAR EL ACCESO Y EL USO DE LOS SERVICIOS (INCLUIDO EL BLOQUEO DE DETERMINADAS DIRECCIONES IP), A CUALQUIER PERSONA POR CUALQUIER MOTIVO O SIN MOTIVO ALGUNO, INCLUIDO, SIN LIMITACIÓN, EL INCUMPLIMIENTO DE CUALQUIER DECLARACIÓN, GARANTÍA O PACTO CONTENIDO EN ESTAS CONDICIONES LEGALES O DE CUALQUIER LEY O NORMATIVA APLICABLE. PODEMOS PONER FIN A SU USO O PARTICIPACIÓN EN LOS SERVICIOS O ELIMINAR CUALQUIER CONTENIDO O INFORMACIÓN QUE HAYA PUBLICADO EN CUALQUIER MOMENTO, SIN PREVIO AVISO, A NUESTRA ENTERA DISCRECIÓN.</p><br></br>
                <p>Si cancelamos o suspendemos su cuenta por cualquier motivo, se le prohíbe registrarse y crear una nueva cuenta con su nombre, un nombre falso o prestado, o el nombre de un tercero, aunque actúe en nombre de éste. Además de cancelar o suspender su cuenta, nos reservamos el derecho a emprender las acciones legales oportunas, incluyendo, sin limitación, la interposición de acciones civiles, penales y de cesación.</p><br></br>

                <h1 style={tituloStyle}>15. Modificaciones e Interrupciones</h1><br></br>
                <p>Nos reservamos el derecho a cambiar, modificar o eliminar el contenido de los Servicios en cualquier momento o por cualquier motivo, a nuestra entera discreción y sin previo aviso. No obstante, no tenemos obligación alguna de actualizar la información de nuestros Servicios. No seremos responsables ante usted ni ante terceros por ninguna modificación, cambio de precio, suspensión o interrupción de los Servicios.</p><br></br>
                <p>No podemos garantizar que los Servicios estén disponibles en todo momento. Podemos experimentar problemas de hardware, software o de otro tipo, o necesitar realizar tareas de mantenimiento relacionadas con los Servicios, lo que puede dar lugar a interrupciones, retrasos o errores. Nos reservamos el derecho a cambiar, revisar, actualizar, suspender, interrumpir o modificar de otro modo los Servicios en cualquier momento o por cualquier motivo sin previo aviso. Usted acepta que no tenemos responsabilidad alguna por cualquier pérdida, daño o inconveniente causado por su incapacidad para acceder o utilizar los Servicios durante cualquier tiempo de inactividad o interrupción de los Servicios. Nada de lo dispuesto en las presentes Condiciones Legales se interpretará como una obligación por nuestra parte de mantener y dar soporte a los Servicios o de suministrar correcciones, actualizaciones o versiones relacionadas con los mismos.</p><br></br>

                <h1 style={tituloStyle}>16. Legislación aplicable</h1><br></br>
                <p>Las presentes Condiciones Legales se rigen e interpretan conforme a las leyes de España, y se excluye expresamente el uso de la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías. Si su residencia habitual se encuentra en la UE, y usted es un consumidor, cuenta además con la protección que le proporcionan las disposiciones obligatorias de la ley de su país de residencia. y usted aceptan someterse a la jurisdicción no exclusiva de los tribunales de España, lo que significa que usted podrá hacer una reclamación para defender sus derechos de protección del consumidor en relación con estas Condiciones Legales en España, o en el país de la UE en el que resida.</p><br></br>

                <h1 style={tituloStyle}>17. Resolución de Litigios</h1><br></br>
                <h2 style={subTituloStyle}>Arbitraje vinculante</h2><br></br>
                <p>Cualquier controversia derivada de las relaciones entre las Partes de las presentes Condiciones Legales será resuelta por un árbitro que será elegido de conformidad con el Reglamento de Arbitraje e Interno de la Corte Europea de Arbitraje que forma parte del Centro Europeo de Arbitraje con sede en Estrasburgo, y que esté en vigor en el momento de la presentación de la solicitud de arbitraje, y cuya adopción de la presente cláusula constituye su aceptación. La lengua del procedimiento será el español. Las normas de derecho sustantivo aplicables serán la ley de España.</p><br></br>
                <h2 style={subTituloStyle}>Restricciones</h2><br></br>
                <p>Las Partes acuerdan que cualquier arbitraje se limitará a la Disputa entre las Partes individualmente. En la medida en que lo permita la ley, (a) no se acumulará ningún arbitraje con ningún otro procedimiento; (b) no existe ningún derecho o autoridad para que cualquier Disputa sea arbitrada sobre una base de acción colectiva o para utilizar procedimientos de acción colectiva; y (c) no existe ningún derecho o autoridad para que cualquier Disputa sea presentada en una supuesta capacidad representativa en nombre del público en general o de cualquier otra persona.</p><br></br>
                <p>Las Partes acuerdan que las siguientes controversias no están sujetas a las disposiciones anteriores relativas al arbitraje vinculante: (a) cualquier controversia que pretenda hacer cumplir o proteger, o relativa a la validez de, cualquiera de los derechos de propiedad intelectual de una Parte; (b) cualquier controversia relacionada con, o derivada de, acusaciones de robo, piratería, invasión de la privacidad o uso no autorizado; y (c) cualquier reclamación de medidas cautelares. Si se determina que esta disposición es ilegal o inaplicable, ninguna de las Partes optará por someter a arbitraje ninguna Disputa que entre dentro de la parte de esta disposición considerada ilegal o inaplicable y dicha Disputa será decidida por un tribunal de jurisdicción competente dentro de los tribunales enumerados anteriormente, y las Partes acuerdan someterse a la jurisdicción personal de dicho tribunal.</p><br></br>

                <h1 style={tituloStyle}>18. Correcciones</h1><br></br>
                <p>Puede haber información en los Servicios que contenga errores tipográficos, inexactitudes u omisiones, incluidas descripciones, precios, disponibilidad y otra información diversa. Nos reservamos el derecho a corregir cualquier error, inexactitud u omisión y a modificar o actualizar la información de los Servicios en cualquier momento, sin previo aviso.</p><br></br>

                <h1 style={tituloStyle}>19. Aviso Legal</h1><br></br>
                <p>LOS SERVICIOS SE PRESTAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". USTED ACEPTA QUE EL USO QUE HAGA DE LOS SERVICIOS SERÁ POR SU CUENTA Y RIESGO. EN LA MEDIDA EN QUE LA LEY LO PERMITA, RENUNCIAMOS A TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, EN RELACIÓN CON LOS SERVICIOS Y EL USO QUE USTED HAGA DE LOS MISMOS, INCLUIDAS, A TÍTULO MERAMENTE ENUNCIATIVO Y NO LIMITATIVO, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN DETERMINADO Y NO INFRACCIÓN. NO GARANTIZAMOS NI DECLARAMOS LA EXACTITUD O INTEGRIDAD DEL CONTENIDO DE LOS SERVICIOS NI DEL CONTENIDO DE LOS SITIOS WEB O APLICACIONES MÓVILES VINCULADOS A LOS SERVICIOS Y NO ASUMIREMOS RESPONSABILIDAD ALGUNA POR (1) ERRORES, EQUIVOCACIONES O INEXACTITUDES DEL CONTENIDO Y LOS MATERIALES, (2) LESIONES PERSONALES O DAÑOS MATERIALES, DE CUALQUIER NATURALEZA, DERIVADOS DE SU ACCESO A LOS SERVICIOS Y DE SU USO DE LOS MISMOS, (3) CUALQUIER ACCESO O USO NO AUTORIZADO DE NUESTROS SERVIDORES SEGUROS Y/O CUALQUIER INFORMACIÓN PERSONAL Y/O FINANCIERA ALMACENADA EN ELLOS, (4) CUALQUIER INTERRUPCIÓN O CESE DE LA TRANSMISIÓN HACIA O DESDE LOS SERVICIOS, (5) CUALQUIER ERROR, VIRUS, TROYANO O SIMILAR QUE PUEDA SER TRANSMITIDO A O A TRAVÉS DE LOS SERVICIOS POR CUALQUIER TERCERO, Y/O (6) CUALQUIER ERROR U OMISIÓN EN CUALQUIER CONTENIDO Y MATERIAL O POR CUALQUIER PÉRDIDA O DAÑO DE CUALQUIER TIPO INCURRIDO COMO RESULTADO DEL USO DE CUALQUIER CONTENIDO PUBLICADO, TRANSMITIDO O PUESTO A DISPOSICIÓN A TRAVÉS DE LOS SERVICIOS. NO AVALAMOS, GARANTIZAMOS NI ASUMIMOS RESPONSABILIDAD ALGUNA POR LOS PRODUCTOS O SERVICIOS ANUNCIADOS U OFRECIDOS POR TERCEROS A TRAVÉS DE LOS SERVICIOS, SITIOS WEB HIPERVINCULADOS O SITIOS WEB O APLICACIONES PARA MÓVILES QUE APAREZCAN EN BANNERS U OTROS ANUNCIOS, Y NO SEREMOS PARTE NI RESPONSABLES EN MODO ALGUNO DE SUPERVISAR LAS TRANSACCIONES ENTRE USTED Y TERCEROS PROVEEDORES DE PRODUCTOS O SERVICIOS. AL IGUAL QUE CON LA COMPRA DE UN PRODUCTO O SERVICIO A TRAVÉS DE CUALQUIER MEDIO O EN CUALQUIER ENTORNO, DEBE UTILIZAR SU MEJOR CRITERIO Y ACTUAR CON CAUTELA CUANDO PROCEDA.</p><br></br>

                <h1 style={tituloStyle}>20. Limitaciones de responsabilidad</h1><br></br>
                <p>EN NINGÚN CASO NOSOTROS O NUESTROS DIRECTORES, EMPLEADOS O AGENTES SEREMOS RESPONSABLES ANTE USTED O ANTE TERCEROS POR DAÑOS DIRECTOS, INDIRECTOS, CONSECUENTES, EJEMPLARES, INCIDENTALES, ESPECIALES O PUNITIVOS, INCLUYENDO LUCRO CESANTE, PÉRDIDA DE INGRESOS, PÉRDIDA DE DATOS U OTROS DAÑOS QUE SURJAN DE SU USO DE LOS SERVICIOS, INCLUSO SI HEMOS SIDO ADVERTIDOS DE LA POSIBILIDAD DE TALES DAÑOS. DURANTE EL PERÍODO DE UN MES ANTERIOR A LA PRESENTE CAUSA DE ACCIÓN, DETERMINADAS LEYES ESTATALES E INTERNACIONALES NO PERMITEN LA LIMITACIÓN DE LAS GARANTÍAS IMPLÍCITAS NI LA EXCLUSIÓN O LIMITACIÓN DE DETERMINADOS DAÑOS. SI ESTAS LEYES SON DE APLICACIÓN EN SU CASO, ES POSIBLE QUE ALGUNAS O TODAS LAS RENUNCIAS O LIMITACIONES ANTERIORES NO SEAN DE APLICACIÓN EN SU CASO Y QUE USTED TENGA DERECHOS ADICIONALES.</p><br></br>

                <h1 style={tituloStyle}>21. Idemnización</h1><br></br>
                <p>Usted se compromete a defendernos, indemnizarnos y eximirnos de toda responsabilidad, incluidas nuestras subsidiarias, filiales y todos nuestros respectivos directivos, agentes, socios y empleados, frente a cualquier pérdida, daño, responsabilidad, reclamación o demanda, incluidos los honorarios y gastos razonables de abogados, interpuesta por terceros debido a o como consecuencia de: (2) el uso de los Servicios; (3) el incumplimiento de estas Condiciones legales; (4) cualquier incumplimiento de sus declaraciones y garantías establecidas en estas Condiciones legales; (5) su violación de los derechos de un tercero, incluidos, entre otros, los derechos de propiedad intelectual; o (6) cualquier acto perjudicial manifiesto hacia cualquier otro usuario de los Servicios con el que se haya conectado a través de los Servicios.</p><br></br>
                <p>No obstante lo anterior, nos reservamos el derecho, a su cargo, de asumir la defensa y el control exclusivos de cualquier asunto por el que deba indemnizarnos, y usted acepta cooperar, a su cargo, con nuestra defensa de dichas reclamaciones. Haremos todos los esfuerzos razonables para notificarle cualquier reclamación, acción o procedimiento que esté sujeto a esta indemnización en cuanto tengamos conocimiento de ello.</p><br></br>

                <h1 style={tituloStyle}>22. Datos del Usuario</h1><br></br>
                <p>Conservaremos determinados datos que usted transmita a los Servicios con el fin de gestionar el funcionamiento de los mismos, así como datos relativos a su uso de los Servicios. Aunque realizamos copias de seguridad periódicas de los datos, usted es el único responsable de todos los datos que transmita o que estén relacionados con cualquier actividad que haya realizado utilizando los Servicios. Usted acepta que no tendremos ninguna responsabilidad ante usted por cualquier pérdida o corrupción de dichos datos, y por la presente renuncia a cualquier derecho de acción contra nosotros derivado de cualquier pérdida o corrupción de dichos datos.</p><br></br>

                <h1 style={tituloStyle}>23. Comunicaciones, transacciones y firmas electrónicas</h1><br></br>
                <p>La visita a los Servicios, el envío de correos electrónicos y la cumplimentación de formularios en línea constituyen comunicaciones electrónicas. Usted da su consentimiento para recibir comunicaciones electrónicas, y acepta que todos los acuerdos, avisos, divulgaciones y otras comunicaciones que le proporcionemos electrónicamente, por correo electrónico y en los Servicios, satisfacen cualquier requisito legal de que dicha comunicación sea por escrito. POR LA PRESENTE, ACEPTA EL USO DE FIRMAS, CONTRATOS, PEDIDOS Y OTROS REGISTROS ELECTRÓNICOS, ASÍ COMO LA ENTREGA ELECTRÓNICA DE NOTIFICACIONES, POLÍTICAS Y REGISTROS DE TRANSACCIONES INICIADAS O COMPLETADAS POR NOSOTROS O POR TERCEROS. A TRAVÉS DE LOS SERVICIOS. Por la presente, usted renuncia a cualquier derecho o requisito en virtud de cualquier estatuto, reglamento, norma, ordenanza u otra ley de cualquier jurisdicción que exija una firma original o la entrega o conservación de registros no electrónicos, o a los pagos o la concesión de créditos por cualquier medio que no sea electrónico.</p><br></br>

                <h1 style={tituloStyle}>24. Varios</h1><br></br>
                <p>Las presentes Condiciones Legales y cualesquiera políticas o normas de funcionamiento publicadas por nosotros en los Servicios o en relación con los Servicios constituyen la totalidad del acuerdo y entendimiento entre usted y nosotros. El hecho de que no ejerzamos o hagamos valer cualquier derecho o disposición de estas Condiciones Legales no constituirá una renuncia a dicho derecho o disposición. Estas Condiciones Legales se aplicarán en la máxima medida permitida por la ley. Podemos ceder cualquiera o todos nuestros derechos y obligaciones a terceros en cualquier momento. No seremos responsables de ninguna pérdida, daño, retraso u omisión causados por causas ajenas a nuestro control razonable. Si se determina que alguna disposición o parte de una disposición de estas Condiciones legales es ilegal, nula o inaplicable, dicha disposición o parte de la disposición se considerará separable de estas Condiciones legales y no afectará a la validez y aplicabilidad de las disposiciones restantes. No se crea ninguna relación de empresa conjunta, asociación, empleo o agencia entre usted y nosotros como resultado de estas Condiciones Legales o del uso de los Servicios. Usted acepta que estas Condiciones Legales no se interpretarán en nuestra contra por el hecho de haberlas redactado. Por la presente, usted renuncia a cualquier defensa que pueda tener basada en la forma electrónica de estas Condiciones Legales y en la falta de firma de las partes para ejecutar estas Condiciones Legales.</p><br></br>
            </div >
        </>
    )
}
