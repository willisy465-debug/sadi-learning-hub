'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InstantCheckoutModal } from '@/components/checkout/InstantCheckoutModal';

interface FeaturedCourseBuyProps {
  course: {
    id: string;
    code: string;
    title: string;
    slug: string;
    priceZar: number;
    priceUsd: number;
    durationDays?: number;
    cpdPoints?: number;
  };
}

export function FeaturedCourseBuy({ course }: FeaturedCourseBuyProps) {
  const [open, setOpen] = useState(false);
  const isDemo = typeof course.id === 'string' && course.id.startsWith('demo-');

  if (isDemo) {
    return (
      <Link
        href={`/courses/${course.slug}`}
        className="col-span-1 px-4 py-3 rounded-xl bg-udemy-purple text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-udemy-purple/20 hover:bg-udemy-darkPurple transition-colors"
      >
        View & Enroll
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="col-span-1 px-4 py-3 rounded-xl bg-udemy-purple text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-udemy-purple/20 hover:bg-udemy-darkPurple transition-colors"
      >
        Buy Course
      </button>
      <InstantCheckoutModal
        course={course}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
