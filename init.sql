DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'quorvia_user') THEN
      CREATE DATABASE quorvia_user;
   END IF;
END
$$;
