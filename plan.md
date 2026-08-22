# Requisitos generales del proyecto

## Requisitos funcionales

### RF1 - Visualización del catálogo de productos

El sistema deberá permitir visualizar el catálogo de productos disponibles para la venta en la ferretería.

### RF2 - Información de los productos

El sistema deberá mostrar para cada producto su nombre, descripción, imagen y precio por unidad.

### RF3 - Categorización de productos

El sistema deberá organizar los productos en diferentes categorías para facilitar su identificación y navegación dentro del catálogo.

### RF4 - Búsqueda de productos

El sistema deberá permitir al usuario buscar productos dentro del catálogo.

### RF5 - Filtrado de productos

El sistema deberá permitir filtrar los productos según criterios disponibles, como su categoría.

### RF6 - Navegación del sitio

El sistema deberá proporcionar enlaces de navegación que permitan acceder fácilmente a las principales secciones del sitio web.

### RF7 - Información comercial

El sistema deberá mostrar información comercial relevante de la ferretería, como datos de contacto, horarios de atención, servicios y medios de pago disponibles.

### RF8 - Formulario de contacto

El sistema deberá proporcionar un formulario mediante el cual el usuario pueda realizar consultas o comunicarse con la ferretería.

### RF9 - Carrito de compras

El sistema deberá permitir al usuario agregar al carrito los productos que desee comprar.

### RF10 - Visualización del carrito

El sistema deberá permitir visualizar los productos agregados al carrito junto con su precio unitario, cantidad y subtotal correspondiente.

### RF11 - Gestión de productos del carrito

El sistema deberá permitir modificar la cantidad de unidades de los productos agregados al carrito y eliminar aquellos que el usuario ya no desee comprar.

### RF12 - Cálculo de subtotal

El sistema deberá calcular el subtotal de cada producto teniendo en cuenta su precio unitario y la cantidad de unidades seleccionadas.

### RF13 - Cálculo del total de la compra

El sistema deberá calcular automáticamente el importe total correspondiente a todos los productos incluidos en el carrito.

### RF14 - Selección de método de pago

El sistema deberá permitir al usuario seleccionar entre los diferentes métodos de pago disponibles para realizar la compra.

### RF15 - Selección de cantidad de cuotas

Cuando el método de pago seleccionado permita financiación, el sistema deberá permitir elegir entre las opciones de cuotas disponibles.

### RF16 - Cálculo de intereses

El sistema deberá calcular los intereses o recargos correspondientes de acuerdo con la cantidad de cuotas y las condiciones de financiación seleccionadas.

### RF17 - Cálculo del total financiado

El sistema deberá calcular el importe total financiado teniendo en cuenta el valor original de la compra y los intereses o recargos correspondientes.

### RF18 - Cálculo del valor de cada cuota

El sistema deberá calcular automáticamente el importe de cada cuota según el total financiado y la cantidad de cuotas seleccionadas.

### RF19 - Visualización de financiación

El sistema deberá informar claramente al usuario las condiciones de financiación antes de confirmar la compra, mostrando como mínimo:

* Total original de la compra.
* Cantidad de cuotas seleccionadas.
* Interés o recargo aplicado.
* Total financiado.
* Valor de cada cuota.

### RF20 - Actualización de cálculos

El sistema deberá actualizar los subtotales, el total de compra y los cálculos de financiación cuando el usuario modifique productos, cantidades, método de pago o cantidad de cuotas.

### RF21 - Validación de formularios

El sistema deberá validar los datos ingresados por el usuario en los formularios antes de procesar la información.

### RF22 - Resumen de compra

El sistema deberá presentar un resumen de la compra antes de su confirmación, incluyendo productos, cantidades, precios, total y método de pago seleccionado.

### RF23 - Confirmación de pedido

El sistema deberá permitir al usuario confirmar el pedido una vez revisados los productos y las condiciones de pago seleccionadas.

### RF24 - Confirmación de la operación

