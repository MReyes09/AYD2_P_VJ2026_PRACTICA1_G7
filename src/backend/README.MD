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
