# Core del Negocio — Caso de Uso de Alto Nivel

![Core Diagram](./imgs/Core-del-Negocio.png)

## Descripcion del Core
La plataforma es un sistema de aprendizaje en línea donde los participantes acceden a recursos educativos digitales mediante una membresía activa. Los usuarios pueden registrarse, contratar un plan y consumir contenido como cursos, talleres, videos, materiales descargables y laboratorios prácticos, mientras el sistema registra su actividad y progreso para ofrecer recomendaciones personalizadas.

El Administrador de TI se encarga de gestionar el catálogo de contenidos, organizándolos por tipo, área de conocimiento y nivel de experiencia, además de supervisar el uso de la plataforma mediante indicadores y estadísticas que apoyan la toma de decisiones.

# Primera Descomposición del Core

Diagrama de la primera descomposición del negocio de alto nivel.


![Descomposicion Diagram](./imgs/Primera-Descomposicion.png)

## CU1 - Gestion de Usuarios

![CU1](./imgs/CU1%20-%20Gestion%20de%20Usuarios.png)

## CU2 - Gestion de Contenido

![CU2](./imgs/CU2%20-%20Gestion%20de%20Contenido.png)

## CU3 - Control de Suscripciones

![CU3](./imgs/CU3%20-%20Control%20de%20Suscripciones.png)

## CU4 - Monitoreo de Metricas

![CU4](./imgs/CU4%20-%20Monitoreo%20de%20Metricas.png)

Te dejo todo en formato listo para copiar y pegar en tu DDA. Ajusta la numeración de escenarios según lo que ya tengas.

***

## Drivers Funcionales

### CU1-1 Registro de Estudiante

| No. RF | Descripción                                                                                                                                                                                                 | Actores Involucrados |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-001 | El sistema debe permitir el registro de un estudiante capturando nombre completo, fecha de nacimiento, correo electrónico único, contraseña, NIT, número de tarjeta con fecha de vencimiento y fotografía. | Estudiante           |
| RF-002 | El sistema debe validar que el correo electrónico ingresado sea único en la plataforma y cumpla con el formato de correo válido.                                                                  | Estudiante           |
| RF-003 | El sistema debe almacenar la contraseña del estudiante aplicando un mecanismo de cifrado o hash seguro.                                                                                           | Estudiante           |

### CU1-2 Actualización de Datos del Estudiante

| No. RF | Descripción                                                                                                                                                                      | Actores Involucrados |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-004 | El sistema debe permitir que el estudiante modifique sus datos personales a través de un panel de configuración.                                                       | Estudiante           |
| RF-005 | El sistema debe permitir que el estudiante actualice sus métodos de pago asociados a su suscripción.                                                                    | Estudiante           |
| RF-006 | El sistema debe validar los datos modificados antes de almacenarlos, mostrando mensajes de error claros cuando la información sea inválida o incompleta.              | Estudiante           |

### CU2-1 Gestión de Suscripciones

| No. RF | Descripción                                                                                                                                                                                        | Actores Involucrados |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-007 | El sistema debe permitir que el estudiante contrate un plan de suscripción en modalidad Mensual, Trimestral o Anual.                                                                    | Estudiante           |
| RF-008 | El sistema debe asociar la suscripción activa del estudiante con su método de pago registrado.                                                                                           | Estudiante           |
| RF-009 | El sistema debe mostrar al estudiante la información de su plan actual, incluyendo tipo de plan, fecha de inicio, fecha de vencimiento y estado de la suscripción.                      | Estudiante           |

### CU2-2 Renovación y Cancelación de Suscripción

| No. RF | Descripción                                                                                                                                                                                         | Actores Involucrados |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-010 | El sistema debe permitir que el estudiante renueve su suscripción de forma manual antes de la fecha de vencimiento.                                                                       | Estudiante           |
| RF-011 | El sistema debe permitir que el estudiante aplique la cancelación de su membresía en cualquier momento, actualizando el estado de la suscripción.                                         | Estudiante           |

### CU3-1 Reproducción de Contenido

| No. RF | Descripción                                                                                                                                                                                                 | Actores Involucrados |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-012 | El sistema debe integrar un reproductor multimedia nativo o embebido que permita la visualización fluida del contenido audiovisual educativo.                                                     | Estudiante           |
| RF-013 | El reproductor debe ofrecer controles básicos como reproducir, pausar, avanzar y retroceder el contenido.                                                                                         | Estudiante           |

