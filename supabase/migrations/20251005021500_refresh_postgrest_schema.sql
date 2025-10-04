-- Refresh PostgREST schema cache so new columns are available to the API
NOTIFY pgrst, 'reload schema';
