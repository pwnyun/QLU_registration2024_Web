import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

export default function CountDownModal({
  isOpen,
  setIsOpen,
  title = '提示',
  children,
  buttonText = '确认',
  optionalButton = undefined,
  countdownSeconds = 0,
}) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // When the modal is opened, reset the countdown.
    if (isOpen) {
      setRemainingTime(countdownSeconds);
    }
  }, [isOpen, countdownSeconds]);

  useEffect(() => {
    // If the modal is open and there's time remaining, start the timer.
    if (isOpen && remainingTime > 0) {
      const timerId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      // Cleanup the interval when the effect re-runs or the component unmounts.
      return () => clearInterval(timerId);
    }
  }, [isOpen, remainingTime]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 print:hidden" onClose={() => remainingTime > 0 ? null : setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto backdrop-blur">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="min-w-96 w-full max-w-fit transform rounded-2xl bg-white/90 p-6 text-left align-middle shadow-xl backdrop-blur transition-all"
                >{/*max-h-[1/3vh] */}
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className=" ">{children}</div>{/*max-h-96*/}
                  </div>

                  <div className="mt-4">
                    {optionalButton && optionalButton}

                    <button
                      type="button"
                      className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                        optionalButton && 'ml-4'
                      } px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={() => setIsOpen(false)}
                      disabled={remainingTime > 0}
                    >
                      {remainingTime > 0 ? `${buttonText} (${remainingTime}s)` : buttonText}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
