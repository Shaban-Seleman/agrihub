CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    summary TEXT,
    cover_image_url VARCHAR(255),
    status VARCHAR(30) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_courses_status ON courses(status);

CREATE TABLE course_modules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id),
    title VARCHAR(160) NOT NULL,
    summary TEXT,
    display_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL REFERENCES course_modules(id),
    title VARCHAR(160) NOT NULL,
    content TEXT NOT NULL,
    media_url VARCHAR(255),
    duration_minutes INT,
    display_order INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_status ON lessons(status);

CREATE TABLE user_course_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    course_id BIGINT NOT NULL REFERENCES courses(id),
    lesson_id BIGINT NOT NULL REFERENCES lessons(id),
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_user_course_lesson UNIQUE (user_id, lesson_id)
);
CREATE INDEX idx_user_course_progress_user_course ON user_course_progress(user_id, course_id);

CREATE TABLE lesson_feedback (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    lesson_id BIGINT NOT NULL REFERENCES lessons(id),
    helpful BOOLEAN NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_lesson_feedback_user_lesson UNIQUE (user_id, lesson_id)
);
CREATE INDEX idx_lesson_feedback_lesson ON lesson_feedback(lesson_id);

CREATE TABLE farming_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    season_code VARCHAR(50) NOT NULL,
    land_size NUMERIC(12,2) NOT NULL,
    land_unit VARCHAR(20) NOT NULL,
    planting_date DATE NOT NULL,
    harvest_date DATE,
    actual_yield NUMERIC(12,2),
    yield_unit VARCHAR(20),
    farming_method VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_farming_activities_user_id ON farming_activities(user_id);
CREATE INDEX idx_farming_activities_crop_id ON farming_activities(crop_id);

CREATE TABLE produce_listings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    farming_activity_id BIGINT REFERENCES farming_activities(id),
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    title VARCHAR(160) NOT NULL,
    description TEXT,
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price_per_unit NUMERIC(12,2),
    region_id BIGINT REFERENCES regions(id),
    district_id BIGINT REFERENCES districts(id),
    contact_name VARCHAR(120),
    contact_phone VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_produce_listings_status_expires_at ON produce_listings(status, expires_at);
CREATE INDEX idx_produce_listings_crop_region ON produce_listings(crop_id, region_id);

CREATE TABLE demand_listings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    title VARCHAR(160) NOT NULL,
    description TEXT,
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    offered_price_per_unit NUMERIC(12,2),
    region_id BIGINT REFERENCES regions(id),
    district_id BIGINT REFERENCES districts(id),
    contact_name VARCHAR(120),
    contact_phone VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_demand_listings_status_expires_at ON demand_listings(status, expires_at);
CREATE INDEX idx_demand_listings_crop_region ON demand_listings(crop_id, region_id);

CREATE TABLE opportunities (
    id BIGSERIAL PRIMARY KEY,
    created_by_user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(160) NOT NULL,
    summary TEXT NOT NULL,
    opportunity_type VARCHAR(40) NOT NULL,
    region_id BIGINT REFERENCES regions(id),
    crop_id BIGINT REFERENCES crops(id),
    external_application_link VARCHAR(255),
    contact_details VARCHAR(255),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_opportunities_status_deadline ON opportunities(status, deadline);

CREATE TABLE advisory_content (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    crop_id BIGINT REFERENCES crops(id),
    region_id BIGINT REFERENCES regions(id),
    media_url VARCHAR(255),
    status VARCHAR(30) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_advisory_content_status ON advisory_content(status);
