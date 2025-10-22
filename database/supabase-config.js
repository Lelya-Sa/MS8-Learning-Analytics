// MS8 Learning Analytics - Supabase Configuration
// Database connection and configuration for Supabase

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection test
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
        
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        return false;
    }
}

// Analytics functions
const analytics = {
    // Get learning analytics overview
    async getOverview() {
        try {
            const { data, error } = await supabase
                .from('learning_progress')
                .select(`
                    course_id,
                    courses(title, code),
                    progress_percentage,
                    time_spent
                `)
                .order('last_accessed', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching analytics overview:', error);
            return null;
        }
    },
    
    // Get student progress
    async getStudentProgress(studentId) {
        try {
            const { data, error } = await supabase
                .from('learning_progress')
                .select(`
                    *,
                    courses(title, code)
                `)
                .eq('student_id', studentId);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching student progress:', error);
            return null;
        }
    },
    
    // Get course analytics
    async getCourseAnalytics(courseId) {
        try {
            const { data, error } = await supabase
                .from('learning_progress')
                .select(`
                    student_id,
                    progress_percentage,
                    time_spent,
                    users(first_name, last_name)
                `)
                .eq('course_id', courseId);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching course analytics:', error);
            return null;
        }
    },
    
    // Track analytics event
    async trackEvent(userId, courseId, eventType, eventData = {}) {
        try {
            const { data, error } = await supabase
                .from('analytics_events')
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    event_type: eventType,
                    event_data: eventData
                });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error tracking analytics event:', error);
            return null;
        }
    }
};

// User management functions
const users = {
    // Get user by email
    async getUserByEmail(email) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    },
    
    // Create new user
    async createUser(userData) {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert(userData)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }
};

// Course management functions
const courses = {
    // Get all courses
    async getAllCourses() {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select(`
                    *,
                    users(first_name, last_name)
                `)
                .eq('is_active', true);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return null;
        }
    },
    
    // Get course by ID
    async getCourseById(courseId) {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select(`
                    *,
                    users(first_name, last_name),
                    enrollments(
                        users(first_name, last_name, email)
                    )
                `)
                .eq('id', courseId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching course:', error);
            return null;
        }
    }
};

// Export functions
module.exports = {
    supabase,
    testConnection,
    analytics,
    users,
    courses
};
