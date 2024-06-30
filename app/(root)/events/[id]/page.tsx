import React from 'react';
import Image from 'next/image';
import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import dynamic from 'next/dynamic';
import CommentSection from '@/components/shared/CommentSection'; // Nouveau composant pour gérer les commentaires
import mongoose from 'mongoose';

const ClientSocialShare = dynamic(() => import('@/components/shared/ClientSocialShare'), { ssr: false });

export const revalidate = 60; // Revalidation ISR (Incremental Static Regeneration)

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const event = await getEventById(id);
  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });


  const { sessionClaims } = auth();
  let role="";
  
  if(sessionClaims){
    const userId = new mongoose.Types.ObjectId(sessionClaims?.userId as string);
    const user = await getUserById(userId.toString());
    role=user?.role;
  }

  const title = event.title;

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image 
            src={event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className='h2-bold'>{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? 'FREE' : `${event.price}DA`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{' '}
                  <span className="text-primary-500">{event.organizer.firstName} {event.organizer.lastName}</span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} role={role} />

            <div className="flex flex-col gap-5">
              <div className='flex gap-2 md:gap-3'>
                <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} - {' '}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p style={{ marginLeft: '10px' }}>
                    {formatDateTime(event.endDateTime).dateOnly} -  {' '}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div><div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Description:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <a href={event.url} className="p-medium-16 lg:p-regular-18 text-primary-500 underline" target="_blank" rel="noopener noreferrer">{event.url}</a>
            </div>


            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Social Share:</p>
              <div className="flex gap-4">
                <ClientSocialShare eventId={event._id} title={title} />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des commentaires */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Commentaires</h2>
        <CommentSection eventId={event._id} role={role} />
      </section>

      {/* EVENTS with the same category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection 
            data={relatedEvents?.data}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={3}
            page={searchParams.page as string}
            totalPages={relatedEvents?.totalPages}
          />
      </section>
    </>
  );
}

export default EventDetails;