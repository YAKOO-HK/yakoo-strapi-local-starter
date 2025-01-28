# Yakoo Strapi + NEXT.js local-hosting starter template

By [Yakoo Technology Limited](https://www.yakoo.com.hk)

## Setup Procedure

### Install dependencies

```bash
pnpm install
```

### Update Strapi UUID

1. Generate UUID with `uuidgen` command

```bash
uuidgen
```

2. Edit `apps/strapi/package.json`

```json
{
  "strapi": {
    "uuid": "your-uuid-here"
  }
}
```

### Setup Database and secrets for Strapi

1. Copy `apps/strapi/.env.example` to `apps/strapi/.env`
2. Our default database is MySQL 8 (mysql2). If you want to use other database, please refer to [Strapi Database Documentation](https://docs.strapi.io/dev-docs/configurations/database)
   and install the required dependencies
3. Generate secrets with `openssl` for APP_KEYS (4 sets concat with ",") ,API_TOKEN_SALT, ADMIN_JWT_SECRET and JWT_SECRET

```bash
cd apps/strapi
cp .env.example .env
echo "APP_KEYS="`openssl rand 16 | base64`","`openssl rand 16 | base64`","`openssl rand 16 | base64`","`openssl rand 16 | base64` >> .env
echo "API_TOKEN_SALT="`openssl rand 16 | base64` >> .env
echo "ADMIN_JWT_SECRET="`openssl rand 16 | base64` >> .env
echo "TRANSFER_TOKEN_SALT="`openssl rand 16 | base64` >> .env
echo "JWT_SECRET="`openssl rand 16 | base64` >> .env
```

4. Fill in the database credentials in `apps/strapi/.env`
5. (Optional) Fill in SMTP credentials in `apps/strapi/.env`. For testing purpose, you can use [Ethereal](https://ethereal.email/)

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
6. Fill in the form, select "Unlimited" for Token duration, "Read-only" for Token Type (so it auto-check all find/findOne on all Content-Type) and then Select "Custom". Under "Navigation", select all. Click Save
7. Edit the token and select "Custom"
8. Copy the generated token and save it to `apps/web/.env.local` file as `STRAPI_API_TOKEN`

```env
STRAPI_ADMIN_API_TOKEN=<generated token>
```

### Import default Strapi Configuration

```bash
cd apps/strapi
pnpm cs import
```

### Setup Webhooks on Strapi to trigger NextJS revalidate

1. Generate a secret with `openssl` for x-internal-api-secret (INTERNAL_API_SECRET)
2. Login to Strapi Admin Dashboard
3. Go to "Settings" > "Global Settings" > "Webhooks"
4. Click "Create new Webhook"
5. Fill in the fill

```
Name:revalidateTag
Url:http://localhost:3000/api/revalidate
Under Events: Check all on "Entry"
Under Header: "x-internal-api-secret: <your secret>"
```

5. Click "Save"

### Build Custom Strapi Plugins

```bash
pnpm build:plugins
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

### Semantics Search and AI Chatbot with AWS Bedrock / OpenAI and Typesense (POC)

[typesense.md](./typesense.md)

## Strapi Plugins used

| Plugin                            | Description                             | Why?                                                                                                               |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| @strapi/plugin-i18n               | Official Internationalization           |                                                                                                                    |
| @strapi/plugin-seo                | Official SEO Components                 |                                                                                                                    |
| @strapi/plugin-users-permissions  | Official Access Control                 |                                                                                                                    |
| @strapi/provider-email-nodemailer | Official EmailProvider (NodeMailer)     | Use SMTP so no vendor lock-in                                                                                      |
| @strapi/provider-upload-local     | Official Local Upload Provider          | Use local storage for upload                                                                                       |
| @strapi/plugin-color-picker       | Official Color Picker                   |                                                                                                                    |
| strapi-plugin-publisher           | Scheduled Publish/Unpublish Content     |                                                                                                                    |
| strapi-plugin-placeholder         | Generate image blurHash                 | Generate image placeholder for NextJS Image                                                                        |
| strapi-plugin-rest-cache          | Cache REST API response                 | (Optional) Deep populate can be costly.                                                                            |
| strapi-plugin-config-sync         | Sync Strapi config to database          | (Optional) Sync config between Databases                                                                           |
| strapi-plugin-navigation          | Navigation Menu                         |                                                                                                                    |
| @repo/plugin-local-image-sharp    | Image Optimization                      | Forked from [strapi-plugin-local-image-sharp](https://github.com/strapi-community/strapi-plugin-local-image-sharp) |
| strapi-plugin-ezforms             | Simple Form submission and notification | Forked from [strapi-plugin-ezforms](https://github.com/excl-networks/strapi-plugin-ezforms)                        |

## NextJS Dependencies

| Category         | Library                    | URL                                                   |
| ---------------- | -------------------------- | ----------------------------------------------------- |
| Web              | NextJS (app-router)        | [https://nextjs.org/docs]()                           |
| UI               | shadcn/ui                  | [https://ui.shadcn.com]()                             |
| UI               | Tailwindcss                | [https://tailwindcss.com]()                           |
| UI               | Framer Motion.             | [https://www.framer.com/motion/]()                    |
| UI/Accessibility | Radix-UI                   | [https://radix-ui.com]()                              |
| Icons            | Lucide Icons               | [https://lucide.dev/icons/]()                         |
| Form             | React Hook Foorm           | [https://react-hook-form.com]()                       |
| Validation       | Zod                        | [https://zod.dev]()                                   |
| Env Control      | @t3-oss/env-nextjs         | [https://github.com/t3-oss/t3-env]()                  |
| SEO              | Next-Sitemap               | [https://github.com/iamvishnusankar/next-sitemap]()   |
| CAPTCHA          | react-hcaptcha             | [https://docs.hcaptcha.com/]()                        |
| Components       | yet-another-react-lightbox | [https://yet-another-react-lightbox.com/]()           |
| Components       | react-photo-album          | [https://react-photo-album.com/]()                    |
| Components       | embla-carousel-react       | [https://www.embla-carousel.com/get-started/react/]() |
| Client State     | TanStack Query             | [https://tanstack.com/query/latest/]()                |
