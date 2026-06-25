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
