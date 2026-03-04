'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Step3Property } from '@/components/onboarding/landlord/step-3-property'; // Reuse landlord property form
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Step4Portfolio({ onNext }: { onNext: (data: any) => void }) {
  const [properties, setProperties] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(true);

  const handleAddProperty = (data: any) => {
    setProperties([...properties, data]);
    setIsAdding(false);
  };

  const handleContinue = () => {
    onNext({ properties });
  };

  return (
    <div className="space-y-6">
      {properties.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Added Properties</h3>
          {properties.map((prop, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base">{prop.address}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{prop.propertyType} • {prop.numberOfUnits} Units</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Add Property</h3>
          <Step3Property onNext={handleAddProperty} />
          {properties.length > 0 && (
            <Button variant="ghost" onClick={() => setIsAdding(false)} className="mt-4">
              Cancel
            </Button>
          )}
        </div>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          Add Another Property
        </Button>
      )}

      {!isAdding && (
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={() => onNext({ properties: [] })}>
            Import Later
          </Button>
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>
      )}
      
      {/* If adding first property, show skip option */}
      {isAdding && properties.length === 0 && (
         <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={() => onNext({ properties: [] })}>
                Import Later
            </Button>
         </div>
      )}
    </div>
  );
}
