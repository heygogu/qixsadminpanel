"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import PageContainer from '@/components/layouts/page-container';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import {
    Bell,
    Mail,
    MessageSquare,
    Phone,
    Globe,
    AlertCircle,
    Save,
    Settings,
    RefreshCcw,
} from "lucide-react";

const NotificationSettings = () => {
    const [hasChanges, setHasChanges] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    const handleChange = () => {
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHasChanges(false);
        setSaving(false);
    };

    return (
        <div className="container mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="h-6 w-6" />
                            <div>
                                <CardTitle>Notification Settings</CardTitle>
                                <CardDescription>Manage how you receive notifications</CardDescription>
                            </div>
                        </div>
                        {hasChanges && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Unsaved Changes
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Email Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive updates via email</p>
                                </div>
                            </div>
                            <Switch onCheckedChange={handleChange} defaultChecked />
                        </div>
                        <div className="ml-12 space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">New ticket updates</Label>
                                <Switch onCheckedChange={handleChange} defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Account activity</Label>
                                <Switch onCheckedChange={handleChange} defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Newsletter</Label>
                                <Switch onCheckedChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* SMS Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">SMS Notifications</h3>
                                    <p className="text-sm text-gray-500">Get notified via text message</p>
                                </div>
                            </div>
                            <Switch onCheckedChange={handleChange} />
                        </div>
                        <div className="ml-12 space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Security alerts</Label>
                                <Switch onCheckedChange={handleChange} defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Payment confirmations</Label>
                                <Switch onCheckedChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Web Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Web Notifications</h3>
                                    <p className="text-sm text-gray-500">Browser notifications</p>
                                </div>
                            </div>
                            <Switch onCheckedChange={handleChange} defaultChecked />
                        </div>
                        <div className="ml-12 space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">New messages</Label>
                                <Switch onCheckedChange={handleChange} defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Task updates</Label>
                                <Switch onCheckedChange={handleChange} defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">System alerts</Label>
                                <Switch onCheckedChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <Alert className="mt-6 bg-blue-50 dark:bg-blue-950">
                        <MessageSquare className="h-4 w-4" />
                        <AlertDescription>
                            Changes to notification settings may take a few minutes to apply across all systems.
                        </AlertDescription>
                    </Alert>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            disabled={!hasChanges || saving}
                        >
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className="gap-2"
                        >
                            {saving ? (
                                <>
                                    <Settings className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <PageContainer>
                <NotificationSettings />
            </PageContainer>
        </DashboardLayout>
    );
};