# Yakoo Strapi + NEXT.js local-hosting starter template

## Basic Setup

### Install dependencies

```bash
pnpm install
```

### Setup Database and secrets for Strapi

1. Copy `apps/strapi/.env.example` to `apps/strapi/.env`
2. Generate secrets with `openssl` for APP_KEYS (4 sets concat with ",") ,API_TOKEN_SALT, ADMIN_JWT_SECRET and JWT_SECRET

```bash
cd apps/strapi
cp .env.example .env
echo "APP_KEYS="`openssl rand 16 | base64`","`openssl rand 16 | base64`","`openssl rand 16 | base64`","`openssl rand 16 | base64` >> .env
echo "API_TOKEN_SALT="`openssl rand 16 | base64` >> .env
echo "ADMIN_JWT_SECRET="`openssl rand 16 | base64` >> .env
echo "TRANSFER_TOKEN_SALT="`openssl rand 16 | base64` >> .env
echo "JWT_SECRET="`openssl rand 16 | base64` >> .env
```

3. Fill in the database credentials in `apps/strapi/.env`
4. (Optional) Fill in SMTP credentials in `apps/strapi/.env`. For testing purpose, you can use [Ethereal](https://ethereal.email/)

### Generate Strapi admin API Token for NextJS

1. Start Strapi server

```bash
cd apps/strapi
pnpm dev
```

2. Open http://localhost:1337/dashboard
3. Create the initial Admin User
4. Go to "Settings" > "Global Settings" > "API Tokens"
5. Click "Create new API Token"
6. Fill in the form, select "Unlimited" for Token duration, "Read-only" for Token Type and click "Save"
7. Copy the generated token and save it to `apps/web/.env.local` file as `STRAPI_API_TOKEN`

```env
STRAPI_API_TOKEN=<generated token>
```

### Start DEV server

```bash
# start both Strapi and NextJS
pnpm dev
# start only Strapi
pnpm dev --filter strapi
# start only NextJS
pnpm dev --filter web
```

## Strapi Plugins used

| Plugin                            | Description                         | Why?                                                              |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| @strapi/plugin-i18n               | Official Internationalization       |                                                                   |
| @strapi/plugin-seo                | Official SEO Components             |                                                                   |
| @strapi/plugin-users-permissions  | Official Access Control             |                                                                   |
| @strapi/provider-email-nodemailer | Official EmailProvider (NodeMailer) | Use SMTP so no vendor lock-in                                     |
| @strapi/provider-upload-local     | Official Local Upload Provider      | Use local storage for upload                                      |
| @strapi/plugin-color-picker       | Official Color Picker               |                                                                   |
| strapi-plugin-local-image-sharp   | Image Optimization                  | For image optimization in NextJS Image and cache in local storage |
| strapi-plugin-placeholder         | Generate image blurHash             | Generate image placeholder for NextJS Image                       |
| strapi-plugin-rest-cache          | Cache REST API response             | (Optional) Deep populate can be costly.                           |
| strapi-plugin-config-sync         | Sync Strapi config to database      | (Optional) Sync config to database                                |

## NextJS Dependencies

| Category         | Library             | URL                                                 |
| ---------------- | ------------------- | --------------------------------------------------- |
| Web              | NextJS (app-router) | [https://nextjs.org/docs]()                         |
| UI               | shadcn/ui           | [https://ui.shadcn.com]()                           |
| UI               | Tailwindcss         | [https://tailwindcss.com]()                         |
| UI/Accessibility | Radix-UI            | [https://radix-ui.com]()                            |
| Icons            | Lucide Icons        | [https://lucide.dev/icons/]()                       |
| Form             | React Hook Foorm    | [https://react-hook-form.com]()                     |
| Validation       | Zod                 | [https://zod.dev]()                                 |
| Env Control      | @t3-oss/env-nextjs  | [https://github.com/t3-oss/t3-env]()                |
| SEO              | Next-Sitemap        | [https://github.com/iamvishnusankar/next-sitemap]() |
