-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  category varchar(100) not null,
  brand varchar(100) not null,
  price decimal(10,2) not null,
  currency varchar(10) not null default 'INR',
  description text not null default '',
  specifications jsonb not null default '{}',
  pros jsonb not null default '[]',
  cons jsonb not null default '[]',
  rating decimal(3,2) not null default 0,
  reviews_count integer not null default 0,
  image_url text not null default '',
  amazon_link text not null default '',
  flipkart_link text not null default '',
  affiliate_enabled boolean not null default true,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for products
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_brand on products(brand);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_rating on products(rating desc);
create index if not exists idx_products_category_price on products(category, price);
create index if not exists idx_products_category_rating on products(category, rating desc);
create index if not exists idx_products_in_stock on products(in_stock);

-- Full-text search index
create index if not exists idx_products_fts on products
  using gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(description,'')));

-- Searches table
create table if not exists searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  parsed_query jsonb,
  results_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_searches_user_id on searches(user_id);
create index if not exists idx_searches_created_at on searches(created_at desc);

-- Saved recommendations table
create table if not exists saved_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists idx_saved_recs_user_id on saved_recommendations(user_id);
create index if not exists idx_saved_recs_saved_at on saved_recommendations(saved_at desc);

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at
  before update on products
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table products enable row level security;
alter table searches enable row level security;
alter table saved_recommendations enable row level security;

-- Products: anyone can read
create policy "Products are publicly readable"
  on products for select using (true);

-- Searches: users can only see and manage their own
create policy "Users can read own searches"
  on searches for select using (auth.uid() = user_id);

create policy "Users can insert own searches"
  on searches for insert with check (auth.uid() = user_id);

create policy "Users can delete own searches"
  on searches for delete using (auth.uid() = user_id);

-- Saved recommendations: users manage their own
create policy "Users can read own saved recommendations"
  on saved_recommendations for select using (auth.uid() = user_id);

create policy "Users can insert own saved recommendations"
  on saved_recommendations for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved recommendations"
  on saved_recommendations for delete using (auth.uid() = user_id);
