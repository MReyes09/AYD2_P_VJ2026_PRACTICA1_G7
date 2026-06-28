## POST `/estudiantes` — Registro de estudiante

Crea una nueva cuenta de estudiante en la plataforma. Registra los datos personales, credenciales de acceso y método de pago. Si se envía fotografía, se almacena localmente en el servidor con nombre único generado por UUID.

---

## Detalles

| Campo        | Valor                        |
|--------------|------------------------------|
| **Método**   | `POST`                       |
| **URL**      | `/estudiantes`               |
| **Body**     | `multipart/form-data`        |
| **Auth**     | No requerida                 |

---

## Campos del body

| Campo             | Tipo   | Requerido | Descripción                              |
|-------------------|--------|-----------|------------------------------------------|
| `nombreCompleto`  | string | si        | Nombre completo del estudiante           |
| `mail`            | string | si        | Correo electrónico (debe ser único)      |
| `contrasenia`     | string | si        | Contraseña (se almacena encriptada)      |
| `fechaNacimiento` | string | no        | Fecha en formato `YYYY-MM-DD`            |
| `nit`             | string | no        | NIT del estudiante                       |
| `numeroTarjeta`   | string | si        | Número de tarjeta de pago                |
| `fechaVencimiento`| string | si        | Vencimiento de tarjeta: `YYYY-MM`        |
| `fotografia`      | file   | no        | Imagen del perfil (jpg, png, etc.)       |

---

## Ejemplo de uso

```bash
curl -X POST http://localhost:5000/estudiantes \
  -F "nombreCompleto=Juan Pérez" \
  -F "mail=juan@test.com" \
  -F "contrasenia=pass1234" \
  -F "fechaNacimiento=2000-05-15" \
  -F "nit=12345678" \
  -F "numeroTarjeta=4111111111111111" \
  -F "fechaVencimiento=2027-12" \
  -F "fotografia=@/ruta/foto.jpg"
```

---

## Respuestas

### `201 Created` — Registro exitoso

```json
{
    "mensaje": "Estudiante registrado exitosamente.",
    "idPersona": 1,
    "idTarjeta": 1
}
```

### `400 Bad Request` — Correo ya registrado

```json
{
    "error": "El correo electrónico ya está registrado."
}
```

### `400 Bad Request` — Campos requeridos faltantes

```json
{
    "error": "Campos requeridos faltantes: nombreCompleto, mail"
}
```