### CU3-2 Bitácora y Recomendaciones

| No. RF | Descripción                                                                                                                                                                                                                             | Actores Involucrados |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-014 | El sistema debe registrar un historial detallado de consumo por cada estudiante, incluyendo al menos el curso visualizado y la fecha de reproducción.                                                                          | Estudiante           |
| RF-015 | El sistema debe utilizar la bitácora de visualización como fuente para generar recomendaciones personalizadas de contenido.                                                                                                     | Estudiante           |

### CU3-3 Página de Inicio del Estudiante

| No. RF | Descripción                                                                                                                                                                                                                                        | Actores Involucrados |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| RF-016 | Al iniciar sesión con una membresía activa, el sistema debe mostrar en la página de inicio recomendaciones personalizadas basadas en la categoría temática de mayor interés del estudiante.                                              | Estudiante           |
| RF-017 | El sistema debe mostrar en la página de inicio un ranking de los 10 cursos con mayor tráfico en la plataforma.                                                                                    | Estudiante           |

### CU4-1 Gestión de Contenido

| No. RF | Descripción                                                                                                                                                                                                                  | Actores Involucrados   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| RF-018 | El sistema debe permitir al administrador gestionar los tipos de contenido (por ejemplo, Clase grabada, Taller en vivo, Conferencia).                                        | Administrador de contenido |
| RF-019 | El sistema debe permitir al administrador gestionar las categorías temáticas (por ejemplo, Programación, Diseño, Negocios).                                                 | Administrador de contenido |
| RF-020 | El sistema debe permitir al administrador gestionar los niveles de dificultad (Principiante, Intermedio, Avanzado).                                                          | Administrador de contenido |
| RF-021 | El sistema debe permitir el registro y edición de cursos, incluyendo título, año de producción, instructor, resumen breve y descripción completa.                             | Administrador de contenido |

### CU4-2 Dashboard de Contenido

| No. RF | Descripción                                                                                                                                                                                                                                           | Actores Involucrados   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| RF-022 | El sistema debe permitir al administrador buscar cursos por título y aplicar filtros por tipo, categoría, nivel de dificultad o año de lanzamiento desde un panel de control.                                                                | Administrador de contenido |
| RF-023 | El sistema debe renderizar una gráfica con el Top 3 de categorías con mayor cantidad de reproducciones.                                                                                                                                    | Administrador de contenido |
| RF-024 | El sistema debe renderizar una gráfica con el Top 3 de niveles de dificultad más cursados.                                                                                                                                                  | Administrador de contenido |
| RF-025 | El sistema debe renderizar una gráfica con el Top 10 de cursos más visualizados globalmente.                                                                                                                                                | Administrador de contenido |
| RF-026 | El sistema debe renderizar una gráfica con la distribución cuantitativa de estudiantes según su tipo de suscripción.                                                                                                                        | Administrador de contenido |

### CU5-1 Autenticación en la Plataforma

| No. RF | Descripción                                                                                                                                                         | Actores Involucrados              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| RF-027 | El sistema debe permitir el inicio de sesión de estudiantes y administradores mediante correo electrónico y contraseña.                                    | Estudiante, Administrador         |
| RF-028 | El sistema debe validar las credenciales ingresadas y denegar el acceso cuando sean incorrectas, mostrando un mensaje de error adecuado.                  | Estudiante, Administrador         |

***

## Escenarios de Atributos de Calidad (EaC)

### Escenario No. 1 – Usabilidad (Capacidad de aprendizaje)

Contexto: Se busca que el usuario requiera el menor tiempo posible para aprender a usar los formularios del sistema.

Afecta: Usuario \| Capacidad de aprendizaje

| Validación del Escenario | Descripción                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Origen del estímulo      | Usuario                                                                                                                                                               |
| Estímulo                 | Colocar el cursor en un campo de entrada de un formulario (input text).                                                                                               |
| Entorno                  | Condiciones normales de operación.                                                                                                                                    |
| Artefacto                | Capa de presentación (formularios web).                                                                                                                               |
| Respuesta                | Mostrar de inmediato una breve descripción del dato que debe ingresarse en el campo (placeholder, tooltip o texto de ayuda).                                         |
| Medida de la respuesta   | La descripción debe aparecer de forma inmediata, idealmente en menos de 0.5 segundos desde que el campo recibe el foco.                                             |

***

### Escenario No. 2 – Rendimiento (Reproducción de video)

Contexto: El estudiante inicia la reproducción de un curso en video mientras hay otros usuarios conectados.

