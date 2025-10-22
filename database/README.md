# Supabase Configuration

## Project Setup
This directory contains database schema, migrations, and configuration for Supabase integration.

## Structure
- `migrations/` - Database migration files
- `schema/` - Database schema definitions
- `types/` - Generated TypeScript types
- `config.toml` - Supabase project configuration

## Getting Started

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

4. Generate types:
   ```bash
   supabase gen types typescript --local > types/supabase.ts
   ```

## Environment Variables
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)
