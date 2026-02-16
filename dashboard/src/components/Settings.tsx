import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Shield, Bell, Palette, Database, Server } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from './ThemeProvider';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: false,
    autoRefresh: true,
    refreshInterval: 10,
    maxLogEntries: 50,
    apiTimeout: 30,
    enableHeartbeat: true,
    heartbeatInterval: 30,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('dashboard_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaults = {
      notifications: true,
      soundEnabled: false,
      autoRefresh: true,
      refreshInterval: 10,
      maxLogEntries: 50,
      apiTimeout: 30,
      enableHeartbeat: true,
      heartbeatInterval: 30,
    };
    setSettings(defaults);
    setTheme('dark');
    localStorage.removeItem('dashboard_settings');
  };

  useEffect(() => {
    const stored = localStorage.getItem('dashboard_settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <SettingsIcon className="text-eth-accent" size={32} />
          SYSTEM CONFIGURATION
        </h1>
        <p className="text-eth-500 text-sm">Customize dashboard behavior and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-eth-800 border border-eth-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-eth-accent data-[state=active]:text-eth-950">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-eth-accent data-[state=active]:text-eth-950">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-eth-accent data-[state=active]:text-eth-950">
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-eth-accent data-[state=active]:text-eth-950">
            Security
          </TabsTrigger>
        </TabsList>

        {/* GENERAL SETTINGS */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-eth-900 border-eth-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="text-eth-accent" size={20} />
                <CardTitle className="text-white">Appearance</CardTitle>
              </div>
              <CardDescription className="text-eth-500">
                Customize the visual appearance of the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Theme</Label>
                  <p className="text-xs text-eth-500 mt-1">Select your preferred color scheme</p>
                </div>
                <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                  <SelectTrigger className="w-[180px] bg-eth-800 border-eth-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-eth-800 border-eth-700 text-white">
                    <SelectItem value="dark">🌙 Dark Mode</SelectItem>
                    <SelectItem value="light">☀️ Light Mode</SelectItem>
                    <SelectItem value="auto">🔄 Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-eth-900 border-eth-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <RefreshCw className="text-eth-accent" size={20} />
                <CardTitle className="text-white">Auto-Refresh</CardTitle>
              </div>
              <CardDescription className="text-eth-500">
                Control automatic data updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Enable Auto-Refresh</Label>
                  <p className="text-xs text-eth-500 mt-1">Automatically fetch new data</p>
                </div>
                <Switch 
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => setSettings({...settings, autoRefresh: checked})}
                />
              </div>

              {settings.autoRefresh && (
                <div className="space-y-2">
                  <Label className="text-white text-sm">Refresh Interval (seconds)</Label>
                  <Input 
                    type="number"
                    min="5"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) => setSettings({...settings, refreshInterval: parseInt(e.target.value)})}
                    className="bg-eth-800 border-eth-700 text-white"
                  />
                  <p className="text-xs text-eth-500">Current: Every {settings.refreshInterval} seconds</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-eth-900 border-eth-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="text-eth-accent" size={20} />
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </div>
              <CardDescription className="text-eth-500">
                Manage how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Enable Notifications</Label>
                  <p className="text-xs text-eth-500 mt-1">Show system notifications</p>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Sound Alerts</Label>
                  <p className="text-xs text-eth-500 mt-1">Play sound for important events</p>
                </div>
                <Switch 
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, soundEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERFORMANCE */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-eth-900 border-eth-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="text-eth-accent" size={20} />
                <CardTitle className="text-white">Data Management</CardTitle>
              </div>
              <CardDescription className="text-eth-500">
                Optimize data handling and storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white text-sm">Maximum Log Entries</Label>
                <Input 
                  type="number"
                  min="10"
                  max="500"
                  value={settings.maxLogEntries}
                  onChange={(e) => setSettings({...settings, maxLogEntries: parseInt(e.target.value)})}
                  className="bg-eth-800 border-eth-700 text-white"
                />
                <p className="text-xs text-eth-500">Limit activity log display to prevent performance issues</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">API Timeout (seconds)</Label>
                <Input 
                  type="number"
                  min="5"
                  max="120"
                  value={settings.apiTimeout}
                  onChange={(e) => setSettings({...settings, apiTimeout: parseInt(e.target.value)})}
                  className="bg-eth-800 border-eth-700 text-white"
                />
                <p className="text-xs text-eth-500">Maximum time to wait for API responses</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-eth-900 border-eth-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Server className="text-eth-accent" size={20} />
                <CardTitle className="text-white">Heartbeat Service</CardTitle>
              </div>
              <CardDescription className="text-eth-500">
                Configure system health monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Enable Heartbeat</Label>
                  <p className="text-xs text-eth-500 mt-1">Monitor system status automatically</p>
                </div>
                <Switch 
                  checked={settings.enableHeartbeat}
                  onCheckedChange={(checked) => setSettings({...settings, enableHeartbeat: checked})}
                />
              </div>

              {settings.enableHeartbeat && (
                <div className="space-y-2">
                  <Label className="text-white text-sm">Heartbeat Interval (seconds)</Label>
                  <Input 
                    type="number"
                    min="10"
                    max="300"
                    value={settings.heartbeatInterval}
                    onChange={(e) => setSettings({...settings, heartbeatInterval: parseInt(e.target.value)})}
                    className="bg-eth-800 border-eth-700 text-white"
                  />
                  <p className="text-xs text-eth-500">How often to check system health</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-eth-900 border-eth-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="text-eth-accent" size={20} />
                <CardTitle className="text-white">Security Settings</CardTitle>
              </div>
              <CardDescription className="text-eth-500">
                Manage access and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="text-amber-400" size={18} />
                  <h4 className="text-amber-400 font-bold text-sm">Security Notice</h4>
                </div>
                <p className="text-xs text-eth-300">
                  Advanced security features are currently in development. Authentication and role-based access control will be available in a future update.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Current Clearance Level</Label>
                <div className="flex items-center gap-3 p-3 bg-eth-800 rounded-lg border border-eth-700">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-eth-accent font-bold text-sm">LEVEL 4 - FULL ACCESS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-eth-700">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="border-eth-700 text-eth-500 hover:text-white hover:border-eth-accent"
        >
          <RefreshCw size={16} className="mr-2" />
          Reset to Defaults
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-eth-accent text-eth-950 font-bold hover:bg-eth-accent/90"
        >
          <Save size={16} className="mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
