import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Avatar, Input, Button, Alert } from '../components/common';
import { useToast } from '../context/ToastContext';
export default function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); toast.success("Profile preferences saved successfully!"); }, 1000);
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Alert type="warning" title="Security Clearance Renewal Required" message="Your Tier 4 security clearance will expire in 14 days. Please contact the security administrator." dismissible />
      <Card><CardContent className="p-6"><div className="flex flex-col sm:flex-row items-center sm:items-start gap-6"><Avatar size="xl" fallbackInitials="JD" status="online" /><div className="text-center sm:text-left flex-1"><h2 className="text-2xl font-bold text-white mb-1">John Doe</h2><p className="text-ai-core font-medium mb-3">Senior Plant Operator</p><div className="grid grid-cols-2 gap-4 max-w-sm mx-auto sm:mx-0 bg-industrial-900 p-4 rounded-lg border border-industrial-700"><div><p className="text-xs text-industrial-500 uppercase">Clearance</p><p className="font-semibold text-industrial-100">Tier 4</p></div><div><p className="text-xs text-industrial-500 uppercase">ID Number</p><p className="font-semibold text-industrial-100 font-mono">OP-8924</p></div></div></div><Button variant="secondary">Change Avatar</Button></div></CardContent></Card>
      <form onSubmit={handleSave}>
        <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Input label="Full Name" defaultValue="John Doe" /><Input label="Email Address" type="email" defaultValue="jdoe@industrial-corp.com" readOnly helperText="Email cannot be changed." /><Input label="Department" defaultValue="Reactor Maintenance" readOnly /><Input label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" /></div></CardContent><CardFooter className="justify-end gap-3 bg-industrial-800/50"><Button type="button" variant="ghost">Cancel</Button><Button type="submit" variant="primary" isLoading={isSaving}>Save Changes</Button></CardFooter></Card>
      </form>
    </div>
  );
}