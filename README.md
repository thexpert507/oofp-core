# @oofp/core

Una librería de programación funcional para TypeScript que proporciona tipos de datos algebraicos y utilidades para escribir código funcional de manera elegante y type-safe.

## 🚀 Instalación

```bash
npm install @oofp/core
```

## 📖 Características principales

- **Tipos de datos algebraicos**: `Maybe`, `Either`, `Task`, `TaskEither`, `Reader`, `State`
- **Composición de funciones**: `pipe`, `flow`, `compose`
- **Transformadores de mónadas**: `MaybeT` (Maybe Transformer)
- **Utilidades funcionales**: `curry`, `memo`, manejo de listas
- **Type-safety**: Completamente tipado con TypeScript
- **Tree-shaking**: Importaciones modulares para optimizar el bundle

## 🔧 Uso básico

### Maybe - Manejo seguro de valores opcionales

El tipo `Maybe` representa valores que pueden existir o no, eliminando la necesidad de manejar `null` y `undefined` explícitamente.

```typescript
import * as M from '@oofp/core/maybe';
import { pipe } from '@oofp/core/pipe';

// Crear valores Maybe
const value = M.just(42);          // Maybe<number>
const empty = M.nothing<number>(); // Maybe<number>

// Trabajar con valores seguros
const result = pipe(
  M.just(10),
  M.map(x => x * 2),
  M.chain(x => x > 15 ? M.just(x) : M.nothing()),
  M.fold(() => 0, x => x)
); // 20

// Manejar valores nullable
const user = { name: "Juan", age: null };
const userAge = pipe(
  M.fromNullable(user.age),
  M.map(age => `Tiene ${age} años`),
  M.fold(() => "Edad no especificada", x => x)
);
```

### Either - Manejo de errores funcional

`Either` representa computaciones que pueden fallar, proporcionando una alternativa funcional al manejo tradicional de excepciones.

```typescript
import * as E from '@oofp/core/either';
import { pipe } from '@oofp/core/pipe';

// Funciones que pueden fallar
const divide = (a: number, b: number): E.Either<string, number> =>
  b === 0 ? E.left("División por cero") : E.right(a / b);

const parseNumber = (str: string): E.Either<string, number> => {
  const num = parseFloat(str);
  return isNaN(num) ? E.left("No es un número válido") : E.right(num);
};

// Componer operaciones que pueden fallar
const calculate = (x: string, y: string) => pipe(
  parseNumber(x),
  E.chain(a => pipe(
    parseNumber(y),
    E.chain(b => divide(a, b))
  ))
);

const result = calculate("10", "2"); // Right(5)
const error = calculate("10", "0");  // Left("División por cero")
```

### Pipe - Composición de datos

`pipe` permite encadenar transformaciones de datos de manera legible.

```typescript
import { pipe } from '@oofp/core/pipe';

const result = pipe(
  "  hello world  ",
  str => str.trim(),
  str => str.toUpperCase(),
  str => str.split(" "),
  arr => arr.join("-")
); // "HELLO-WORLD"
```

### Flow - Composición de funciones

`flow` combina múltiples funciones en una sola función compuesta.

```typescript
import { flow } from '@oofp/core/flow';

const processString = flow(
  (str: string) => str.trim(),
  str => str.toUpperCase(),
  str => str.split(" "),
  arr => arr.join("-")
);

const result = processString("  hello world  "); // "HELLO-WORLD"
```

### Task - Computaciones asíncronas

`Task` representa computaciones asíncronas lazy (que no se ejecutan hasta que se invocan).

```typescript
import * as T from '@oofp/core/task';
import { pipe } from '@oofp/core/pipe';

// Crear una tarea
const fetchUser = (id: number): T.Task<User> => () =>
  fetch(`/api/users/${id}`).then(res => res.json());

// Componer tareas
const processUser = pipe(
  fetchUser(1),
  T.map(user => ({ ...user, name: user.name.toUpperCase() })),
  T.chain(user => T.of({ ...user, processed: true }))
);

// Ejecutar la tarea
T.run(processUser).then(console.log);
```

### TaskEither - Tareas que pueden fallar

`TaskEither` combina `Task` y `Either` para manejar operaciones asíncronas que pueden fallar.

```typescript
import * as TE from '@oofp/core/task-either';
import { pipe } from '@oofp/core/pipe';

const fetchUserSafe = (id: number): TE.TaskEither<string, User> => () =>
  fetch(`/api/users/${id}`)
    .then(res => res.ok ? res.json() : Promise.reject('Error de red'))
    .then(TE.right)
    .catch(error => TE.left(error));

// Manejar errores de manera funcional
const processUser = pipe(
  fetchUserSafe(1),
  TE.map(user => user.name.toUpperCase()),
  TE.mapLeft(error => `Error al procesar usuario: ${error}`)
);
```

### Reader - Inyección de dependencias

`Reader` permite inyección de dependencias de manera funcional.

