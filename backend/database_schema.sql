-- Supabase Database Schema for Online Appointment Booking System

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  phone VARCHAR(20),
  specialization VARCHAR(255),
  bio TEXT,
  profile_picture VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  appointment_date DATE NOT NULL,
  start_time VARCHAR(10) NOT NULL, -- HH:mm format
  end_time VARCHAR(10) NOT NULL, -- HH:mm format
  duration INTEGER DEFAULT 30, -- in minutes
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  meeting_link VARCHAR(500),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability table
CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time VARCHAR(10) NOT NULL, -- HH:mm format
  end_time VARCHAR(10) NOT NULL, -- HH:mm format
  is_available BOOLEAN DEFAULT TRUE,
  breaks JSONB DEFAULT '[]', -- Array of {startTime: string, endTime: string}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week)
);

-- Reminders table
CREATE TABLE reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_type VARCHAR(50) DEFAULT 'email' CHECK (reminder_type IN ('email', 'sms', 'in-app')),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_availability_doctor_id ON availability(doctor_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_reminder_time ON reminders(reminder_time);

-- Row Level Security (RLS) policies (optional, for enhanced security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust based on your auth setup)
-- CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
-- Similar policies for other tables...