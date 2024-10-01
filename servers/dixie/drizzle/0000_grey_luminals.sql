CREATE TABLE IF NOT EXISTS "tips" (
	"id" serial PRIMARY KEY NOT NULL,
	"chain" text DEFAULT 'solana' NOT NULL,
	"config" json NOT NULL,
	"status" text DEFAULT 'idle' NOT NULL,
	"user" serial NOT NULL,
	"chat" text NOT NULL,
	"messages" json DEFAULT '[]'::json NOT NULL,
	"signature" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text,
	"chat" text,
	"username" text,
	"referer" text,
	"social" text DEFAULT 'telegram' NOT NULL,
	"linked" json DEFAULT '[]'::json NOT NULL,
	"date_joined" timestamp DEFAULT now(),
	CONSTRAINT "unique_social_and_id" UNIQUE NULLS NOT DISTINCT("social","id"),
	CONSTRAINT "unique_social_and_username" UNIQUE NULLS NOT DISTINCT("social","username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"chain" text NOT NULL,
	"user" serial NOT NULL,
	"hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain" text DEFAULT 'solana',
	"title" text NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"config" json NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"user" serial NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "points" (
	"id" serial PRIMARY KEY NOT NULL,
	"task" text NOT NULL,
	"point" integer NOT NULL,
	"user" serial NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"chain" text DEFAULT 'solana' NOT NULL,
	"user" serial NOT NULL,
	CONSTRAINT "settings_user_unique" UNIQUE("user")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "redeems" (
	"id" serial PRIMARY KEY NOT NULL,
	"coupon" uuid NOT NULL,
	"user" serial NOT NULL,
	"status" text DEFAULT 'idle' NOT NULL,
	"signature" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupon_per_user" UNIQUE("coupon","user")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tips" ADD CONSTRAINT "tips_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coupons" ADD CONSTRAINT "coupons_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "points" ADD CONSTRAINT "points_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "settings" ADD CONSTRAINT "settings_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "redeems" ADD CONSTRAINT "redeems_coupon_coupons_id_fk" FOREIGN KEY ("coupon") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "redeems" ADD CONSTRAINT "redeems_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
