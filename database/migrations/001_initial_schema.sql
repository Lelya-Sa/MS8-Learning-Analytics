-- Migration: Initial database schema for MS8 Learning Analytics
-- Version: 001
-- Description: Create initial tables and policies for learning analytics platform

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS public.migrations (
  id SERIAL PRIMARY KEY,
  version TEXT UNIQUE NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert this migration record
INSERT INTO public.migrations (version, description) VALUES
  ('001', 'Initial database schema for MS8 Learning Analytics')
ON CONFLICT (version) DO NOTHING;

-- Run the main schema
\i schema.sql

-- Create views for common queries
CREATE OR REPLACE VIEW public.user_course_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.role,
  COUNT(e.id) as total_courses,
  COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_courses,
  COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses
FROM public.users u
LEFT JOIN public.enrollments e ON u.id = e.user_id
GROUP BY u.id, u.email, u.name, u.role;

CREATE OR REPLACE VIEW public.course_analytics_summary AS
SELECT 
  c.id as course_id,
  c.title,
  c.course_code,
  COUNT(DISTINCT e.user_id) as enrolled_students,
  COUNT(DISTINCT la.id) as total_events,
  COUNT(DISTINCT a.id) as total_assignments,
  AVG(s.points_earned::float / a.max_points * 100) as average_grade
FROM public.courses c
LEFT JOIN public.enrollments e ON c.id = e.course_id
LEFT JOIN public.learning_analytics la ON c.id = la.course_id
LEFT JOIN public.assignments a ON c.id = a.course_id
LEFT JOIN public.submissions s ON a.id = s.assignment_id
GROUP BY c.id, c.title, c.course_code;

-- Create function to get user analytics
CREATE OR REPLACE FUNCTION public.get_user_analytics(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  event_type TEXT,
  event_count BIGINT,
  last_event TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    la.event_type,
    COUNT(*) as event_count,
    MAX(la.created_at) as last_event
  FROM public.learning_analytics la
  WHERE la.user_id = user_uuid
    AND la.created_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY la.event_type
  ORDER BY event_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get course analytics
CREATE OR REPLACE FUNCTION public.get_course_analytics(course_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  event_type TEXT,
  event_count BIGINT,
  unique_users BIGINT,
  last_event TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    la.event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT la.user_id) as unique_users,
    MAX(la.created_at) as last_event
  FROM public.learning_analytics la
  WHERE la.course_id = course_uuid
    AND la.created_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY la.event_type
  ORDER BY event_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions on new objects
GRANT SELECT ON public.user_course_summary TO anon, authenticated;
GRANT SELECT ON public.course_analytics_summary TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_analytics(UUID, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_analytics(UUID, INTEGER) TO anon, authenticated;
