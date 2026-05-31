# Rinnovati Home 🛋️

Repositorio oficial de la tienda de muebles **Rinnovati**. Esta aplicación está construida con **Next.js 16 (App Router)**, Tailwind CSS V4 y **Supabase** como backend, siguiendo estrictamente los principios de **Clean Architecture**.

## 📌 Arquitectura del Proyecto

El proyecto está estructurado en cuatro capas principales para separar las responsabilidades:

1. **Domain (`src/core/domain/`)**: Entidades centrales (ej: `Product`), reglas de negocio puras y schemas de Zod. No depende de ninguna librería externa.
2. **Application (`src/core/application/`)**: Casos de uso (ej: `CreateProductUseCase`) y puertos (interfaces `IProductRepository`, `IStorageService`). Orquesta la lógica de negocio.
3. **Infrastructure (`src/core/infrastructure/`)**: Implementaciones técnicas concretas. Aquí viven los adaptadores de Supabase (`SupabaseProductRepository`, `SupabaseStorageService`) y el inyector de dependencias (`dependencies.ts`).
4. **UI (`src/app/` y `src/components/`)**: Componentes de React y Server Actions. Solo se comunican con la capa de Aplicación a través de los Casos de Uso o directamente usando el Repositorio de Infraestructura (para lecturas).

---

## ⚙️ Base de Datos (Supabase)

El proyecto utiliza **Supabase** (PostgreSQL) para la base de datos y para el almacenamiento de imágenes (Storage).

### Tabla: `products`

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `UUID` | Identificador único (Generado automáticamente). |
| `slug` | `TEXT` | URL-friendly name, debe ser UNIQUE. |
| `name` | `TEXT` | Nombre del producto. |
| `category` | `TEXT` | Categoría (ej: `sofas`, `mesas`, `butacas`). |
| `price` | `NUMERIC` | Precio del producto en Soles. |
| `material` | `TEXT` | Descripción corta de los materiales. |
| `description` | `TEXT` | Descripción completa y detallada. |
| `image_url` | `TEXT` | URL pública de la imagen principal subida al Storage. |
| `overlay_image_url` | `TEXT` | URL opcional para fondos/IA. |
| `colors` | `JSONB` | Array de colores disponibles: `[{ name: "Negro", hex: "#000" }]`. |
| `created_at` | `TIMESTAMP` | Fecha de creación del registro. |

### Supabase Storage
Se requiere un **Storage Bucket** llamado `product-images` configurado como **Público** (Public) para que Next.js pueda acceder a las imágenes libremente.

---

## 🔑 Variables de Entorno

Para ejecutar este proyecto de forma local, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes claves proporcionadas por tu proyecto de Supabase:

```env
# URL de la API de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<TU-PROYECTO>.supabase.co

# Clave anónima pública de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

> **Nota:** Adicionalmente, revisa el archivo `next.config.ts`. El hostname de Supabase (`<TU-PROYECTO>.supabase.co`) debe estar agregado al array de `images.remotePatterns` para que Next.js permita renderizar las imágenes remotas.

---

## 🚀 Guía de Instalación y Uso

1. **Clona el repositorio** e ingresa al directorio:
   ```bash
   git clone <url-del-repo>
   cd rinovatti-webpage
   ```

2. **Instala las dependencias** (Asegúrate de usar Node.js 18.x o superior):
   ```bash
   npm install
   ```

3. **Configura el archivo `.env.local`** con las credenciales correspondientes como se explicó arriba.

4. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la página de Inicio y el Catálogo. Puedes acceder al panel de administración añadiendo productos mediante `http://localhost:3000/dashboard`.

## 🛠️ Comandos útiles

- `npm run build`: Compila la aplicación para producción.
- `npx tsc --noEmit`: Verifica que no existan errores de tipado en TypeScript.
- `npm run format`: Formatea el código usando Prettier.

---
*Desarrollado para Rinnovati.*