import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Avatar, Input, Button, Alert } from '../components/common';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); toast.success("Profile preferences saved."); }, 1000);
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-industrial-700 pb-4">
        <h2 className="text-xl font-medium text-industrial-100 tracking-tight">Operator Profile</h2>
        <p className="text-industrial-400 mt-1 text-sm">Manage your clearance details and personal information.</p>
      </div>

      <Alert type="warning" title="Clearance Renewal Required" message="Your Tier 4 security clearance will expire in 14 days." dismissible />
      
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar size="xl" fallbackInitials="JD" status="online" />
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-medium text-industrial-100 mb-1">John Doe</h2>
              <p className="text-industrial-400 text-sm mb-4">Senior Plant Operator</p>
              
              <div className="flex flex-col sm:flex-row gap-6 bg-industrial-900 border border-industrial-700 rounded-md p-4">
                <div>
                  <p className="text-xs text-industrial-500 uppercase tracking-wider mb-1">Clearance</p>
                  <p className="font-medium text-industrial-100">Tier 4</p>
                </div>
                <div className="hidden sm:block w-px bg-industrial-700"></div>
                <div>
                  <p className="text-xs text-industrial-500 uppercase tracking-wider mb-1">ID Number</p>
                  <p className="font-mono text-industrial-100">OP-8924</p>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm">Change Photo</Button>
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader className="border-b border-industrial-700 pb-4 mb-4">
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" defaultValue="John Doe" />
              <Input label="Email Address" type="email" defaultValue="jdoe@industrial-corp.com" readOnly helperText="Email bound to SSO." />
              <Input label="Department" defaultValue="Reactor Maintenance" readOnly />
              <Input label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3 pt-6 mt-2 border-t border-industrial-700">
            <Button type="button" variant="ghost">Revert</Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}