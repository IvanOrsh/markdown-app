## 1. Process

1. Discovery - In the discovery phase, you gather requirements, define project goals, and conduct research to understand the needs and expectations of the project.

2. Design - The design phase involves creating the visual and user experience elements of the website, including wireframes, mockups, and user interface design.

3. Development - During development, you implement the design, write code, and build the functionality of the website or web application based on the requirements and design specifications.

4. Deployment - In the development phase, you make the web project live by configuring servers, deploying the code, and ensuring it's accessible to users on the internet.

## 2. Technologies

**Tech stack** - combination of programming languages, frameworks, databases, and other technologies used to build a web application.

For this (Markdown app) project:

- Next.js
- React
- Node.js
- TypeScript
- PostgreSQL

## 3. Platforms

Platforms provide tools and services that facilitate various aspects of the software development process, from version control and collaboration to deployment and hosting:

For this (Markdown app) project:

- Github
- Vercel

## 4. Project Description

**Project Description**: The goal is to build a basic online note taking tool where users can write notes in markdown, organize notes in a tree structure, and publish the notes.

<br>

**User Stories**:

- As a user, I want to **sign up** to the app
- As a user, I want to **log in** to the app
- As a user, I want to **create notes** in markdown
- As a user, I want a **sidebar to navigate** my notes
- As a user, I want to **organize my notes in a nested tree structure** using a **drag an drop** UI
- As a user, I want to **sort my notes** by title, created time, or updated time in the **editing view**
- As a user, I want to **publish** my notes
- As a user, I want to **search the entire db of notes** by title in the **published view**
- As a user, I want to **sort my notes** by title, created time, or update time in the **published view**

## 5. DB Stuffs

`postgres://username:password@host:port/database`

initial schema:

```sql
create extension if not exists citext;
create extension if not exists "uuid-ossp";
create table users (
	id uuid default uuid_generate_v4() primary key,
	username citext unique not null,
	password text,
	created_at timestamp default now(),
	updated_at timestamp default now()
);
create table notes (
	id uuid default uuid_generate_v4() primary key,
	parent_id uuid references notes (id),
	user_id uuid not null references users (id),
	title text,
	content text,
	is_published boolean not null default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

```