Afecta: Estudiante \| Experiencia de reproducción

| Validación del Escenario | Descripción                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Origen del estímulo      | Estudiante                                                                                                                                                        |
| Estímulo                 | Solicitar la reproducción de un curso en video desde la página de contenido.                                                                                       |
| Entorno                  | Carga normal del sistema, con varios estudiantes consumiendo contenido simultáneamente.                                                                            |
| Artefacto                | Módulo de reproducción de contenido y servidor de video.                                                                                                           |
| Respuesta                | El video inicia la reproducción y se mantiene fluido, sin pausas prolongadas ni cortes perceptibles para el usuario.                                              |
| Medida de la respuesta   | Tiempo de inicio de reproducción menor a 3 segundos y porcentaje de tiempo de rebuffering menor al 5% del tiempo total de reproducción del video.               |

***

### Escenario No. 3 – Rendimiento (Carga de dashboard)

Contexto: El administrador consulta las métricas de uso de la plataforma en el dashboard.

Afecta: Administrador de contenido \| Productividad

| Validación del Escenario | Descripción                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Origen del estímulo      | Administrador de contenido                                                                                                                      |
| Estímulo                 | Abrir la vista de dashboard con filtros y gráficas de contenido.                                                                                |
| Entorno                  | Carga normal, con una base de datos de tamaño medio y actividad de estudiantes en curso.                                                       |
| Artefacto                | Backend de reportes, consultas analíticas y capa de presentación del dashboard.                                                                |
| Respuesta                | El dashboard muestra todas las métricas y gráficas solicitadas sin que el administrador perciba lentitud excesiva.                             |
| Medida de la respuesta   | Tiempo de carga completo de la vista de dashboard menor o igual a 2 segundos.                                                                  |

***

### Escenario No. 4 – Seguridad (Autenticación y credenciales)

Contexto: Cualquier usuario intenta iniciar sesión en la plataforma desde internet público.

Afecta: Estudiante, Administrador \| Confidencialidad

| Validación del Escenario | Descripción                                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Origen del estímulo      | Usuario (Estudiante o Administrador)                                                                                                                       |
| Estímulo                 | Enviar el formulario de inicio de sesión con correo electrónico y contraseña.                                                                              |
| Entorno                  | Acceso remoto a través de internet público.                                                                                                               |
| Artefacto                | Módulo de autenticación, servidor de aplicación y almacenamiento de credenciales.                                                                         |
| Respuesta                | Las credenciales se transportan de forma segura y las contraseñas nunca se almacenan en texto plano.                                                      |
| Medida de la respuesta   | Todas las peticiones usan HTTPS y las contraseñas se almacenan aplicando algoritmos de hash seguros con sal; no existe almacenamiento de contraseñas en claro. |

***

### Escenario No. 5 – Seguridad (Datos de tarjeta)

Contexto: El estudiante registra o actualiza los datos de su tarjeta para pagar la suscripción.

Afecta: Estudiante \| Protección de datos sensibles

| Validación del Escenario | Descripción                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Origen del estímulo      | Estudiante                                                                                                                                                             |
| Estímulo                 | Enviar el formulario de registro o actualización de método de pago con los datos de la tarjeta.                                                              |
| Entorno                  | Operación normal durante el proceso de suscripción o actualización de datos.                                                                                |
| Artefacto                | Módulo de pagos, backend y base de datos.                                                                                                                             |
| Respuesta                | Los datos sensibles de la tarjeta se protegen, se enmascara la visualización y se limita el acceso a componentes autorizados.                                         |
| Medida de la respuesta   | Número de tarjeta almacenado cifrado o tokenizado; visualización parcial en la interfaz (solo últimos dígitos) y controles de acceso que impiden consultas no autorizadas. |

***

### Escenario No. 6 – Escalabilidad (Crecimiento de usuarios)

Contexto: La cantidad de estudiantes activos crece significativamente en la plataforma.

Afecta: Plataforma \| Capacidad de respuesta

| Validación del Escenario | Descripción                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Origen del estímulo      | Aumento del número de estudiantes concurrentes.                                                                                                                                            |
| Estímulo                 | Duplicación del número de estudiantes consumiendo contenido y navegando la plataforma de forma simultánea.                                                                                |
| Entorno                  | Operación normal, con una infraestructura dimensionada para crecimiento.                                                                                                                  |
| Artefacto                | Servidor de aplicación, base de datos y servicios de contenido multimedia.                                                                                                                |
| Respuesta                | La plataforma mantiene tiempos de respuesta aceptables para navegación, autenticación y reproducción de contenido.                                                                        |
| Medida de la respuesta   | El tiempo de respuesta de páginas críticas (inicio de sesión, inicio del estudiante, reproducción de contenido) no aumenta más del 50% respecto a la carga base definida.               |

