# RRHH

## Descripcion del Proyecto

Este proyecto consiste en el desarrollo de una aplicacion web de tipo SPA (Single Page Application) orientada a la gestion de Recursos Humanos de una empresa. La aplicacion permitira administrar empleados, controlar asistencia y generar reportes, brindando una experiencia de usuario moderna, rapida y eficiente.

El sistema esta disenado bajo una arquitectura cliente-servidor, donde el frontend desarrollado en Vue.js 3 se comunica con una API REST construida en Node.js con Express. La persistencia de datos se maneja mediante MySQL como motor de base de datos relacional y Sequelize como ORM, lo que garantiza integridad referencial y consultas eficientes sobre los datos del personal.

La aplicacion contempla dos tipos de usuarios: el administrador, que tiene acceso completo para registrar empleados, gestionar departamentos, cargos y registrar asistencia; y el empleado, que puede consultar su propia informacion y su historial de asistencia mensual. La autenticacion se implementa mediante JWT (JSON Web Tokens), asegurando que cada sesion sea segura y con permisos diferenciados segun el rol.

El proyecto se organiza en torno a dos epicas principales: la Gestion de Empleados, que cubre el registro, busqueda y filtrado del personal por nombre o departamento; y el Control de Asistencia, que permite registrar y monitorear las entradas, salidas y ausencias del personal de forma dia