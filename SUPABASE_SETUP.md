# Configuration Supabase pour GeoLoc

## Tables à créer dans votre console Supabase

Connectez-vous à votre projet Supabase (https://eskswatziioxurxzmnxy.supabase.co) et exécutez les scripts SQL suivants dans l'éditeur SQL :

### 1. Table des profils utilisateurs

```sql
-- Table pour les profils utilisateurs
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can read all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Table des lieux

```sql
-- Table pour les lieux
CREATE TABLE public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'other',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image TEXT, -- Base64 encoded image
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX places_location_idx ON public.places (latitude, longitude);
CREATE INDEX places_author_idx ON public.places (author_id);
CREATE INDEX places_type_idx ON public.places (type);
CREATE INDEX places_created_at_idx ON public.places (created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Anyone can read places" ON public.places
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create places" ON public.places
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update their own places" ON public.places
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own places" ON public.places
  FOR DELETE USING (auth.uid() = author_id);
```

### 3. Table des commentaires

```sql
-- Table pour les commentaires
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX comments_place_idx ON public.comments (place_id);
CREATE INDEX comments_author_idx ON public.comments (author_id);
CREATE INDEX comments_created_at_idx ON public.comments (created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);
```

### 4. Table des favoris

```sql
-- Table pour les favoris
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Index pour les performances
CREATE INDEX favorites_user_idx ON public.favorites (user_id);
CREATE INDEX favorites_place_idx ON public.favorites (place_id);

-- RLS (Row Level Security)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can read their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Table des signalements

```sql
-- Table pour les signalements
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id)
);

-- Index pour les performances
CREATE INDEX reports_place_idx ON public.reports (place_id);
CREATE INDEX reports_status_idx ON public.reports (status);
CREATE INDEX reports_created_at_idx ON public.reports (created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

CREATE POLICY "Users can read their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);
```

## Instructions

1. Connectez-vous à votre console Supabase
2. Allez dans "SQL Editor"
3. Copiez et exécutez chaque script SQL un par un
4. Vérifiez que toutes les tables ont été créées dans "Table Editor"

Une fois terminé, votre application sera prête à fonctionner !