***

### Escenario No. 7 – Mantenibilidad (Nuevos tipos de contenido)

Contexto: El negocio necesita incorporar un nuevo tipo de contenido en el catálogo.

Afecta: Administrador de contenido \| Facilidad de cambio

| Validación del Escenario | Descripción                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Origen del estímulo      | Requerimiento del negocio para agregar un nuevo tipo de contenido.                                                                                       |
| Estímulo                 | Solicitud de configuración de un nuevo tipo de contenido (por ejemplo, “Bootcamp”) desde el módulo de administración.                                             |
| Entorno                  | Sistema en producción, con ventana de mantenimiento controlada.                                                                                                   |
| Artefacto                | Modelo de dominio de contenido, módulo de administración y capa de persistencia.                                                                                  |
| Respuesta                | El nuevo tipo de contenido se agrega sin modificaciones masivas al código y queda disponible para asociarse a nuevos cursos.                                     |
| Medida de la respuesta   | El cambio se limita a la configuración y a un número reducido de componentes (no más de 3 clases o módulos principales) y se despliega en una única iteración.   |

## Justificación Arquitectónica

### Framework: React

React fue seleccionado como framework principal del frontend debido a las características que lo alinean directamente con los requerimientos funcionales y de calidad de la plataforma PRCCD.

**Componentización y reutilización:** React organiza la interfaz en componentes independientes y reutilizables, lo cual resulta esencial en una plataforma con múltiples roles (candidato, verificador, administrador) que comparten elementos visuales comunes como tablas, modales y formularios. Esto reduce la duplicación de código y facilita el mantenimiento.

**Gestión reactiva del estado:** Mediante hooks como `useState` y `useEffect`, React permite reflejar cambios de estado en la interfaz de forma eficiente y predecible, lo cual es crítico en flujos dinámicos como la evaluación activa, la revisión de evidencias y el seguimiento de certificaciones.

**Ecosistema y compatibilidad:** React cuenta con un ecosistema maduro que incluye herramientas como Vite (bundler), React Router (navegación SPA) y librerías de componentes UI. Su amplia adopción garantiza soporte a largo plazo y disponibilidad de recursos para el equipo de desarrollo.

**Integración con servicios AWS:** React se integra sin fricciones con los servicios de infraestructura utilizados en el proyecto, en particular con S3 y CloudFront para el despliegue de la aplicación estática, y con la API REST del backend Flask mediante llamadas HTTP estándar.

---

### Patrón de Diseño: MVC (Model-View-Controller)

El patrón Modelo-Vista-Controlador fue adoptado para estructurar la comunicación entre el frontend y el backend, estableciendo una separación clara de responsabilidades que favorece la escalabilidad y la mantenibilidad del sistema.

**Modelo (Model):** Representa los datos y la lógica de negocio de la aplicación. En el contexto del proyecto, el modelo está conformado por las entidades gestionadas en el backend: usuarios, sesiones de evaluación, solicitudes de certificado, preguntas y respuestas, entre otras. Estas entidades son definidas mediante SQLAlchemy y se persisten en Aurora MySQL.

**Vista (View):** Corresponde a la capa de presentación, implementada íntegramente en React. Cada componente JSX es responsable únicamente de renderizar información y capturar eventos del usuario, sin contener lógica de negocio. Esto mantiene las vistas ligeras, predecibles y fáciles de probar de forma aislada.

**Controlador (Controller):** Actúa como intermediario entre la vista y el modelo. En la arquitectura del proyecto, los controladores son los endpoints de la API REST desarrollados en Flask, que reciben las solicitudes HTTP del frontend, aplican la lógica de negocio correspondiente e invocan las operaciones necesarias sobre el modelo de datos antes de devolver una respuesta estructurada.

Esta separación permite que el frontend y el backend evolucionen de forma independiente, facilita la escritura de pruebas unitarias por capa y establece contratos claros a través de la API que simplifican la integración entre los distintos módulos del sistema.

### Diagrama UML del MVC

![Modelo-MVC](../Documentacion/imgs/Modelo%20Vista%20Controlador.png)