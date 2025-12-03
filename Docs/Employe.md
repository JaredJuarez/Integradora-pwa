Por ahora la informacion no la vas a hardcodear, la vas mokear, crearas los json y haras como si fuera una llamada al endpoint pero consumieras el json para simular las respuestas del back.

El sistema debera de tener los siguientes flujos.
- Estara la landing page, esta te llevara al login o al crear usuario.

El empleado tendra el siguiente flujo posterior al login:
- En la primera pantalla (homescreen) tendar un listado de cards alargadas de manera horizontal que tendran los datos de nombre y direccion de la tienda que le corresponde ir (la ruta del empleado), el id de la tineda lo almacenara igual pero no lo mostrara.
- Al seleccionar alguna tienda le saldra una pantalla que muestre un recuadro con la camara, esto para poder escanear el qr de la tienda a donde llego. Al escanear el qr de la tienda lo compara con el id almacenado y si es igual te deja pasar a la siguiente pantalla.
- En la siguiente pantalla saldran los productos que hay disponibles, aqui el empleado colocara que productos que la tienda requiera, no es obligatorio colocar productos.
- Posterior a eso el empleado debera tomar una foto del estante en donde tiene los productos. Esto quiere decir que la pantalla sera como la de scanear el qr, permitira al empleado tomar foto del estante en donde esta el producto. No permitas pasar a la siguiente pagina si no ha tomado la foto.
- Posterior a eso muestras el resumen completo, guardas el pedido y rediriges al usuario al homescreen.
- El pedido seleccionado pasa a marcarse como completado, asi que solo mostraras en home los que esten en pendientes por completar.