```typescript
import * as R from '@oofp/core/reader';
import { pipe } from '@oofp/core/pipe';

interface Config {
  apiUrl: string;
  timeout: number;
}

const getApiUrl: R.Reader<Config, string> = (config) => config.apiUrl;

const fetchData = (endpoint: string): R.Reader<Config, Promise<any>> =>
  pipe(
    getApiUrl,
    R.map(url => fetch(`${url}/${endpoint}`))
  );

// Usar con configuración
const config: Config = { apiUrl: "https://api.example.com", timeout: 5000 };
const getData = R.run(config)(fetchData("users"));
```

### ReaderTaskEither - Inyección de dependencias + Asíncrono + Manejo de errores

`ReaderTaskEither` combina los tres conceptos más importantes de la programación funcional: inyección de dependencias (`Reader`), computaciones asíncronas (`Task`) y manejo de errores (`Either`). Es ideal para aplicaciones reales.

```typescript
import * as RTE from '@oofp/core/reader-task-either';
import * as E from '@oofp/core/either';
import { pipe } from '@oofp/core/pipe';

interface AppContext {
  db: Database;
  logger: Logger;
  config: AppConfig;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Operaciones que necesitan contexto, son asíncronas y pueden fallar
const findUser = (id: number): RTE.ReaderTaskEither<AppContext, string, User> =>
  ({ db, logger }) => async () => {
    try {
      logger.info(`Buscando usuario ${id}`);
      const user = await db.users.findById(id);
      return user ? E.right(user) : E.left('Usuario no encontrado');
    } catch (error) {
      return E.left(`Error de base de datos: ${error.message}`);
    }
  };

const updateUser = (id: number, data: Partial<User>): RTE.ReaderTaskEither<AppContext, string, User> =>
  ({ db, logger }) => async () => {
    try {
      logger.info(`Actualizando usuario ${id}`);
      const updated = await db.users.update(id, data);
      return E.right(updated);
    } catch (error) {
      return E.left(`Error al actualizar: ${error.message}`);
    }
  };

// Componer operaciones complejas
const promoteUser = (id: number) => pipe(
  findUser(id),
  RTE.chain(user => 
    updateUser(id, { ...user, role: 'admin' })
  ),
  RTE.map(user => ({ ...user, promoted: true }))
);

// Usar con contexto
const context: AppContext = {
  db: new Database(),
  logger: new Logger(),
  config: new AppConfig()
};

// Ejecutar la operación
RTE.run(context)(promoteUser(123))
  .then(result => {
    if (E.isRight(result)) {
      console.log('Usuario promovido:', result.right);
    } else {
      console.error('Error:', result.left);
    }
  });
```

#### Operaciones avanzadas con ReaderTaskEither

```typescript
// Secuenciar múltiples operaciones
const processMultipleUsers = (ids: number[]) => pipe(
  ids.map(findUser),
  RTE.sequence
);

// Inyección parcial de dependencias
const withDatabase = RTE.provide({ db: new Database() });

const userOperation = pipe(
  findUser(1),
  withDatabase
); // Ahora solo necesita { logger, config }

// Manejo de contextos combinados
const enrichUser = (id: number) => pipe(
  findUser(id),
  RTE.chainwc(user => 
    // Esta operación necesita un contexto diferente
    fetchUserPermissions(user.id) // ReaderTaskEither<PermissionContext, string, Permission[]>
  )
);

// Operaciones en paralelo con límite de concurrencia
const processUsersInBatches = (ids: number[]) => pipe(
  ids.map(findUser),
  RTE.concurrency({ concurrency: 3 })
);
```

### Curry - Funciones currificadas

```typescript
import { curry } from '@oofp/core/curry';

const add = curry((a: number, b: number, c: number) => a + b + c);

const add5 = add(5);
const add5And3 = add5(3);
const result = add5And3(2); // 10

// También se puede usar directamente
const result2 = add(1)(2)(3); // 6
```

### Utilidades para listas

```typescript
import * as L from '@oofp/core/list';
import { pipe } from '@oofp/core/pipe';

const numbers = [1, 2, 3, 4, 5];

const result = pipe(
  numbers,
  L.filter(x => x % 2 === 0),
  L.map(x => x * 2),
  L.reduce(0, (acc, x) => acc + x)
); // 12
```

## 🔄 Transformadores de mónadas

### MaybeT - Maybe Transformer

Permite componer `Maybe` con otras mónadas.

```typescript
import { maybeT } from '@oofp/core/maybe-t';
import * as T from '@oofp/core/task';

const TaskMaybe = maybeT(T);

const fetchUserMaybe = (id: number) => TaskMaybe.lift(
  T.of(id > 0 ? { id, name: "Usuario" } : null)
);

const result = TaskMaybe.map((user: any) => user.name.toUpperCase())(
  fetchUserMaybe(1)
);
```

## 🛠 Utilidades avanzadas