Luego de confirmar el pedido, el sistema deberá informar al usuario que la operación fue realizada correctamente y mostrar un resumen de la compra.

---

## Requisitos no funcionales

### RNF1 - Uso de HTML5

La estructura del sitio web deberá desarrollarse utilizando HTML5.

### RNF2 - Estructura semántica

El sitio deberá utilizar etiquetas semánticas adecuadas para representar correctamente las diferentes secciones y contenidos.

### RNF3 - Accesibilidad

El sitio deberá contemplar aspectos básicos de accesibilidad web, incluyendo textos alternativos en imágenes y una organización comprensible del contenido.

### RNF4 - SEO

La estructura HTML deberá contemplar aspectos básicos de optimización para motores de búsqueda mediante el uso adecuado de títulos, metadatos y etiquetas semánticas.

### RNF5 - Usabilidad

La interfaz deberá presentar los productos, precios, opciones de compra y métodos de pago de forma clara y comprensible para el usuario.

### RNF6 - Facilidad de navegación

La estructura de navegación deberá permitir que el usuario pueda identificar y acceder fácilmente a las principales secciones del sitio.

### RNF7 - Mantenibilidad

El código deberá estar organizado y documentado para facilitar su comprensión, modificación y mantenimiento durante las diferentes etapas del proyecto.

### RNF8 - Legibilidad del código

El código fuente deberá utilizar una estructura ordenada, indentación consistente, nombres comprensibles y comentarios claros.

### RNF9 - Separación de responsabilidades

El proyecto deberá mantener separadas la estructura, presentación e interactividad:

* HTML para estructura y contenido.
* CSS para presentación y diseño visual.
* JavaScript para lógica e interactividad.

### RNF10 - Escalabilidad

La estructura deberá permitir incorporar nuevos productos, categorías y funcionalidades sin requerir una reconstrucción completa del sitio.

### RNF11 - Extensibilidad

El diseño inicial deberá permitir incorporar progresivamente funcionalidades como carrito de compras, búsqueda, filtros, métodos de pago, cálculo de cuotas y confirmación de pedidos.

### RNF12 - Organización de archivos

Los archivos, imágenes y demás recursos deberán mantenerse dentro de una estructura de carpetas clara y organizada.

### RNF13 - Compatibilidad

El sitio deberá poder visualizarse correctamente en navegadores web modernos compatibles con HTML5.

### RNF14 - Precisión de cálculos

Los cálculos de cantidades, subtotales, totales, intereses, financiación y cuotas deberán realizarse de manera consistente con los valores seleccionados por el usuario.

### RNF15 - Claridad de información financiera

La información relacionada con precios, intereses, cuotas y totales deberá presentarse de forma clara para que el usuario pueda comprender las condiciones de la compra antes de confirmarla.

---

# Alcance del proyecto

El proyecto contempla el desarrollo de un **sitio web para una ferretería destinado a exhibir y comercializar productos por Internet**.

En una primera etapa se desarrollará la estructura del sitio utilizando **HTML5**, incluyendo catálogo de productos, categorías, imágenes, descripciones, precios por unidad, información comercial, enlaces, formularios, listas y tablas. Se utilizarán etiquetas semánticas y se tendrán en cuenta aspectos básicos de **accesibilidad y SEO**.

El proyecto quedará preparado para incorporar posteriormente **CSS y JavaScript**, permitiendo evolucionar hacia una plataforma de venta con funcionalidades como:

* Búsqueda y filtrado de productos.
* Carrito de compras.
* Selección y modificación de cantidades.
* Cálculo de subtotales y total de la compra.
* Diferentes métodos de pago.
* Compra en cuotas.
* Cálculo de intereses, total financiado y valor de cada cuota.
* Validación de formularios.
* Resumen y confirmación de pedidos.

El proceso de compra será una **simulación**, por lo que no se contempla inicialmente el procesamiento real de pagos, integración con entidades financieras, facturación electrónica, gestión administrativa de stock, registro e inicio de sesión de clientes ni integración con sistemas logísticos externos.



