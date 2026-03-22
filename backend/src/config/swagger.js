import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RRHH',
      version: '1.0.0',
      description:
        'Documentacion de la API de RRHH con autenticacion JWT en cookie HTTP-only y control de roles.'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor local'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Autenticacion y sesion de usuarios' },
      { name: 'Categories', description: 'Gestion de categorias' },
      { name: 'Products', description: 'Gestion de productos' },
      { name: 'Attendance', description: 'Control de asistencia' },
      { name: 'Reports', description: 'Reportes administrativos' }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT enviado mediante cookie HTTP-only llamada token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '65f0a1b2c3d4e5f678901234' },
            name: { type: 'string', example: 'Juan Perez' },
            email: { type: 'string', format: 'email', example: 'juan@empresa.com' },
            role: { type: 'string', enum: ['admin', 'employee'], example: 'employee' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Department: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f0a1b2c3d4e5f678901235' },
            name: { type: 'string', example: 'Recursos Humanos' },
            description: { type: 'string', example: 'Gestion del talento humano' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Position: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f0a1b2c3d4e5f678901236' },
            title: { type: 'string', example: 'Analista de Nomina' },
            department: { type: 'string', example: '65f0a1b2c3d4e5f678901235' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f0a1b2c3d4e5f678901237' },
            userId: { type: 'string', example: '65f0a1b2c3d4e5f678901234' },
            position: { type: 'string', example: '65f0a1b2c3d4e5f678901236' },
            department: { type: 'string', example: '65f0a1b2c3d4e5f678901235' },
            hireDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f0a1b2c3d4e5f678901238' },
            employeeId: { type: 'string', example: '65f0a1b2c3d4e5f678901237' },
            date: { type: 'string', format: 'date-time' },
            checkIn: { type: 'string', format: 'date-time', nullable: true },
            checkOut: { type: 'string', format: 'date-time', nullable: true },
            status: {
              type: 'string',
              enum: ['present', 'absent', 'late'],
              example: 'present'
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f0a1b2c3d4e5f678901239' },
            name: { type: 'string', example: 'Administracion' },
            description: { type: 'string', example: 'Area administrativa' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f0a1b2c3d4e5f678901240' },
            name: { type: 'string', example: 'Laptop corporativa' },
            description: { type: 'string', example: 'Equipo de trabajo para empleado' },
            price: { type: 'number', example: 3500 },
            categoryId: {
              oneOf: [
                { type: 'string', example: '65f0a1b2c3d4e5f678901239' },
                {
                  type: 'object',
                  properties: {
                    _id: { type: 'string', example: '65f0a1b2c3d4e5f678901239' },
                    name: { type: 'string', example: 'Administracion' },
                    description: { type: 'string', example: 'Area administrativa' }
                  }
                }
              ]
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Juan Perez' },
            email: { type: 'string', format: 'email', example: 'juan@empresa.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'Secreto123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'juan@empresa.com' },
            password: { type: 'string', format: 'password', example: 'Secreto123' }
          }
        },
        CategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Talento Humano' },
            description: { type: 'string', example: 'Procesos de RRHH' }
          }
        },
        ProductRequest: {
          type: 'object',
          required: ['name', 'price', 'categoryId'],
          properties: {
            name: { type: 'string', example: 'Tarjeta de acceso' },
            description: { type: 'string', example: 'Credencial para ingreso' },
            price: { type: 'number', minimum: 0, example: 25 },
            categoryId: { type: 'string', example: '65f0a1b2c3d4e5f678901239' }
          }
        },
        CheckInRequest: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-22T00:00:00.000Z'
            },
            checkIn: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-22T08:05:00.000Z'
            },
            status: { type: 'string', enum: ['present', 'late'], example: 'present' }
          }
        },
        CheckOutRequest: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-22T00:00:00.000Z'
            },
            checkOut: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-22T17:30:00.000Z'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operacion realizada correctamente' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Ocurrio un error' },
            error: { type: 'string', example: 'Detalle tecnico del error' }
          }
        }
      },
      responses: {
        Ok: {
          description: 'Operacion exitosa (200)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' }
            }
          }
        },
        Created: {
          description: 'Recurso creado correctamente (201)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' }
            }
          }
        },
        BadRequest: {
          description: 'Solicitud invalida (400)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        Unauthorized: {
          description: 'No autenticado o token invalido (401)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        Forbidden: {
          description: 'No autorizado por rol (403)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado (404)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor (500)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;