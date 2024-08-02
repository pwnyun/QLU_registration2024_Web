import {useState} from "react";

const plans = ['私家车', '出租车', '公共交通']

export default function PreCheckIn() {
  const [arriveOnTime, setArriveOnTime] = useState("");

  return (<>
      <div className="container mx-auto max-w-[750px]">

        <div
          className="fixed mt-[620px] inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true">
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}>
            {/*  clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)
          */}
          </div>
        </div>

        <div className="image-container relative mb-[20px] bg-no-repeat w-full">
          <img className="object-cover object-bottom w-full h-[calc(100%-2px)] absolute left-0 top-0 z-[-10]"
               src="/assets/banner.png"/>
          <img className="object-cover w-full h-[calc(100%-4px)]"
               src="/assets/index-bg-mask.svg"/>
          <img className="object-cover translate-x-[-50%] h-[41.58%] absolute left-[50%] bottom-[12.3%] z-10"
               src="/assets/index-avatar-circle.svg"/>
          <img className="object-cover translate-x-[-50%] h-[36.82%] absolute left-[50%] bottom-[15.3%] z-20"
               src="/assets/qlu-logo-space.png"/>
          {/*<img*/}
          {/*  className="object-cover translate-x-[-50%] translate-y-[3px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px]"*/}
          {/*  src="images/index-title.svg"/>*/}
          <div
            className="object-cover translate-x-[-50%] translate-y-[20px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px] text-nowrap text-2xl flex flex-col justify-center items-center text-qlu font-bold">
            <div>齐鲁工业大学</div>
            <div>新生预报到</div>
          </div>
        </div>

        <form method="post" action="/submit">
          <div className="border-b border-gray-900/10 p-4 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">

              <div className="sm:col-span-6">
                <label htmlFor="arrive-on-time" className="block text-sm font-medium leading-6">
                  能否按时报到
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="arrive-on-time"
                    name="arrive-on-time"
                    value={arriveOnTime}
                    onChange={(e) => setArriveOnTime(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option value="true">能够按通知书规定的时间报到</option>
                    <option value="false">无法按时报到</option>
                  </select>
                </div>
              </div>

              {/*占位*/}
              <div className="hidden sm:block sm:col-span-3"></div>

              {arriveOnTime === "true" && <>
                <div className="sm:col-span-6">
                  <label htmlFor="date" className="block text-sm font-medium leading-6">
                    拟到校时间
                  </label>
                  <div className="mt-2 w-full">
                    <input
                      type="datetime-local"
                      name="date"
                      id="date"
                      min="2024-08-30T04:00"
                      max="2024-08-30T23:30"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/*占位*/}
                <div className="hidden sm:block sm:col-span-3"></div>

                <div className="sm:col-span-6">
                  <label htmlFor="transportation" className="block text-sm font-medium leading-6">
                    到校方式
                  </label>
                  <div className="mt-2 w-full">
                    {plans.map((plan, index) => {
                      return (
                        <div key={plan}
                             className="flex items-center justify-start gap-x-2 shadow-sm"
                        >
                          <input
                            type="radio"
                            name="transportation"
                            id={`transportation-${index}`}
                            className=""
                          />
                          <label htmlFor={`transportation-${index}`} className="py-3 w-full">{plan}</label>
                        </div>)
                    })
                    }

                  </div>
                </div>
              </>}

              {arriveOnTime === "false" && <>
                <div className="sm:col-span-6">
                  <label htmlFor="reason" className="block text-sm font-medium leading-6">
                    无法按时报到原因
                  </label>
                  <div className="mt-2 w-full">
                    <textarea
                      name="reason"
                      id="reason"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </>}

              {arriveOnTime && <div className="sm:col-span-full md:flex">
                <button
                  type="submit"
                  className="rounded-md bg-qlu w-full md:w-32 md:rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  提交
                </button>
              </div>
              }

            </div>
          </div>
        </form>
      </div>

      <div
        className="w-full sticky bottom-0 bg-white/50 backdrop-blur mt-16 py-4 flex flex-col justify-center items-center text-sm text-gray-600 bg-white">
        <div>&copy;2024 齐鲁工业大学 | 网络信息中心</div>
        <div>联系方式：<a href="tel:0531-89631358">0531-89631358</a></div>
      </div>

    </>
  )
}
