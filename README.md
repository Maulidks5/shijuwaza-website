# SHIJUWAZA Website

Clean public website, CMS, member portal, and admin system for SHIJUWAZA. The platform supports public communication, donor engagement, OPD member visibility, submissions approval, publications, announcements, gallery albums, and secure role-based administration.

## Tech Stack

- Laravel 13
- PHP 8.3+
- Inertia.js
- React 19
- Tailwind CSS v4
- Vite
- MySQL
- Spatie Laravel Permission

## Core Features

- CMS-driven homepage with hero, announcements ticker, programs, impact stats, latest updates, publications, donation appeal, and contact details.
- Public pages for About, Programs, News, Gallery, Publications, Announcements, Members, Contact, Donate, and Partner With Us.
- Publications module for newsletters, reports, strategic plan, articles, and success stories.
- Announcement module with text/document support and public detail pages.
- Gallery with albums/categories, featured photos, pagination, and lightbox preview.
- Member OPD portal where member organizations log in, submit text/document updates, and edit profile information.
- Admin approval workflow for member submissions before public publishing.
- Manual donation request flow and partnership request flow.
- Secure admin panel with module-based permissions and strict role control.
- User profile management with avatar, phone, email, and password update.

## Roles And Access

The system uses three admin roles:

- Super Admin: full control, user management, settings, all modules, and permanent delete.
- Admin: manages assigned operational modules, can hide/archive, cannot permanently delete.
- Editor: creates and edits assigned content modules only.

Module access is controlled by Super Admin from `/admin/users`. Sidebar links and backend routes both follow assigned permissions.

Member accounts are separate from admin users. They log in through the same login page and are redirected to `/member/dashboard`.

## Setup

Install dependencies:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configure `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shijuwaza_db
DB_USERNAME=root
DB_PASSWORD=Admin2026@
```

Create the database in MySQL, then run:

```bash
php artisan migrate --seed
php artisan storage:link
```

## Development

Run the backend and frontend dev servers:

```bash
composer serve
npm run dev
```

Use `composer serve` instead of plain `php artisan serve` for local uploads. The composer command starts PHP with `upload_max_filesize=20M` and `post_max_size=24M`, matching the Resources document limit.

Production build:

```bash
npm run build
```

Run tests:

```bash
php artisan test
```

## Local Login Accounts

Admin login URL:

```text
/login
```

Seeded local/demo accounts are managed by the database seeders. For production, create fresh strong passwords and remove or disable demo accounts.

## Key Routes

Public:

- `/`
- `/about`
- `/programs`
- `/news`
- `/gallery`
- `/announcements`
- `/reports`
- `/newsletters`
- `/strategic-plan`
- `/articles`
- `/members`
- `/contact`
- `/donate`
- `/partner-with-us`

Admin:

- `/admin/dashboard`
- `/admin/users`
- `/admin/hero-section`
- `/admin/stats`
- `/admin/programs`
- `/admin/news`
- `/admin/announcements`
- `/admin/resources`
- `/admin/media-albums`
- `/admin/media`
- `/admin/members`
- `/admin/donations`
- `/admin/partnership-requests`
- `/admin/contact-messages`
- `/admin/settings`

Member:

- `/member/dashboard`
- `/member/profile`
- `/member/submissions`

## cPanel Production Deployment

Recommended structure:

```text
/home/CPANEL_USER/shijuwaza        # Git project root
/home/CPANEL_USER/shijuwaza/public # domain document root
```

If cPanel cannot point the domain document root to `project/public`, keep the Laravel project outside `public_html` and configure `public_html` to serve the contents of the `public` directory only.

First deployment:

```bash
git clone YOUR_PRIVATE_REPO_URL shijuwaza
cd shijuwaza
cp .env.production.example .env
php artisan key:generate
```

Then edit `.env` with the real production domain, database, mail, and security values.

After every `git pull`, run:

```bash
bash scripts/cpanel-deploy.sh
```

The deployment script installs production Composer dependencies, builds Vite assets when Node.js is available, runs migrations, creates the storage symlink, clears stale caches, and rebuilds Laravel production caches.

If the cPanel account does not have Node.js/npm, build assets locally with `npm run build` and upload/deploy `public/build`, or enable Node.js in cPanel before running the deploy script.

Production checklist:

- `.env` exists on the server and is not committed to Git.
- `APP_ENV=production`.
- `APP_DEBUG=false`.
- `APP_URL` uses the live HTTPS domain.
- `DB_*` credentials point to the cPanel MySQL database.
- `MAIL_*` credentials are real production mailbox credentials.
- Domain document root points to `public`.
- `storage` and `bootstrap/cache` are writable by PHP.
- Demo accounts are removed, blocked, or given strong passwords.
- SSL is enabled for the domain.

## Verification

Before handover or deployment, run:

```bash
npm run build
php artisan test
```

Uploaded files are stored on the public disk and served through `/storage`.
