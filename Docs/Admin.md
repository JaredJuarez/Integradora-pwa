Por ahora la informacion no la vas a hardcodear, la vas mokear, crearas los json y haras como si fuera una llamada al endpoint pero consumieras el json para simular las respuestas del back.

El administrador tendra las siguientes funcionalidades dentro del sistema posterior a hacer el login:
- CRUD de Empleados
- CRUD de Tiendas
- CRUD de productos
- Asignacion de empleados a tiendas.

Se tendra que manejar alguna funcionalidad para que se le puedas asignar las tiendas a los diferentes empleados, recordando que a los empleados les saldran todas las tiendas a visitar.
En el CRUD de los productos solo sera el tipo de producto, no habra un stock o un inventario, no se tendran que colocar cantidad de productos, solo el tipo de productos disponibles.
En el CRUD de tiendas, solo sera para colocar el nombre de la tienda, frecuencia de la visita y la direccion, que sera la unica informacion que se necesita saber, el id de la tienda se generara automaticamente desde el back. De igual manera se le podra asignar el empleado a la tienda para que la visite.
En el CRUD de empleados sera la informacion basica de los empleados para sus cuentas.

Igual verifica la imagen agregada  en la parte inferior para poder crearla en conjunto a la informacion que se requiere, tambien modifica el lado del empleado, en cuestion de los datos que recibe.
Como puedes ver en la tabla de stores hay frecuencia de visita y fecha de la ultima visita. Dentro del panel del usuario, se mostraran solo las tiendas que la fecha converja con la fecha actual, es decir, si la fecha de ultima visita es 1/12/2025 y es con una freccuencia de 3 días, el siguiente día de visita sería el 4/12/2025, es decir que hoy si me apareceria esa card para asignarle la visita y los días anteriores no. En caso de que no sea la fecha de visita, no se mostrará. Tambien si no tiene fecha de ultima visita (una tienda recien agregada), mostraras la tienda al repartidor para que vaya y se genere la fecha de ultima visita.

![alt text](<Imagen de WhatsApp 2025-12-04 a las 12.46.29_be04739f.jpg>)