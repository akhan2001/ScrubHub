'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

export function Step3Team({ onNext }: { onNext: (data: any) => void }) {
  const [invites, setInvites] = useState([{ email: '', role: 'viewer' }]);
  const [loading, setLoading] = useState(false);

  const addInvite = () => {
    if (invites.length < 5) {
      setInvites([...invites, { email: '', role: 'viewer' }]);
    }
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const updateInvite = (index: number, field: 'email' | 'role', value: string) => {
    const newInvites = [...invites];
    newInvites[index] = { ...newInvites[index], [field]: value };
    setInvites(newInvites);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Filter out empty emails
    const validInvites = invites.filter(i => i.email.trim() !== '');
    onNext({ invites: validInvites });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-muted p-4 text-sm">
        <p>Invite team members to collaborate. They will receive an email with a signup link.</p>
      </div>

      <div className="space-y-4">
        {invites.map((invite, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`email-${index}`}>Email</Label>
              <Input 
                id={`email-${index}`} 
                type="email" 
                value={invite.email} 
                onChange={(e) => updateInvite(index, 'email', e.target.value)}
                placeholder="colleague@company.com"
              />
            </div>
            <div className="w-40 space-y-2">
              <Label htmlFor={`role-${index}`}>Role</Label>
              <Select value={invite.role} onValueChange={(val) => updateInvite(index, 'role', val)}>
                <SelectTrigger id={`role-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {invites.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeInvite(index)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {invites.length < 5 && (
        <Button type="button" variant="outline" onClick={addInvite} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Team Member
        </Button>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={() => onNext({ invites: [] })}>
          Skip for now
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
