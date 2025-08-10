-- Integration Management Tables
-- This migration creates tables for managing external API integrations

-- Integrations table
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'disconnected',
    config JSONB NOT NULL DEFAULT '{}',
    credentials JSONB NOT NULL DEFAULT '{}',
    last_sync TIMESTAMP,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_integration_type CHECK (type IN ('zatca', 'gosi', 'qiwa', 'banking')),
    CONSTRAINT valid_status CHECK (status IN ('connected', 'disconnected', 'error', 'testing'))
);

-- Integration logs table
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_log_status CHECK (status IN ('success', 'error', 'warning'))
);

-- Integration settings table for additional configuration
CREATE TABLE integration_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(integration_id, setting_key)
);

-- Webhook events table
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_type VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_webhook_integration_type CHECK (integration_type IN ('zatca', 'gosi', 'qiwa', 'banking'))
);

-- Create indexes for better performance
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_status ON integrations(status);
CREATE INDEX idx_integrations_enabled ON integrations(enabled);
CREATE INDEX idx_integration_logs_integration_id ON integration_logs(integration_id);
CREATE INDEX idx_integration_logs_created_at ON integration_logs(created_at DESC);
CREATE INDEX idx_integration_logs_status ON integration_logs(status);
CREATE INDEX idx_integration_settings_integration_id ON integration_settings(integration_id);
CREATE INDEX idx_webhook_events_integration_type ON webhook_events(integration_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies for integrations table
CREATE POLICY "Users can view integrations" ON integrations
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins can manage integrations" ON integrations
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for integration_logs table
CREATE POLICY "Users can view integration logs" ON integration_logs
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "System can insert integration logs" ON integration_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Create policies for integration_settings table
CREATE POLICY "Admins can manage integration settings" ON integration_settings
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for webhook_events table
CREATE POLICY "System can manage webhook events" ON webhook_events
    FOR ALL TO authenticated
    USING (true);

-- Insert default integration permissions
INSERT INTO permissions (permission_name, description, resource, action) VALUES
('integrations:read', 'View integration configurations', 'integrations', 'read'),
('integrations:create', 'Create new integrations', 'integrations', 'create'),
('integrations:update', 'Update integration configurations', 'integrations', 'update'),
('integrations:delete', 'Delete integrations', 'integrations', 'delete'),
('integrations:test', 'Test integration connections', 'integrations', 'test'),
('integrations:manage', 'Full integration management', 'integrations', 'manage');

-- Grant integration permissions to admin role
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u, permissions p
WHERE u.role = 'admin' AND p.permission_name LIKE 'integrations:%';