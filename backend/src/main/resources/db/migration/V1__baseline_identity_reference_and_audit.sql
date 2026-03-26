CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE regions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE districts (
    id BIGSERIAL PRIMARY KEY,
    region_id BIGINT NOT NULL REFERENCES regions(id),
    name VARCHAR(100) NOT NULL
);
CREATE INDEX idx_districts_region_id ON districts(region_id);

CREATE TABLE wards (
    id BIGSERIAL PRIMARY KEY,
    district_id BIGINT NOT NULL REFERENCES districts(id),
    name VARCHAR(100) NOT NULL
);
CREATE INDEX idx_wards_district_id ON wards(district_id);

CREATE TABLE crops (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120),
    region_id BIGINT REFERENCES regions(id),
    district_id BIGINT REFERENCES districts(id),
    ward_id BIGINT REFERENCES wards(id),
    date_of_birth DATE,
    profile_photo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE farmer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    gender VARCHAR(30) NOT NULL,
    age_range VARCHAR(30) NOT NULL,
    primary_crop_id BIGINT NOT NULL REFERENCES crops(id),
    secondary_crop_id BIGINT REFERENCES crops(id),
    farming_experience VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE business_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    business_name VARCHAR(160) NOT NULL,
    business_type VARCHAR(40) NOT NULL,
    registration_number VARCHAR(50),
    verification_status VARCHAR(30) NOT NULL,
    visible_in_directory BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE partner_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    organization_name VARCHAR(160) NOT NULL,
    organization_type VARCHAR(50) NOT NULL,
    focus_area VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE user_crop_interests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    CONSTRAINT uq_user_crop_interest UNIQUE (user_id, crop_id)
);
CREATE INDEX idx_user_crop_interests_user_id ON user_crop_interests(user_id);

CREATE TABLE business_profile_commodities (
    id BIGSERIAL PRIMARY KEY,
    business_profile_id BIGINT NOT NULL REFERENCES business_profiles(id),
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    CONSTRAINT uq_business_commodity UNIQUE (business_profile_id, crop_id)
);
CREATE INDEX idx_business_profile_commodities_profile_id ON business_profile_commodities(business_profile_id);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id BIGINT,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id VARCHAR(100),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);

INSERT INTO regions (name) VALUES
('Dodoma'),
('Morogoro'),
('Mbeya');

INSERT INTO districts (region_id, name) VALUES
((SELECT id FROM regions WHERE name = 'Dodoma'), 'Chamwino'),
((SELECT id FROM regions WHERE name = 'Dodoma'), 'Bahi'),
((SELECT id FROM regions WHERE name = 'Morogoro'), 'Kilosa'),
((SELECT id FROM regions WHERE name = 'Morogoro'), 'Mvomero'),
((SELECT id FROM regions WHERE name = 'Mbeya'), 'Mbeya Urban'),
((SELECT id FROM regions WHERE name = 'Mbeya'), 'Chunya');

INSERT INTO wards (district_id, name) VALUES
((SELECT id FROM districts WHERE name = 'Chamwino'), 'Msanga'),
((SELECT id FROM districts WHERE name = 'Chamwino'), 'Mvumi Makulu'),
((SELECT id FROM districts WHERE name = 'Bahi'), 'Bahi Sokoni'),
((SELECT id FROM districts WHERE name = 'Kilosa'), 'Kimamba'),
((SELECT id FROM districts WHERE name = 'Mvomero'), 'Mlali'),
((SELECT id FROM districts WHERE name = 'Mbeya Urban'), 'Iyunga'),
((SELECT id FROM districts WHERE name = 'Chunya'), 'Mbugani');

INSERT INTO crops (name) VALUES
('Mahindi'),
('Mpunga'),
('Alizeti'),
('Maharage'),
('Nyanya'),
('Viazi');
