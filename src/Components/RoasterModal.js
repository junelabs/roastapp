'use client';

import { Fragment } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import Image from 'next/image';

export default function RoasterModal({ roaster, onClose }) {
  if (!roaster) return null;

  const {
    _id,
    name,
    location,
    imageUrl,
    description,
    website,
    cafes,
    brewGuides = [],
    rating,        // average rating from Sanity
    ratingCount,   // rating count from Sanity
  } = roaster;

  const hasCafeArray = Array.isArray(cafes) && cafes.length > 0;

  return (
    <Transition.Root show={!!roaster} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 grid place-items-center p-3 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="
                w-[min(1280px,100vw-3rem)]
                h-[calc(100vh-3rem)] md:h-[calc(100dvh-3rem)]
                overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5
              "
            >
              {/* Sticky header + tabs (non‑scrolling), scrolling content below */}
              <Tab.Group as={Fragment}>
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="shrink-0 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-6">
                        {imageUrl && (
                          <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-xl border bg-white">
                            <Image src={imageUrl} alt={name} fill className="object-contain p-2" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <Dialog.Title className="text-2xl md:text-3xl font-bold leading-tight">
                            {name}
                          </Dialog.Title>
                          {location && (
                            <p className="mt-1 text-sm md:text-base text-gray-600">
                              {location}
                            </p>
                          )}
                          <Rating value={rating} count={ratingCount} />
                        </div>

                        <button
                          onClick={onClose}
                          className="ml-auto rounded-md p-2 text-gray-500 hover:text-black hover:bg-gray-100"
                          aria-label="Close"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Tabs */}
                      <Tab.List className="mt-6 flex gap-3 border-b border-gray-200">
                        {['About', 'Cafés', 'Brew Guides'].map((label) => (
                          <Tab
                            key={label}
                            className={({ selected }) =>
                              [
                                'px-3 sm:px-4 py-2 text-sm md:text-base font-medium outline-none rounded-t-md',
                                selected
                                  ? 'border-b-2 border-gray-900 text-gray-900'
                                  : 'text-gray-500 hover:text-gray-800',
                              ].join(' ')
                            }
                          >
                            {label}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                  </div>

                  {/* Scroll port */}
                  <div
                    className="flex-1 overflow-y-auto py-6 md:py-8"
                    style={{ WebkitOverflowScrolling: 'touch' }} // iOS momentum scrolling
                  >
                    <div className="px-6 md:px-8">
                      <Tab.Panels>
                        {/* About */}
                        <Tab.Panel>
                          {description ? (
                            <div className="space-y-4">
                              <p className="text-[15px] md:text-base text-gray-800 leading-7 md:leading-8 whitespace-pre-line">
                                {description}
                              </p>
                              {website && (
                                <a
                                  href={website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block text-sm md:text-base font-medium text-gray-900 underline underline-offset-4"
                                >
                                  Visit Website →
                                </a>
                              )}
                            </div>
                          ) : (
                            <Empty text="No about info yet." />
                          )}
                        </Tab.Panel>

                        {/* Cafés */}
                        <Tab.Panel>
                          {hasCafeArray ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {cafes.map((c, i) => (
                                <div key={`${c?.name || c?.address || i}`} className="rounded-xl border border-gray-200 p-4">
                                  <div className="font-medium text-gray-900">{c?.name || 'Cafe'}</div>
                                  <div className="mt-1 text-sm text-gray-700">
                                    {[c?.address, c?.city, c?.state, c?.country].filter(Boolean).join(', ')}
                                  </div>
                                  {c?.website && (
                                    <a href={c.website} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-gray-900 underline underline-offset-4">
                                      Website
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Empty text={cafes ? String(cafes) : 'N/A'} />
                          )}
                        </Tab.Panel>

                        {/* Brew Guides */}
                        <Tab.Panel>
                          {brewGuides?.length ? (
                            <div className="space-y-5">
                              {brewGuides.map((g) => (
                                <div key={g._id || g.method} className="rounded-2xl border border-gray-200 p-5">
                                  <h3 className="text-base md:text-lg font-semibold text-gray-900">{g.method}</h3>
                                  <p className="mt-1 text-sm md:text-[15px] text-gray-700">
                                    {[
                                      g.ratio && `Ratio ${g.ratio}`,
                                      g.dose && `Dose ${g.dose}`,
                                      g.yield && `Yield ${g.yield}`,
                                      g.grind && `Grind ${g.grind}`,
                                      g.temp && `Temp ${g.temp}`,
                                      g.time && `Time ${g.time}`,
                                    ].filter(Boolean).join(' • ')}
                                  </p>
                                  {g.notes && <p className="mt-2 text-sm text-gray-700">{g.notes}</p>}
                                  {g.steps?.length ? (
                                    <ol className="mt-3 list-decimal pl-5 text-sm md:text-[15px] text-gray-800 space-y-1.5">
                                      {g.steps
                                        .slice()
                                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                        .map((s, i) => <li key={i}>{s.text}</li>)}
                                    </ol>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Empty text="No brew guides yet." />
                          )}
                        </Tab.Panel>
                      </Tab.Panels>
                    </div>
                  </div>
                </div>
              </Tab.Group>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

/* helpers */
function Rating({ value, count }) {
  if (value == null || value <= 0) return null;
  return (
    <div className="mt-2 flex items-center gap-1 text-sm md:text-[15px]">
      <span aria-hidden>⭐</span>
      <span className="font-semibold text-gray-900">{Number(value).toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="text-gray-600">
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
}

function Empty({ text }) {
  return <div className="text-sm text-gray-500">{text}</div>;
}
