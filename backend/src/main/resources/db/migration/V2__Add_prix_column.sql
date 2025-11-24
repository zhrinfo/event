-- Ajout de la colonne prix à la table event
ALTER TABLE event
ADD COLUMN prix DOUBLE DEFAULT 0.0;

-- Mettre à jour les événements existants avec une valeur par défaut
UPDATE event SET prix = 0.0 WHERE prix IS NULL;