### `500 Internal Server Error` — Error del servidor

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```


## GET `/estudiantes/{id}` — Obtener perfil de estudiante

Retorna los datos personales del estudiante junto con sus tarjetas registradas.

| Campo      | Valor                  |
|------------|------------------------|
| **Método** | `GET`                  |
| **URL**    | `/estudiantes/{id}`    |
| **Auth**   | No requerida           |

## Parámetros de ruta

| Parámetro | Tipo | Descripción              |
|-----------|------|--------------------------|
| `id`      | int  | ID del estudiante        |

## Ejemplo de uso

```bash
curl -X GET http://localhost:5000/estudiantes/1
```

## Respuestas

### `200 OK` — Perfil encontrado

```json
{
    "idPersona": 1,
    "nombreCompleto": "Juan Pérez",
    "fechaNacimiento": "2000-05-15",
    "mail": "juan@test.com",
    "nit": 12345678,
    "fotografia": "uploads/fotografias/a3f9c1d2....jpg",
    "idRol": 1,
    "tarjetas": [
        {
            "idTarjeta": 1,
            "fechaVencimiento": "2027-12-01",
            "idPersona": 1
        }
    ]
}
```

### `404 Not Found` — Estudiante no existe

```json
{
    "error": "Estudiante no encontrado."
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```

---

## PUT `/estudiantes/{id}` — Actualizar datos personales

Actualiza los datos personales del estudiante. Solo se modifican los campos que se envíen. Si se incluye una nueva fotografía, la anterior es eliminada del servidor automáticamente.

| Campo      | Valor                  |
|------------|------------------------|
| **Método** | `PUT`                  |
| **URL**    | `/estudiantes/{id}`    |
| **Body**   | `multipart/form-data`  |
| **Auth**   | No requerida           |

## Parámetros de ruta

| Parámetro | Tipo | Descripción              |
|-----------|------|--------------------------|
| `id`      | int  | ID del estudiante        |

## Campos del body

Todos los campos son opcionales. Solo se actualizan los que se envíen.

| Campo             | Tipo   | Descripción                              |
|-------------------|--------|------------------------------------------|
| `nombreCompleto`  | string | Nombre completo del estudiante           |
| `mail`            | string | Correo electrónico (debe ser único)      |
| `contrasenia`     | string | Nueva contraseña                         |
| `fechaNacimiento` | string | Fecha en formato `YYYY-MM-DD`            |
| `nit`             | int    | NIT del estudiante                       |
| `fotografia`      | file   | Nueva imagen de perfil (jpg, png, etc.)  |

## Ejemplo de uso

```bash
curl -X PUT http://localhost:5000/estudiantes/1 \
  -F "nombreCompleto=Juan Pérez Actualizado" \
  -F "fotografia=@/ruta/nueva_foto.jpg"
```

## Respuestas

### `200 OK` — Actualización exitosa

```json
{
    "mensaje": "Datos actualizados correctamente.",
    "idPersona": 1
}
```

### `404 Not Found` — Estudiante no existe

```json
{
    "error": "Estudiante no encontrado."
}
```

### `400 Bad Request` — Correo ya en uso

```json
{
    "error": "El correo electrónico ya está en uso por otro estudiante."
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```
---


## PUT `/estudiantes/{id}/tarjeta` — Actualizar tarjeta de pago

Reemplaza la tarjeta de pago del estudiante. Si ya tenía una tarjeta registrada, se elimina y se crea la nueva con el número de tarjeta como identificador.

| Campo      | Valor                          |
|------------|--------------------------------|
| **Método** | `PUT`                          |
| **URL**    | `/estudiantes/{id}/tarjeta`    |
| **Body**   | `application/json`             |
| **Auth**   | No requerida                   |

## Parámetros de ruta

| Parámetro | Tipo | Descripción       |
|-----------|------|-------------------|
| `id`      | int  | ID del estudiante |

## Campos del body

| Campo             | Tipo   | Requerido | Descripción                       |
|-------------------|--------|-----------|-----------------------------------|
| `numeroTarjeta`   | string | si        | Número de la nueva tarjeta        |
| `fechaVencimiento`| string | si        | Vencimiento en formato `YYYY-MM`  |

## Ejemplo de uso

```bash
curl -X PUT http://localhost:5000/estudiantes/1/tarjeta \
  -H "Content-Type: application/json" \
  -d '{
    "numeroTarjeta": "4111111111111111",
    "fechaVencimiento": "2028-06"
  }'
```

## Respuestas

### `200 OK` — Tarjeta actualizada

```json
{
    "mensaje": "Tarjeta actualizada correctamente.",
    "idTarjeta": 4111111111111111,
    "idPersona": 1
}
```

### `404 Not Found` — Estudiante no existe

```json
{
    "error": "Estudiante no encontrado."
}
```

### `400 Bad Request` — Campos requeridos faltantes

```json
{
    "error": "Campos requeridos faltantes: numeroTarjeta, fechaVencimiento"
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```
---

# MODULO SUSCRIPCIÓN

## GET `/tarifas` — Listar tarifas disponibles

Retorna todas las tarifas de suscripción disponibles en la plataforma.

| Campo      | Valor        |
|------------|--------------|
| **Método** | `GET`        |
| **URL**    | `/tarifas`   |
| **Auth**   | No requerida |

## Ejemplo de uso

```bash
curl -X GET http://localhost:5000/tarifas
```

## Respuestas

### `200 OK` — Lista de tarifas

```json
[
    {
        "descripcion": "Acceso completo por 1 mes",
        "idTarifa": 1,
        "precio": 50.0,
        "tipoTarifa": "Mensual"
    },
    {
        "descripcion": "Ahorra 10% vs mensual, válido 3 meses",
        "idTarifa": 2,
        "precio": 130.0,
        "tipoTarifa": "Trimestral"
    },
    {
        "descripcion": "La mejor opción, ahorra 20% vs mensual",
        "idTarifa": 3,
        "precio": 480.0,
        "tipoTarifa": "Anual"
    }
]

```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```

---

## POST `/suscripciones` — Adquirir suscripción

Crea una suscripción para el estudiante según la tarifa seleccionada. La fecha de caducidad se calcula automáticamente: Mensual +1 mes, Trimestral +3 meses, Anual +12 meses. Un estudiante solo puede tener una suscripción registrada a la vez.

| Campo      | Valor              |
|------------|--------------------|
| **Método** | `POST`             |
| **URL**    | `/suscripciones`   |
| **Body**   | `application/json` |
| **Auth**   | No requerida       |

## Campos del body

| Campo       | Tipo | Requerido | Descripción                  |
|-------------|------|-----------|------------------------------|
| `idPersona` | int  | SI        | ID del estudiante            |
| `idTarifa`  | int  | SI        | ID de la tarifa seleccionada |

## Ejemplo de uso

```bash
curl -X POST http://localhost:5000/suscripciones \
  -H "Content-Type: application/json" \
  -d '{
    "idPersona": 1,
    "idTarifa": 2
  }'
```

## Respuestas

### `201 Created` — Suscripción adquirida

```json
{
    "mensaje": "Suscripción adquirida exitosamente.",
    "idSuscripcion": 1,
    "fechaCompra": "2026-06-25",
    "fechaCaducidad": "2026-09-25",
    "tipoTarifa": "trimestral",
    "precio": 130.00
}
```

### `400 Bad Request` — Estudiante ya tiene suscripción

```json
{
    "error": "El estudiante ya cuenta con una suscripción registrada."
}
```

### `400 Bad Request` — Campos requeridos faltantes

```json
{
    "error": "Campos requeridos faltantes: idTarifa"
}
```

### `404 Not Found` — Estudiante no existe

```json
{
    "error": "Estudiante no encontrado."
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```

---

## GET `/suscripciones/estudiante/{id}` — Ver suscripción del estudiante

Retorna la suscripción registrada del estudiante, incluyendo estado y detalle de la tarifa.

| Campo      | Valor                              |
|------------|------------------------------------|
| **Método** | `GET`                              |
| **URL**    | `/suscripciones/estudiante/{id}`   |
| **Auth**   | No requerida                       |

## Parámetros de ruta

| Parámetro | Tipo | Descripción       |
|-----------|------|-------------------|
| `id`      | int  | ID del estudiante |

## Ejemplo de uso

```bash
curl -X GET http://localhost:5000/suscripciones/estudiante/1
```

## Respuestas

### `200 OK` — Suscripción encontrada

```json
{
    "idSuscripcion": 1,
    "fechaCompra": "2026-06-25",
    "fechaCaducidad": "2026-09-25",
    "idEstadoSuscripcion": 1,
    "estado": "Activa",
    "idTarifa": 2,
    "tipoTarifa": "Trimestral",
    "precio": 130.00,
    "idPersona": 1
}
```

### `404 Not Found` — Estudiante no existe

```json
{
    "error": "Estudiante no encontrado."
}
```

### `404 Not Found` — Sin suscripción registrada

```json
{
    "error": "El estudiante no tiene una suscripción registrada."
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```

---

## PUT `/suscripciones/{id}/cancelar` — Cancelar suscripción

Cambia el estado de la suscripción a `"Cancelada"`. No elimina el registro ni corta el acceso de inmediato — el estudiante mantiene acceso al contenido hasta que se cumpla la `fechaCaducidad`.

| Campo      | Valor                              |
|------------|------------------------------------|
| **Método** | `PUT`                              |
| **URL**    | `/suscripciones/{id}/cancelar`     |
| **Body**   | No requerido                       |
| **Auth**   | No requerida                       |

## Parámetros de ruta

| Parámetro | Tipo | Descripción          |
|-----------|------|----------------------|
| `id`      | int  | ID de la suscripción |

## Ejemplo de uso

```bash
curl -X PUT http://localhost:5000/suscripciones/1/cancelar
```

## Respuestas

### `200 OK` — Suscripción cancelada

```json
{
    "mensaje": "Suscripción cancelada. El acceso se mantiene hasta la fecha de caducidad.",
    "idSuscripcion": 1,
    "fechaCaducidad": "2026-09-25",
    "estado": "Cancelada"
}
```

### `400 Bad Request` — Ya estaba cancelada

```json
{
    "error": "La suscripción ya se encuentra cancelada."
}
```

### `404 Not Found` — Suscripción no existe

```json
{
    "error": "Suscripción no encontrada."
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```

---

## PUT `/suscripciones/{id}/renovar` — Renovar suscripción

Suma los meses de la tarifa a la `fechaCaducidad` actual. Si se envía un `idTarifa` distinto, cambia el plan antes de renovar. Si la suscripción estaba cancelada, se reactiva automáticamente.

| Campo      | Valor                              |
|------------|------------------------------------|
| **Método** | `PUT`                              |
| **URL**    | `/suscripciones/{id}/renovar`      |
| **Body**   | `application/json` (opcional)      |
| **Auth**   | No requerida                       |

## Parámetros de ruta

| Parámetro | Tipo | Descripción          |
|-----------|------|----------------------|
| `id`      | int  | ID de la suscripción |

## Campos del body

| Campo      | Tipo | Requerido | Descripción                                  |
|------------|------|-----------|----------------------------------------------|
| `idTarifa` | int  | ❌        | Nuevo plan a aplicar. Si se omite, usa el actual. |

## Ejemplos de uso

```bash
# Renovar con el mismo plan
curl -X PUT http://localhost:5000/suscripciones/1/renovar \
  -H "Content-Type: application/json" \
  -d '{}'

# Renovar cambiando a plan anual
curl -X PUT http://localhost:5000/suscripciones/1/renovar \
  -H "Content-Type: application/json" \
  -d '{ "idTarifa": 3 }'
```

## Comportamiento según caso

| Caso | Resultado |
|------|-----------|
| Renovar con mismo plan | Suma meses de la tarifa actual a `fechaCaducidad` |
| Renovar con plan distinto | Cambia `idTarifa` y suma meses del nuevo plan |
| Renovar una cancelada | Reactiva a `"Activa"` y suma meses |

## Respuestas

### `200 OK` — Suscripción renovada

```json
{
    "mensaje": "Suscripción renovada exitosamente.",
    "idSuscripcion": 1,
    "fechaCaducidad": "2026-10-25",
    "tipoTarifa": "Mensual",
    "precio": 50.00,
    "estado": "Activa"
}
```

### `400 Bad Request` — Tarifa no existe

```json
{
    "error": "La tarifa seleccionada no existe."
}
```

### `404 Not Found` — Suscripción no existe

```json
{
    "error": "Suscripción no encontrada."
}
```

### `500 Internal Server Error`

```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```
# MODULO CURSOS ADMIN

## Endpoints — Gestión de Dificultades

Base URL: `http://localhost:5000`

---

## GET `/dificultades` — Listar dificultades

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `/dificultades` |

```bash
curl -X GET http://localhost:5000/dificultades
```

### `200 OK`
```json
[
    { "idDificultad": 1, "tipoDificultad": "Principiante" },
    { "idDificultad": 2, "tipoDificultad": "Intermedio" },
    { "idDificultad": 3, "tipoDificultad": "Avanzado" }
]
```

---

## POST `/dificultades` — Crear dificultad

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `/dificultades` |
| **Body** | `application/json` |

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `tipoDificultad` | string | SI |

```bash
curl -X POST http://localhost:5000/dificultades \
  -H "Content-Type: application/json" \
  -d '{ "tipoDificultad": "Principiante" }'
```

### `201 Created`
```json
{
    "mensaje": "Dificultad creada exitosamente.",
    "idDificultad": 1,
    "tipoDificultad": "Principiante"
}
```

### `400 Bad Request` — Nombre duplicado
```json
{ "error": "Ya existe una dificultad con el nombre 'Principiante'." }
```

---

## PUT `/dificultades/{id}` — Actualizar dificultad

| Campo | Valor |
|-------|-------|
| **Método** | `PUT` |
| **URL** | `/dificultades/{id}` |
| **Body** | `application/json` |

```bash
curl -X PUT http://localhost:5000/dificultades/1 \
  -H "Content-Type: application/json" \
  -d '{ "tipoDificultad": "Básico" }'
```

### `200 OK`
```json
{
    "mensaje": "Dificultad actualizada exitosamente.",
    "idDificultad": 1,
    "tipoDificultad": "Básico"
}
```

### `404 Not Found`
```json
{ "error": "Dificultad no encontrada." }
```

---

## DELETE `/dificultades/{id}` — Eliminar dificultad

| Campo | Valor |
|-------|-------|
| **Método** | `DELETE` |
| **URL** | `/dificultades/{id}` |

```bash
curl -X DELETE http://localhost:5000/dificultades/1
```

### `200 OK`
```json
{ "mensaje": "Dificultad eliminada exitosamente." }
```

### `400 Bad Request` — En uso por un curso
```json
{ "error": "No se puede eliminar la dificultad porque hay cursos que la están usando." }
```

### `404 Not Found`
```json
{ "error": "Dificultad no encontrada." }
```

## Endpoints — Gestión de Temáticas

Base URL: `http://localhost:5000`

---

## GET `/tematicas` — Listar temáticas

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `/tematicas` |

```bash
curl -X GET http://localhost:5000/tematicas
```

### `200 OK`
```json
[
    { "idTematica": 1, "tipoTematica": "Programación" },
    { "idTematica": 2, "tipoTematica": "Diseño" },
    { "idTematica": 3, "tipoTematica": "Negocios" }
]
```

---

## POST `/tematicas` — Crear temática

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `/tematicas` |
| **Body** | `application/json` |

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `tipoTematica` | string | ✅ |

```bash
curl -X POST http://localhost:5000/tematicas \
  -H "Content-Type: application/json" \
  -d '{ "tipoTematica": "Programación" }'
```

### `201 Created`
```json
{
    "mensaje": "Temática creada exitosamente.",
    "idTematica": 1,
    "tipoTematica": "Programación"
}
```

### `400 Bad Request` — Nombre duplicado
```json
{ "error": "Ya existe una temática con el nombre 'Programación'." }
```

---

## PUT `/tematicas/{id}` — Actualizar temática

| Campo | Valor |
|-------|-------|
| **Método** | `PUT` |
| **URL** | `/tematicas/{id}` |
| **Body** | `application/json` |

```bash
curl -X PUT http://localhost:5000/tematicas/1 \
  -H "Content-Type: application/json" \
  -d '{ "tipoTematica": "Diseño Gráfico" }'
```

### `200 OK`
```json
{
    "mensaje": "Temática actualizada exitosamente.",
    "idTematica": 1,
    "tipoTematica": "Diseño Gráfico"
}
```

### `404 Not Found`
```json
{ "error": "Temática no encontrada." }
```

### `400 Bad Request` — Nombre duplicado
```json
{ "error": "Ya existe una temática con el nombre 'Diseño Gráfico'." }
```

---

## DELETE `/tematicas/{id}` — Eliminar temática

| Campo | Valor |
|-------|-------|
| **Método** | `DELETE` |
| **URL** | `/tematicas/{id}` |

```bash
curl -X DELETE http://localhost:5000/tematicas/1
```

### `200 OK`
```json
{ "mensaje": "Temática eliminada exitosamente." }
```

### `400 Bad Request` — En uso por un curso
```json
{ "error": "No se puede eliminar la temática porque hay cursos que la están usando." }
```

### `404 Not Found`
```json
{ "error": "Temática no encontrada." }
```


---

# Endpoints — Gestión de Tipos de Contenido

Base URL: `http://localhost:5000`

---

## GET `/tipos-contenido` — Listar tipos de contenido

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `/tipos-contenido` |

```bash
curl -X GET http://localhost:5000/tipos-contenido
```

### `200 OK`
```json
[
    { "idTipoContenido": 1, "tipoContenido": "Clase grabada" },
    { "idTipoContenido": 2, "tipoContenido": "Taller en vivo" },
    { "idTipoContenido": 3, "tipoContenido": "Conferencia" }
]
```

---

## POST `/tipos-contenido` — Crear tipo de contenido

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `/tipos-contenido` |
| **Body** | `application/json` |

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `tipoContenido` | string | si |

```bash
curl -X POST http://localhost:5000/tipos-contenido \
  -H "Content-Type: application/json" \
  -d '{ "tipoContenido": "Clase grabada" }'
```

### `201 Created`
```json
{
    "mensaje": "Tipo de contenido creado exitosamente.",
    "idTipoContenido": 1,
    "tipoContenido": "Clase grabada"
}
```

### `400 Bad Request` — Nombre duplicado
```json
{ "error": "Ya existe un tipo de contenido con el nombre 'Clase grabada'." }
```

---

## PUT `/tipos-contenido/{id}` — Actualizar tipo de contenido

| Campo | Valor |
|-------|-------|
| **Método** | `PUT` |
| **URL** | `/tipos-contenido/{id}` |
| **Body** | `application/json` |

```bash
curl -X PUT http://localhost:5000/tipos-contenido/1 \
  -H "Content-Type: application/json" \
  -d '{ "tipoContenido": "Taller en vivo" }'
```

### `200 OK`
```json
{
    "mensaje": "Tipo de contenido actualizado exitosamente.",
    "idTipoContenido": 1,
    "tipoContenido": "Taller en vivo"
}
```

### `404 Not Found`
```json
{ "error": "Tipo de contenido no encontrado." }
```

### `400 Bad Request` — Nombre duplicado
```json
{ "error": "Ya existe un tipo de contenido con el nombre 'Taller en vivo'." }
```

---

## DELETE `/tipos-contenido/{id}` — Eliminar tipo de contenido

| Campo | Valor |
|-------|-------|
| **Método** | `DELETE` |
| **URL** | `/tipos-contenido/{id}` |

```bash
curl -X DELETE http://localhost:5000/tipos-contenido/1
```

### `200 OK`
```json
{ "mensaje": "Tipo de contenido eliminado exitosamente." }
```

### `400 Bad Request` — En uso por un contenido
```json
{ "error": "No se puede eliminar el tipo de contenido porque hay contenidos que lo están usando." }
```

### `404 Not Found`
```json
{ "error": "Tipo de contenido no encontrado." }
```


---


## Endpoints — Gestión de Cursos y Contenido (Administrador)

Base URL: `http://localhost:5000`

---

## POST `/admin/cursos` — Crear curso

Registra un nuevo curso en la plataforma.

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `/admin/cursos` |
| **Body** | `application/json` |

### Campos del body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombreCurso` | string | SI | Nombre del curso |
| `descripcion` | string | SI | Descripción completa |
| `anioProduccion` | int | SI | Año de producción |
| `idDificultad` | int | SI | ID de la dificultad |
| `idPersona` | int | SI | ID del instructor |
| `idTematica` | int | SI | ID de la temática |
| `resumen` | string | NO | Resumen breve |

### Ejemplo de uso

```bash
curl -X POST http://localhost:5000/admin/cursos \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCurso": "Python desde cero",
    "descripcion": "Aprende Python con ejemplos prácticos",
    "resumen": "Curso introductorio",
    "anioProduccion": 2026,
    "idDificultad": 1,
    "idPersona": 1,
    "idTematica": 1
  }'
```

### Respuestas

#### `201 Created` — Curso creado
```json
{
    "mensaje": "Curso creado exitosamente.",
    "idCurso": 1,
    "nombreCurso": "Python desde cero",
    "descripcion": "Aprende Python con ejemplos prácticos",
    "resumen": "Curso introductorio",
    "anioProduccion": 2026,
    "idDificultad": 1,
    "idPersona": 1,
    "idTematica": 1
}
```

#### `400 Bad Request` — Campos faltantes
```json
{ "error": "Campos requeridos faltantes: nombreCurso, idTematica" }
```

#### `400 Bad Request` — FK no existe
```json
{ "error": "La dificultad seleccionada no existe." }
```

---

## POST `/admin/cursos/{id}/contenido` — Agregar contenido a un curso

Agrega un video o archivo a un curso existente. Se puede llamar múltiples veces para agregar más contenido al mismo curso.

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `/admin/cursos/{id}/contenido` |
| **Body** | `application/json` |

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | int | ID del curso |

### Campos del body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `titulo` | string | SI | Título del contenido |
| `pathContenido` | string | SI | URL del video o archivo |
| `descripcion` | string | SI | Descripción del contenido |
| `idTipoContenido` | int | SI | ID del tipo de contenido |

### Ejemplo de uso

```bash
curl -X POST http://localhost:5000/admin/cursos/1/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Introducción a Python",
    "pathContenido": "https://www.youtube.com/watch?v=ejemplo",
    "descripcion": "Primera clase del curso",
    "idTipoContenido": 1
  }'
```

### Respuestas

#### `201 Created` — Contenido agregado
```json
{
    "mensaje": "Contenido agregado exitosamente.",
    "idContenido": 1,
    "titulo": "Introducción a Python",
    "pathContenido": "https://www.youtube.com/watch?v=ejemplo",
    "descripcion": "Primera clase del curso",
    "idCurso": 1,
    "idTipoContenido": 1
}
```

#### `404 Not Found` — Curso no existe
```json
{ "error": "Curso no encontrado." }
```

#### `400 Bad Request` — Campos faltantes
```json
{ "error": "Campos requeridos faltantes: titulo, pathContenido" }
```

#### `500 Internal Server Error`
```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```

--- 

## Endpoints — Ver, Modificar y Eliminar Contenido de Curso

---

## GET `/admin/cursos/{id}/contenido` — Ver contenido de un curso

Lista todo el contenido asociado a un curso.

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `/admin/cursos/{id}/contenido` |

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | int | ID del curso |

```bash
curl -X GET http://localhost:5000/admin/cursos/1/contenido
```

### Respuestas

#### `200 OK`
```json
[
    {
        "idContenido": 1,
        "titulo": "Introducción a Python",
        "pathContenido": "https://www.youtube.com/watch?v=ejemplo",
        "descripcion": "Primera clase del curso",
        "idCurso": 1,
        "idTipoContenido": 1
    },
    {
        "idContenido": 2,
        "titulo": "Variables y tipos de datos",
        "pathContenido": "https://www.youtube.com/watch?v=ejemplo2",
        "descripcion": null,
        "idCurso": 1,
        "idTipoContenido": 1
    }
]
```

#### `404 Not Found` — Curso no existe
```json
{ "error": "Curso no encontrado." }
```

---

## PUT `/admin/cursos/contenido/{id}` — Modificar contenido

Actualiza los campos enviados. Todos son opcionales, solo se modifican los que lleguen en el body.

| Campo | Valor |
|-------|-------|
| **Método** | `PUT` |
| **URL** | `/admin/cursos/contenido/{id}` |
| **Body** | `application/json` |

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | int | ID del contenido |

### Campos del body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `titulo` | string | No | Nuevo título |
| `pathContenido` | string | No | Nueva URL del video o archivo |
| `descripcion` | string | No | Nueva descripción |
| `idTipoContenido` | int | No | Nuevo tipo de contenido |

```bash
curl -X PUT http://localhost:5000/admin/cursos/contenido/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nuevo título",
    "pathContenido": "https://nuevo-link.com/video",
    "descripcion": "Nueva descripción del contenido"
  }'
```

### Respuestas

#### `200 OK`
```json
{
    "mensaje": "Contenido actualizado exitosamente.",
    "idContenido": 1,
    "titulo": "Nuevo título",
    "pathContenido": "https://nuevo-link.com/video",
    "descripcion": "Nueva descripción del contenido",
    "idCurso": 1,
    "idTipoContenido": 1
}
```

#### `404 Not Found` — Contenido no existe
```json
{ "error": "Contenido no encontrado." }
```

---

## DELETE `/admin/cursos/contenido/{id}` — Eliminar contenido

Elimina un contenido específico del curso.

| Campo | Valor |
|-------|-------|
| **Método** | `DELETE` |
| **URL** | `/admin/cursos/contenido/{id}` |

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | int | ID del contenido |

```bash
curl -X DELETE http://localhost:5000/admin/cursos/contenido/1
```

### Respuestas

#### `200 OK`
```json
{ "mensaje": "Contenido eliminado exitosamente." }
```

#### `404 Not Found` — Contenido no existe
```json
{ "error": "Contenido no encontrado." }
```

#### `500 Internal Server Error`
```json
{
    "error": "Error interno del servidor.",
    "detalle": "..."
}
```
