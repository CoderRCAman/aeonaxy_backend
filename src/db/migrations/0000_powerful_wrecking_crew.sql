CREATE TABLE IF NOT EXISTS "steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"step_1" integer DEFAULT 0 NOT NULL,
	"step_2" integer DEFAULT 0 NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"username" text NOT NULL,
	"image_url" text DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
);