### Concurrencia

```typescript
import * as TE from '@oofp/core/task-either';

const tasks = [
  TE.of(1),
  TE.of(2),
  TE.of(3)
];

// Ejecutar en paralelo con límite de concurrencia
TE.concurrency({ concurrency: 2 })(tasks)
  .then(console.log); // [1, 2, 3]
```

### Secuencias

```typescript
import * as M from '@oofp/core/maybe';

// Secuenciar un array de Maybe
const maybes = [M.just(1), M.just(2), M.just(3)];
const result = M.sequence(maybes); // Maybe<number[]>

// Secuenciar un objeto de Maybe
const maybeObj = {
  a: M.just(1),
  b: M.just(2),
  c: M.nothing()
};
const resultObj = M.sequenceObject(maybeObj); // Maybe<{a: number, b: number, c: number}>
```

## 📦 Exports disponibles

La librería está dividida en módulos que puedes importar individualmente:

```typescript
// Tipos de datos principales
import * as Maybe from '@oofp/core/maybe';
import * as Either from '@oofp/core/either';
import * as Task from '@oofp/core/task';
import * as TaskEither from '@oofp/core/task-either';
import * as Reader from '@oofp/core/reader';
import * as ReaderTaskEither from '@oofp/core/reader-task-either';
import * as State from '@oofp/core/state';

// Utilidades de composición
import { pipe } from '@oofp/core/pipe';
import { flow } from '@oofp/core/flow';
import { compose } from '@oofp/core/compose';

// Utilidades funcionales
import { curry } from '@oofp/core/curry';
import * as List from '@oofp/core/list';
import { memo } from '@oofp/core/memo';

// Transformadores
import { maybeT } from '@oofp/core/maybe-t';

// Utilidades generales
import * as Utils from '@oofp/core/utils';
```

## 🎯 Casos de uso comunes

### Validación de formularios

```typescript
import * as E from '@oofp/core/either';
import { pipe } from '@oofp/core/pipe';

const validateEmail = (email: string): E.Either<string, string> =>
  email.includes('@') ? E.right(email) : E.left('Email inválido');

const validateAge = (age: number): E.Either<string, number> =>
  age >= 18 ? E.right(age) : E.left('Debe ser mayor de edad');

const validateUser = (email: string, age: number) => pipe(
  validateEmail(email),
  E.chain(() => validateAge(age)),
  E.map(() => ({ email, age, valid: true }))
);
```

### Pipeline de datos

```typescript
import { pipe } from '@oofp/core/pipe';
import * as L from '@oofp/core/list';

const processUsers = (users: User[]) => pipe(
  users,
  L.filter(user => user.active),
  L.map(user => ({ ...user, name: user.name.toUpperCase() })),
  L.groupBy(user => user.department),
  L.map(group => ({ ...group, count: group.length }))
);
```

### Aplicación completa con ReaderTaskEither

```typescript
import * as RTE from '@oofp/core/reader-task-either';
import * as E from '@oofp/core/either';
import { pipe } from '@oofp/core/pipe';

// Contexto de la aplicación
interface AppContext {
  database: Database;
  emailService: EmailService;
  logger: Logger;
}

// Operaciones de negocio completas
const registerUser = (userData: UserInput) => pipe(
  validateUser(userData),
  RTE.chain(data => createUser(data)),
  RTE.chain(user => sendWelcomeEmail(user.email)),
  RTE.tapRTE(user => logUserCreation(user.id)),
  RTE.mapLeft(error => `Registration failed: ${error}`)
);

const validateUser = (data: UserInput): RTE.ReaderTaskEither<AppContext, string, ValidUser> =>
  RTE.of(data); // Aquí iría la lógica de validación

const createUser = (data: ValidUser): RTE.ReaderTaskEither<AppContext, string, User> =>
  ({ database }) => () => database.createUser(data);

const sendWelcomeEmail = (email: string): RTE.ReaderTaskEither<AppContext, string, void> =>
  ({ emailService }) => () => emailService.sendWelcome(email);

const logUserCreation = (userId: number): RTE.ReaderTaskEither<AppContext, string, void> =>
  ({ logger }) => () => {
    logger.info(`User created: ${userId}`);
    return Promise.resolve(E.right(undefined));
  };

// Uso en el controlador
const handleRegistration = async (req: Request, res: Response) => {
  const context: AppContext = {
    database: req.app.db,
    emailService: req.app.emailService,
    logger: req.app.logger
  };

  const result = await RTE.run(context)(registerUser(req.body));
  
  if (E.isRight(result)) {
    res.json({ success: true, user: result.right });
  } else {
    res.status(400).json({ error: result.left });
  }
};
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Links útiles

- [Documentación de Programación Funcional](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
- [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land)
- [fp-ts](https://gcanti.github.io/fp-ts/) - Inspiración para esta librería

---

*Construido con ❤️ para la comunidad de programación funcional en TypeScript*
