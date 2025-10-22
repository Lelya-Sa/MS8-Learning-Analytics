-- MS8 Learning Analytics - Seed Data
-- Initial data for development and testing

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@ms8learning.com', crypt('admin123', gen_salt('bf')), 'Admin', 'User', 'admin'),
('teacher1@ms8learning.com', crypt('teacher123', gen_salt('bf')), 'John', 'Smith', 'teacher'),
('teacher2@ms8learning.com', crypt('teacher123', gen_salt('bf')), 'Sarah', 'Johnson', 'teacher'),
('student1@ms8learning.com', crypt('student123', gen_salt('bf')), 'Alice', 'Brown', 'student'),
('student2@ms8learning.com', crypt('student123', gen_salt('bf')), 'Bob', 'Wilson', 'student'),
('student3@ms8learning.com', crypt('student123', gen_salt('bf')), 'Carol', 'Davis', 'student'),
('student4@ms8learning.com', crypt('student123', gen_salt('bf')), 'David', 'Miller', 'student');

-- Insert sample courses
INSERT INTO courses (title, description, code, instructor_id, start_date, end_date) VALUES
('Mathematics 101', 'Introduction to basic mathematics concepts', 'MATH101', 
 (SELECT id FROM users WHERE email = 'teacher1@ms8learning.com'),
 '2024-01-15', '2024-05-15'),
('Science Fundamentals', 'Basic science principles and experiments', 'SCI101',
 (SELECT id FROM users WHERE email = 'teacher2@ms8learning.com'),
 '2024-01-15', '2024-05-15'),
('English Literature', 'Classic and modern literature studies', 'ENG101',
 (SELECT id FROM users WHERE email = 'teacher1@ms8learning.com'),
 '2024-01-15', '2024-05-15');

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id) VALUES
((SELECT id FROM users WHERE email = 'student1@ms8learning.com'), 
 (SELECT id FROM courses WHERE code = 'MATH101')),
((SELECT id FROM users WHERE email = 'student2@ms8learning.com'), 
 (SELECT id FROM courses WHERE code = 'MATH101')),
((SELECT id FROM users WHERE email = 'student3@ms8learning.com'), 
 (SELECT id FROM courses WHERE code = 'SCI101')),
((SELECT id FROM users WHERE email = 'student4@ms8learning.com'), 
 (SELECT id FROM courses WHERE code = 'SCI101')),
((SELECT id FROM users WHERE email = 'student1@ms8learning.com'), 
 (SELECT id FROM courses WHERE code = 'ENG101')),
((SELECT id FROM users WHERE email = 'student2@ms8learning.com'), 
 (SELECT id FROM courses WHERE code = 'ENG101'));

-- Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date, max_points) VALUES
((SELECT id FROM courses WHERE code = 'MATH101'), 'Algebra Basics', 'Complete exercises 1-20', '2024-02-15 23:59:59', 100),
((SELECT id FROM courses WHERE code = 'MATH101'), 'Geometry Quiz', 'Quiz on basic geometry concepts', '2024-02-20 23:59:59', 50),
((SELECT id FROM courses WHERE code = 'SCI101'), 'Lab Report 1', 'Report on chemistry experiment', '2024-02-18 23:59:59', 75),
((SELECT id FROM courses WHERE code = 'ENG101'), 'Essay Assignment', 'Write a 500-word essay on assigned topic', '2024-02-25 23:59:59', 100);

-- Insert sample submissions
INSERT INTO submissions (assignment_id, student_id, content, points_earned, submitted_at) VALUES
((SELECT id FROM assignments WHERE title = 'Algebra Basics'), 
 (SELECT id FROM users WHERE email = 'student1@ms8learning.com'),
 'Completed all exercises with detailed work shown', 95, '2024-02-14 15:30:00'),
((SELECT id FROM assignments WHERE title = 'Algebra Basics'), 
 (SELECT id FROM users WHERE email = 'student2@ms8learning.com'),
 'Completed exercises 1-18, need help with 19-20', 85, '2024-02-15 10:15:00'),
((SELECT id FROM assignments WHERE title = 'Lab Report 1'), 
 (SELECT id FROM users WHERE email = 'student3@ms8learning.com'),
 'Detailed lab report with observations and conclusions', 72, '2024-02-17 14:45:00');

-- Insert sample analytics events
INSERT INTO analytics_events (user_id, course_id, event_type, event_data) VALUES
((SELECT id FROM users WHERE email = 'student1@ms8learning.com'),
 (SELECT id FROM courses WHERE code = 'MATH101'),
 'login', '{"timestamp": "2024-01-15T09:00:00Z", "device": "desktop"}'),
((SELECT id FROM users WHERE email = 'student1@ms8learning.com'),
 (SELECT id FROM courses WHERE code = 'MATH101'),
 'assignment_submitted', '{"assignment_id": "uuid", "points": 95}'),
((SELECT id FROM users WHERE email = 'student2@ms8learning.com'),
 (SELECT id FROM courses WHERE code = 'MATH101'),
 'login', '{"timestamp": "2024-01-15T09:30:00Z", "device": "mobile"}'),
((SELECT id FROM users WHERE email = 'teacher1@ms8learning.com'),
 (SELECT id FROM courses WHERE code = 'MATH101'),
 'course_accessed', '{"action": "view_grades", "timestamp": "2024-01-15T10:00:00Z"}');

-- Update course grades based on submissions
UPDATE enrollments SET grade = (
    SELECT AVG(points_earned) 
    FROM submissions s 
    JOIN assignments a ON s.assignment_id = a.id 
    WHERE a.course_id = enrollments.course_id 
    AND s.student_id = enrollments.student_id
) WHERE EXISTS (
    SELECT 1 FROM submissions s 
    JOIN assignments a ON s.assignment_id = a.id 
    WHERE a.course_id = enrollments.course_id 
    AND s.student_id = enrollments.student_id
);
