/proyecto-automatizacion-kdt-framework/
│
├── tests/               # Aquí van los archivos JSON con escenarios de prueba
│   └── ejemplo.json
│
├── src/
│   ├── runner.ts        # Ejecuta los tests
│   ├── keywords.ts      # Implementación keywords
│   ├── parser.ts        # Parser y validador JSON
│   └── types.ts         # Tipos TS
│
├── package.json
└── tsconfig.json
└── README.md

Archivo JSON (escenario) 
        ↓
Gestor de Casos → Envía texto natural y keywords a los interpretadores NLP y Keyword
        ↓
Interpretador NLP / Interpretador Keywords
        ↓
Lista de pasos estructurados (acción, parámetro, validación)
        ↓
Ejecutor de pasos (Playwright, HTTP)
        ↓
Reportero
        ↓
Generador de Código TypeScript