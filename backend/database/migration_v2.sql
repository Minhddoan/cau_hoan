-- Migration: Add missing columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS deliverables TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
