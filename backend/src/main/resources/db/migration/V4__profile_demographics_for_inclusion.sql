ALTER TABLE user_profiles ADD COLUMN gender VARCHAR(30);
ALTER TABLE user_profiles ADD COLUMN age_range VARCHAR(30);

UPDATE user_profiles
SET gender = (
        SELECT fp.gender
        FROM farmer_profiles fp
        WHERE fp.user_id = user_profiles.user_id
    ),
    age_range = (
        SELECT fp.age_range
        FROM farmer_profiles fp
        WHERE fp.user_id = user_profiles.user_id
    )
WHERE (gender IS NULL OR age_range IS NULL)
  AND EXISTS (
        SELECT 1
        FROM farmer_profiles fp
        WHERE fp.user_id = user_profiles.user_id
    );
