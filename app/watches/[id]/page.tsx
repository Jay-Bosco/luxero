import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import WatchDetails from '@/components/watches/WatchDetails';

interface WatchPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: WatchPageProps) {
  const supabase = createServerSupabaseClient();
  const { data: watch } = await supabase
    .from('watches')
    .select('name, description, brand')
    .eq('id', params.id)
    .single();

  if (!watch) {
    return { title: 'Watch Not Found | Luxero' };
  }

  return {
    title: `${watch.name} | Luxero`,
    description: watch.description,
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const supabase = createServerSupabaseClient();
  
  const { data: watch, error } = await supabase
    .from('watches')
    .select('*')
    .eq('id', params.id)
    .eq('active', true)
    .single();

  if (error || !watch) {
    notFound();
  }

  // Fetch related watches
  const { data: relatedWatches } = await supabase
    .from('watches')
    .select('*')
    .eq('collection', watch.collection)
    .eq('active', true)
    .neq('id', watch.id)
    .limit(3);

  return <WatchDetails watch={watch} relatedWatches={relatedWatches || []} />;
}
