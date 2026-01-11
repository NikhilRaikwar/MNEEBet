'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUsername } from '@/hooks/useUsername';
import { truncateAddress } from '@/lib/utils/format';
import { User } from 'lucide-react';
import Link from 'next/link';

interface UsernameDisplayProps {
  address: `0x${string}`;
  showAvatar?: boolean;
  showAddress?: boolean;
  linkToProfile?: boolean;
  className?: string;
}

export function UsernameDisplay({ 
  address, 
  showAvatar = true, 
  showAddress = false,
  linkToProfile = false,
  className = '' 
}: UsernameDisplayProps) {
  const { username, isLoading } = useUsername(address);

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div>
        {isLoading ? (
          <span className="text-muted-foreground">Loading...</span>
        ) : (
          <>
            {username ? (
              <span className="font-medium">{username}</span>
            ) : (
              <span className="font-mono text-sm">{truncateAddress(address)}</span>
            )}
            {showAddress && username && (
              <span className="text-xs text-muted-foreground ml-2 font-mono">
                {truncateAddress(address)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (linkToProfile) {
    return (
      <Link href={`/profile/${address}`} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
