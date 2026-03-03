'use client';

import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Bed, DollarSign, Search } from 'lucide-react';
import { getAppListingsUrl } from '@/lib/app-url';

export function SearchFilterBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-muted border border-border">
      <Select defaultValue="all">
        <SelectTrigger className="flex-1 min-w-0 h-11 bg-background">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="toronto">Toronto</SelectItem>
          <SelectItem value="mississauga">Mississauga</SelectItem>
          <SelectItem value="brampton">Brampton</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="flex-1 min-w-0 h-11 bg-background">
          <Home className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Property Type</SelectItem>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="suite">Suite</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="flex-1 min-w-0 h-11 bg-background">
          <Bed className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="1">1 Bed</SelectItem>
          <SelectItem value="2">2 Beds</SelectItem>
          <SelectItem value="3">3+ Beds</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="budget">
        <SelectTrigger className="flex-1 min-w-0 h-11 bg-background">
          <DollarSign className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Budget" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="budget">Budget $500 - $2,000</SelectItem>
          <SelectItem value="500-1000">$500 - $1,000</SelectItem>
          <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
          <SelectItem value="2000+">$2,000+</SelectItem>
        </SelectContent>
      </Select>
      <Button asChild size="icon" className="h-11 w-11 shrink-0 rounded-full">
        <Link href={getAppListingsUrl()}>
          <Search className="size-5" />
        </Link>
      </Button>
    </div>
  );
}
